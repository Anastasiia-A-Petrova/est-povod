import http from 'node:http'
import crypto from 'node:crypto'
import 'dotenv/config'
import { searchReadyCards } from './ready-cards/index.js'

const BASE_URL = 'https://azbyka.ru/days'
const PORT = Number(process.env.PORT) || 3001

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const PUBLIC_BASE_URL =
  process.env.PUBLIC_BASE_URL || 'https://est-povod-api.onrender.com'

const telegramFiles = new Map()

function validateTelegramInitData(initData) {
  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error('TELEGRAM_BOT_TOKEN не настроен')
  }

  if (!initData || typeof initData !== 'string') {
    throw new Error('Telegram initData отсутствует')
  }

  const params = new URLSearchParams(initData)
  const receivedHash = params.get('hash')

  if (!receivedHash) {
    throw new Error('Telegram hash отсутствует')
  }

  params.delete('hash')

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n')

  const secretKey = crypto
    .createHmac('sha256', 'WebAppData')
    .update(TELEGRAM_BOT_TOKEN)
    .digest()

  const calculatedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex')

  const receivedBuffer = Buffer.from(receivedHash, 'hex')
  const calculatedBuffer = Buffer.from(calculatedHash, 'hex')

  if (
    receivedBuffer.length !== calculatedBuffer.length ||
    !crypto.timingSafeEqual(receivedBuffer, calculatedBuffer)
  ) {
    throw new Error('Telegram initData недействителен')
  }

  const userRaw = params.get('user')

  if (!userRaw) {
    throw new Error('Данные пользователя Telegram отсутствуют')
  }

  let user

  try {
    user = JSON.parse(userRaw)
  } catch {
    throw new Error('Не удалось прочитать данные пользователя Telegram')
  }

  if (!user?.id) {
    throw new Error('ID пользователя Telegram отсутствует')
  }

  return user
}

function cleanupTelegramFiles() {
  const now = Date.now()

  for (const [id, file] of telegramFiles.entries()) {
    if (file.expiresAt <= now) {
      telegramFiles.delete(id)
    }
  }
}

setInterval(cleanupTelegramFiles, 5 * 60 * 1000)

let token = null
let tokenExpiresAt = 0



// ============================================================
// AZBYKA AUTH
// ============================================================

async function login() {
  if (
    token &&
    Date.now() < tokenExpiresAt
  ) {
    return token
  }

  const email = process.env.AZBYKA_EMAIL
  const password = process.env.AZBYKA_PASSWORD

  if (!email || !password) {
    throw new Error(
      'Не найдены AZBYKA_EMAIL или AZBYKA_PASSWORD в .env',
    )
  }

  const response = await fetch(
    `${BASE_URL}/api-v2/login`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },

      body: JSON.stringify({
        email,
        password,
      }),
    },
  )

  const text = await response.text()

  if (!response.ok) {
    throw new Error(
      `Ошибка авторизации Azbyka: ${response.status} ${text}`,
    )
  }

  const data = JSON.parse(text)

  token = data.token

  // Храним токен примерно 50 минут.
  tokenExpiresAt =
    Date.now() + 50 * 60 * 1000

  return token
}


// ============================================================
// UNIVERSAL AZBYKA REQUEST
// ============================================================

async function azbykaRequest(path) {
  const authToken = await login()

  const response = await fetch(
    `${BASE_URL}${path}`,
    {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
    },
  )

  const text = await response.text()

  if (!response.ok) {
    throw new Error(
      `Azbyka API ${response.status}: ${text}`,
    )
  }

  return JSON.parse(text)
}



// ============================================================
// CACHE DATES
// ============================================================

async function getCacheDates(date) {
  return azbykaRequest(
    `/api/cache_dates?date[exact]=${encodeURIComponent(date)}`,
  )
}



// ============================================================
// DAY
// ============================================================

async function getDay(date) {
  return azbykaRequest(
    `/api/day?date[exact]=${encodeURIComponent(date)}`,
  )
}



// ============================================================
// ICON OF OUR LADY
// ============================================================

async function getOurLadyIcon(id) {
  return azbykaRequest(
    `/api/icons_of_our_ladies/${id}`,
  )
}



// ============================================================
// EXTRACT REAL HREF FROM Azbyka HTML
//
// Azbyka returns things like:
//
// <a href="http://azbyka.ru/days/ikona-slovenskaja">
//   Словенская
// </a>
//
// We MUST use this real href instead of constructing
// a URL from uri.
// ============================================================

