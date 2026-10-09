import http from 'node:http'
import 'dotenv/config'
import { searchReadyCards } from './ready-cards/index.js'

const BASE_URL = 'https://azbyka.ru/days'
const PORT = 3001

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

  console.log('🔐 Авторизация в Azbyka API...')

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

  console.log(
    '✅ Azbyka API: авторизация успешна',
  )

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

          console.log('')
          console.log(
            '🖼️ Запрос готовых открыток:',
          )
          console.log(
            `   ${title}`,
          )

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
          console.log(
            `\n📅 Запрос православного дня: ${date}`,
          )

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