function extractHref(html) {
  if (!html) {
    return null
  }

  const match =
    String(html).match(
      /href\s*=\s*["']([^"']+)["']/i,
    )

  if (!match) {
    return null
  }

  let href = match[1]

  // Azbyka sometimes returns http://.
  // For the browser we prefer https://.
  href = href.replace(
    /^http:\/\//i,
    'https://',
  )

  return href
}



// ============================================================
// BUILD REAL LINKS FROM /api/day
// ============================================================

function buildPriorityLinks(priorities) {
  const holidayLinks = new Map()
  const iconLinks = new Map()
  const saintGroupLinks = new Map()

  for (const priority of priorities) {
    const memorialDay =
      priority?.memorialDay

    if (!memorialDay) {
      continue
    }

    const href =
      extractHref(
        memorialDay.cacheTitle,
      )

    if (!href) {
      continue
    }



    // --------------------------------------------------------
    // HOLIDAY
    //
    // В /api/day у holiday нет id,
    // поэтому связываем по title.
    // --------------------------------------------------------

    const holiday =
      memorialDay.holiday

    if (holiday?.title) {
      holidayLinks.set(
        holiday.title,
        href,
      )
    }



    // --------------------------------------------------------
    // ICON OF OUR LADY
    //
    // Здесь тоже нет id — есть только title.
    // --------------------------------------------------------

    const iconOfOurLady =
      memorialDay.iconOfOurLady

    if (iconOfOurLady?.title) {
      iconLinks.set(
        iconOfOurLady.title,
        href,
      )
    }



    // --------------------------------------------------------
    // SAINTS GROUP
    // --------------------------------------------------------

    const saintsGroup =
      memorialDay.saintsGroup

    if (saintsGroup?.cacheTitle) {
      saintGroupLinks.set(
        saintsGroup.cacheTitle,
        href,
      )
    }
  }

  return {
    holidayLinks,
    iconLinks,
    saintGroupLinks,
  }
}



// ============================================================
// SELECT BEST IMAGE
// ============================================================

function getBestIconImage(icon) {
  if (!icon?.icons?.length) {
    return null
  }

  const availableImages =
    icon.icons.filter(
      (image) =>
        image?.preview_absolute_url_2x ||
        image?.preview_absolute_url ||
        image?.original_absolute_url,
    )

  if (!availableImages.length) {
    return null
  }

  const sorted =
    [...availableImages].sort(
      (a, b) =>
        (a.priority ?? 999999) -
        (b.priority ?? 999999),
    )

  const image = sorted[0]

  return (
    image.preview_absolute_url_2x ||
    image.preview_absolute_url ||
    image.original_absolute_url ||
    null
  )
}



// ============================================================
// BUILD ORTHODOX DATE
// ============================================================

async function buildOrthodoxDate(date) {
  const [
    cacheData,
    dayData,
  ] = await Promise.all([
    getCacheDates(date),
    getDay(date),
  ])

  const abstractDate =
    cacheData?.[0]?.abstractDate || {}

  // /api/day can contain several abstractDate objects.
  // We collect priorities from all of them.
  const priorities =
    (dayData || [])
      .flatMap(
        (item) =>
          item?.abstractDate?.priorities || [],
      )



  // ==========================================================
  // REAL LINKS FROM /api/day
  // ==========================================================

  const {
    holidayLinks,
    iconLinks,
    saintGroupLinks,
  } =
    buildPriorityLinks(priorities)



  // ==========================================================
  // HOLIDAYS
  // ==========================================================

  const holidays =
    abstractDate.holidays || []

  const normalizedHolidays =
    holidays.map((holiday) => ({
      id: holiday.id,

      title: holiday.title,

      uri: holiday.uri,

      // IMPORTANT:
      // We use the real href returned by /api/day.
      link:
        holidayLinks.get(holiday.title) ||
        null,
    }))



  // ==========================================================
  // MAIN HOLIDAY
  //
  // First use holiday from cache_dates.
  // Then look through /api/day priorities.
  // This is important for Easter and similar dates.
  // ==========================================================

  let mainHoliday =
    normalizedHolidays[0] || null



  for (const priority of priorities) {
    const holiday =
      priority?.memorialDay?.holiday

    if (!holiday?.title) {
      continue
    }

    const matchingHoliday =
      normalizedHolidays.find(
        (item) =>
          (
            item.id &&
            holiday.id &&
            item.id === holiday.id
          ) ||
          item.title === holiday.title,
      )

    if (matchingHoliday) {
      mainHoliday =
        matchingHoliday

      break
    }



    // Sometimes /api/day knows about a holiday
    // which isn't present in cache_dates.
    mainHoliday = {
      id: holiday.id ?? null,

      title: holiday.title,

      uri: null,

      link:
        holiday.title
          ? holidayLinks.get(
              holiday.title,
            ) || extractHref(
              priority?.memorialDay?.cacheTitle,
            )
          : extractHref(
              priority?.memorialDay?.cacheTitle,
            ),
    }

    break
  }



  // ==========================================================
  // ICONS
  // ==========================================================

  const iconRelations =
    abstractDate
      .iconsOfOurLadyAbstractDates || []

  const icons = []

  for (const relation of iconRelations) {
    const iconId =
      relation?.iconsOfOurLady?.id

    if (!iconId) {
      continue
    }

    try {
      const icon =
        await getOurLadyIcon(iconId)

      icons.push({
        id: icon.id,

        title: icon.title,

        uri: icon.uri,

        link:
          iconLinks.get(icon.title) ||
          (
            icon.uri
              ? `https://azbyka.ru/days/ikona-${icon.uri}`
              : null
          ),

        imageUrl:
          getBestIconImage(icon),
      })

    } catch (error) {
      console.warn(
        `⚠️ Не удалось получить икону #${iconId}:`,
        error.message,
      )
    }
  }



  // ==========================================================
  // SAINTS GROUPS
  // ==========================================================

  const saintsGroups =
    abstractDate
      .saintsGroupAbstractDate || []

  const saints =
    saintsGroups
      .map(
        (item) =>
          item?.saintsGroup,
      )
      .filter(Boolean)
      .map((saint) => ({
        id: saint.id,

        title: saint.cacheTitle,

        uri: saint.uri,

        // IMPORTANT:
        // Again, use the real href from /api/day.
        link:
          saintGroupLinks.get(
            saint.cacheTitle,
          ) || null,
      }))



  // ==========================================================
  // RETURN
  // ==========================================================

  return {
    date,

    holiday: mainHoliday,

    holidays:
      normalizedHolidays,

    icons,

    saints,

    priorities,
  }
}



// ============================================================
// READ JSON BODY
// ============================================================

async function readJsonBody(request) {
  const chunks = []

  for await (const chunk of request) {
    chunks.push(chunk)
  }

  const body =
    Buffer.concat(chunks).toString('utf8')

  if (!body.trim()) {
    return {}
  }

  try {
    return JSON.parse(body)
  } catch {
    throw new Error(
      'Некорректный JSON в теле запроса',
    )
  }
}

// ============================================================
// HTTP SERVER
// ============================================================

const server =
  http.createServer(
    async (
      request,
      response,
    ) => {

      // ------------------------------------------------------
      // CORS
      // ------------------------------------------------------

      response.setHeader(
        'Access-Control-Allow-Origin',
        '*',
      )

      response.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS',
      )

      response.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type',
      )



      // ------------------------------------------------------
      // PREFLIGHT
      // ------------------------------------------------------

      if (
        request.method === 'OPTIONS'
      ) {
        response.writeHead(204)
        response.end()
        return
      }



      const url =
        new URL(
          request.url,
          `http://localhost:${PORT}`,
        )

      if (
        request.method === 'POST' &&
        request.url === '/api/telegram/download'
      ) {
        try {
          const body = await readJsonBody(request)

          const {
            imageBase64,
            filename = 'otkrytka.png',
          } = body

          if (!imageBase64) {
            response.writeHead(400, {
              'Content-Type':
                'application/json; charset=utf-8',
            })

            response.end(
              JSON.stringify({
                ok: false,
                error:
                  'imageBase64 is required',
              }),
            )

            return
          }

          const base64Data =
            imageBase64.replace(
              /^data:image\/png;base64,/,
              '',
            )

          const imageBuffer =
            Buffer.from(
              base64Data,
              'base64',
            )

          if (!imageBuffer.length) {
            response.writeHead(400, {
              'Content-Type':
                'application/json; charset=utf-8',
            })

            response.end(
              JSON.stringify({
                ok: false,
                error: 'Empty image',
              }),
            )

            return
          }

          const fileId =
            crypto.randomUUID()

          telegramFiles.set(fileId, {
            buffer: imageBuffer,
            contentType: 'image/png',
            filename,
            expiresAt:
              Date.now() +
              30 * 60 * 1000,
          })

          const baseUrl =
            process.env.PUBLIC_BASE_URL ||
            'https://est-povod-api.onrender.com'

          const downloadUrl =
            `${baseUrl}/api/telegram/download/${fileId}`

          response.writeHead(200, {
            'Content-Type':
              'application/json; charset=utf-8',

            'Access-Control-Allow-Origin':
              '*',
          })

          response.end(
            JSON.stringify({
              ok: true,
              downloadUrl,
            }),
          )
        } catch (error) {
          console.error(
            'Download card error:',
            error,
          )

          response.writeHead(500, {
            'Content-Type':
              'application/json; charset=utf-8',

            'Access-Control-Allow-Origin':
              '*',
          })

          response.end(
            JSON.stringify({
              ok: false,
              error:
                error?.message ||
                'Failed to prepare download',
            }),
          )
        }

        return
      }

      if (
        request.method === 'GET' &&
        request.url.startsWith(
          '/api/telegram/download/',
        )
      ) {
        const fileId =
          request.url
            .split('/api/telegram/download/')[1]
            ?.split('?')[0]

        const file =
          telegramFiles.get(fileId)

        if (
          !file ||
          file.expiresAt < Date.now()
        ) {
          response.writeHead(404, {
            'Content-Type':
              'text/plain; charset=utf-8',
          })

          response.end(
            'Файл не найден или срок ссылки истёк.',
          )

          return
        }

        response.writeHead(200, {
          'Content-Type':
            file.contentType ||
            'image/png',

          'Content-Length':
            file.buffer.length,

          'Content-Disposition':
            `attachment; filename="otkrytka.png"; filename*=UTF-8''${encodeURIComponent(file.filename || 'otkrytka.png')}`,   

          'Cache-Control':
            'no-store',

          'Access-Control-Allow-Origin':
            '*',
        })

        response.end(file.buffer)

        return
      }
    
      if (request.method === 'POST' && request.url === '/api/telegram/share') {
        try {
          const body = await readJsonBody(request)

          const {
            initData,
            imageBase64,
            caption = '',
            filename = 'otkrytka.jpg',
          } = body

          // Проверяем, что запрос действительно пришёл
          // от открывшего Mini App пользователя Telegram.
          const telegramUser = validateTelegramInitData(initData)

          if (!imageBase64 || typeof imageBase64 !== 'string') {
            throw new Error('Изображение открытки отсутствует')
          }

          // Убираем возможный префикс:
          // data:image/jpeg;base64,...
          const base64 = imageBase64.replace(
            /^data:image\/jpeg;base64,/,
            ''
          )

          const imageBuffer = Buffer.from(base64, 'base64')

          if (!imageBuffer.length) {
            throw new Error('Не удалось прочитать изображение открытки')
          }

          // Защита от слишком больших файлов.
          if (imageBuffer.length > 10 * 1024 * 1024) {
            throw new Error('Изображение открытки слишком большое')
          }

          const fileId = crypto.randomUUID()

          telegramFiles.set(fileId, {
            buffer: imageBuffer,
            contentType: 'image/jpeg',
            filename,
            expiresAt: Date.now() + 30 * 60 * 1000,
          })

          const imageUrl =
            `${PUBLIC_BASE_URL}/api/telegram/file/${fileId}`           

          const telegramResponse = await fetch(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/savePreparedInlineMessage`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                user_id: telegramUser.id,

                result: {
                  type: 'photo',
                  id: fileId,
                  photo_url: imageUrl,
                  thumbnail_url: imageUrl,
                  caption: caption || 'ЕСТЬ ПОВОД!',
                  parse_mode: 'HTML',
                },

                allow_user_chats: true,
                allow_group_chats: true,
                allow_channel_chats: true,
                allow_bot_chats: false,
              }),
            }
          )

          const telegramData = await telegramResponse.json()

          if (!telegramResponse.ok || !telegramData.ok) {
            console.error(
              'Telegram savePreparedInlineMessage error:',
              telegramData
            )

            throw new Error(
              telegramData.description ||
              'Telegram не смог подготовить открытку'
            )
          }

          response.writeHead(200, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
          })

          response.end(
            JSON.stringify({
              ok: true,
              msgId: telegramData.result.id,
              fileUrl: imageUrl,
            })
          )

          return
        } catch (error) {
          console.error(
            'Telegram share preparation error:',
            error
          )

          response.writeHead(400, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
          })

          response.end(
            JSON.stringify({
              ok: false,
              error: error.message || 'Не удалось подготовить открытку',
            })
          )

          return
        }
      }
        
      if (
        request.method === 'GET' &&
        request.url.startsWith('/api/telegram/file/')
      ) {
        try {
          const fileId = request.url.split('/').pop()

          const file = telegramFiles.get(fileId)

          if (!file) {
            response.writeHead(404, {
              'Content-Type': 'application/json; charset=utf-8',
              'Access-Control-Allow-Origin': '*',
            })

            response.end(
              JSON.stringify({
                ok: false,
                error: 'Файл открытки не найден или срок его хранения истёк',
              })
            )

            return
          }

          response.writeHead(200, {
            'Content-Type': file.contentType || 'image/jpeg',
            'Content-Length': file.buffer.length,
            'Cache-Control': 'no-store',
            'Access-Control-Allow-Origin': '*',
          })

          response.end(file.buffer)
          return
        } catch (error) {
          console.error(
            'Telegram file error:',
            error
          )

          response.writeHead(500, {
            'Content-Type': 'application/json; charset=utf-8',
            'Access-Control-Allow-Origin': '*',
          })

          response.end(
            JSON.stringify({
              ok: false,
              error: 'Не удалось отдать файл открытки',
            })
          )

          return
        }
      }

      // ------------------------------------------------------
      // HEALTH CHECK
      // ------------------------------------------------------

      if (
        request.method === 'GET' &&
        url.pathname === '/api/health'
      ) {
        response.writeHead(200, {
          'Content-Type':
            'application/json; charset=utf-8',
        })

        response.end(
          JSON.stringify({
            ok: true,
            service: 'azbyka',
          }),
        )

        return
      }

      // ------------------------------------------------------
      // READY CARDS
      // ------------------------------------------------------

      if (
        request.method === 'POST' &&
        url.pathname === '/api/ready-cards'
      ) {
        try {
          const body =
            await readJsonBody(request)

          const title =
            String(body?.title || '').trim()

          if (!title) {
            response.writeHead(400, {
              'Content-Type':
                'application/json; charset=utf-8',
            })

            response.end(
              JSON.stringify({
                error:
                  'Не указано название праздника. Передай title.',
              }),
            )

            return
          }

          const result =
            await searchReadyCards(title)

          response.writeHead(200, {
            'Content-Type':
              'application/json; charset=utf-8',
          })

          response.end(
            JSON.stringify(result),
          )
        } catch (error) {
          console.error(
            '❌ Ошибка поиска готовых открыток:',
            error,
          )

          response.writeHead(500, {
            'Content-Type':
              'application/json; charset=utf-8',
          })

          response.end(
            JSON.stringify({
              error:
                error.message ||
                'Ошибка поиска готовых открыток',
            }),
          )
        }

        return
      }

      // ------------------------------------------------------
      // ORTHODOX DATE
      // ------------------------------------------------------

      if (
        request.method === 'GET' &&
        url.pathname === '/api/orthodox'
      ) {
        const date =
          url.searchParams.get(
            'date',
          )

        if (!date) {
          response.writeHead(400, {
            'Content-Type':
              'application/json; charset=utf-8',
          })

          response.end(
            JSON.stringify({
              error:
                'Не указана дата. Используй ?date=YYYY-MM-DD',
            }),
          )

          return
        }

        // Simple date validation.
        if (
          !/^\d{4}-\d{2}-\d{2}$/.test(
            date,
          )
        ) {
          response.writeHead(400, {
            'Content-Type':
              'application/json; charset=utf-8',
          })

          response.end(
            JSON.stringify({
              error:
                'Неверный формат даты. Используй YYYY-MM-DD',
            }),
          )

          return
        }

        try {
          const result =
            await buildOrthodoxDate(
              date,
            )

          response.writeHead(200, {
            'Content-Type':
              'application/json; charset=utf-8',
          })

          response.end(
            JSON.stringify(result),
          )
        } catch (error) {
          console.error(
            '❌ Ошибка Azbyka:',
            error,
          )

          response.writeHead(500, {
            'Content-Type':
              'application/json; charset=utf-8',
          })

          response.end(
            JSON.stringify({
              error:
                error.message ||
                'Ошибка Azbyka API',
            }),
          )
        }

        return
      }



      // ------------------------------------------------------
      // 404
      // ------------------------------------------------------

      response.writeHead(404, {
        'Content-Type':
          'application/json; charset=utf-8',
      })

      response.end(
        JSON.stringify({
          error:
            'Маршрут не найден',
        }),
      )
    },
  )



// ============================================================
// START
// ============================================================

server.listen(
  PORT,
  () => {
    console.log('')
    console.log(
      '==========================================',
    )
    console.log(
      '🕊️  AZBYKA BACKEND',
    )
    console.log(
      '==========================================',
    )
    console.log(
      `Сервер: http://localhost:${PORT}`,
    )
    console.log(
      `Проверка: http://localhost:${PORT}/api/health`,
    )
    console.log(
      `День: http://localhost:${PORT}/api/orthodox?date=2026-10-06`,
    )
    console.log(
      `Открытки: http://localhost:${PORT}/api/ready-cards`,
    )
    console.log(
      '==========================================',
    )
    console.log('')
  },
)