import https from 'node:https'

const SOURCE = 'yandex.ru'

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml',
          'Accept-Language':
            'ru-RU,ru;q=0.9,en;q=0.8',
        },
      },
      (response) => {
        let html = ''

        response.setEncoding('utf8')

        response.on('data', (chunk) => {
          html += chunk
        })

        response.on('end', () => {
          if (
            response.statusCode >= 200 &&
            response.statusCode < 400
          ) {
            resolve(html)
          } else {
            reject(
              new Error(
                `HTTP ${response.statusCode}`,
              ),
            )
          }
        })
      },
    )

    request.on('error', reject)

    request.setTimeout(15000, () => {
      request.destroy(
        new Error('Таймаут Яндекса'),
      )
    })
  })
}

function decodeValue(value) {
  return String(value || '')
    .replace(/\\u002F/gi, '/')
    .replace(/\\u003A/gi, ':')
    .replace(/\\u003D/gi, '=')
    .replace(/\\u0026/gi, '&')
    .replace(/\\\//g, '/')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

function cleanImageUrl(value) {
  let url = decodeValue(value)

  // Убираем мусор, который попал после URL
  url = url.split('","')[0]
  url = url.split('"}')[0]
  url = url.split('","snippet"')[0]
  url = url.split('","title"')[0]

  // Убираем случайные кавычки
  url = url
    .replace(/[\\"]+$/g, '')
    .trim()

  return url
}

function isValidImageUrl(url) {
  if (!url) {
    return false
  }

  const value = cleanImageUrl(url)

  if (!/^https?:\/\//i.test(value)) {
    return false
  }

  const lower = value.toLowerCase()

  // Сам Яндекс
  if (
    lower.includes('yandex.ru') ||
    lower.includes('yandex.net') ||
    lower.includes('yastatic.net')
  ) {
    return false
  }

  // Служебные / неподходящие форматы
  if (
    lower.includes('w3.org') ||
    lower.endsWith('.svg') ||
    lower.includes('youtube.com') ||
    lower.includes('ytimg.com')
  ) {
    return false
  }

  if (
    /\.(js|css|ico)(\?|$)/i.test(
      lower,
    )
  ) {
    return false
  }

  // Нормальные изображения
  if (
    /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(
      lower,
    )
  ) {
    return true
  }

  // Некоторые сайты отдают изображения
  // без расширения
  if (
    lower.includes('/media/') ||
    lower.includes('/upload/') ||
    lower.includes('/cards/')
  ) {
    return true
  }

  return false
}

function extractTitle(block) {
  const patterns = [
    /"snippet"\s*:\s*\{[^}]*"title"\s*:\s*"([^"]+)"/i,

    /"title"\s*:\s*"([^"]+)"/i,
  ]

  for (const pattern of patterns) {
    const match = block.match(pattern)

    if (match?.[1]) {
      return decodeValue(match[1])
    }
  }

  return ''
}

function extractSourcePage(block) {
  const patterns = [
    /"url"\s*:\s*"([^"]+)"/i,
    /"serp-item__link"\s*:\s*"([^"]+)"/i,
    /"href"\s*:\s*"([^"]+)"/i,
  ]

  for (const pattern of patterns) {
    const match = block.match(pattern)

    if (match?.[1]) {
      const url = decodeValue(match[1])

      if (
        /^https?:\/\//i.test(url) &&
        !url.includes('yandex.ru')
      ) {
        return url
      }
    }
  }

  return ''
}

function extractResults(html) {
  const results = []
  const seen = new Set()

  /*
   * Важный момент:
   * ищем URL до ближайшей кавычки/служебного
   * символа, поэтому больше не получаем:
   *
   * image.jpg","snippet":{"title"
   */

  const urlPattern =
    /https?:\\?\/\\?\/[^\s"'<>\\]+?\.(?:jpg|jpeg|png|gif|webp)(?:\?[^\s"'<>\\]*)?/gi

  let match

  while (
    (match = urlPattern.exec(html)) !== null
  ) {
    const rawUrl = match[0]

    const image = cleanImageUrl(rawUrl)

    if (!isValidImageUrl(image)) {
      continue
    }

    if (seen.has(image)) {
      continue
    }

    seen.add(image)

    const position = match.index

    const start = Math.max(
      0,
      position - 3000,
    )

    const end = Math.min(
      html.length,
      position + 5000,
    )

    const context = html.slice(
      start,
      end,
    )

    const title = extractTitle(context)

    const page = extractSourcePage(
      context,
    )

    results.push({
      image,
      page,
      title,
      source: SOURCE,
    })

    if (results.length >= 30) {
      break
    }
  }

  return results
}

export async function searchYandexImages(
  occasionTitle,
) {
  const cleanTitle = String(
    occasionTitle || '',
  ).trim()

  if (!cleanTitle) {
    return {
      source: SOURCE,
      status: 'empty',
      results: [],
    }
  }

  const query = `${cleanTitle} открытка`

  const url =
    `https://yandex.ru/images/search?text=${encodeURIComponent(query)}`

  console.log('')
  console.log(
    '[Yandex] Поиск:',
    query,
  )

  try {
    const html = await fetchHtml(url)

    console.log(
      '[Yandex] Получено HTML:',
      html.length,
      'символов',
    )

    const results =
      extractResults(html)

    console.log(
      '[Yandex] Найдено изображений:',
      results.length,
    )

    return {
      source: SOURCE,

      status:
        results.length > 0
          ? 'ok'
          : 'empty',

      results: results.map(
        (item) => ({
          ...item,

          page:
            item.page ||
            url,

          title:
            item.title ||
            cleanTitle,
        }),
      ),
    }
  } catch (error) {
    console.error(
      '[Yandex] Ошибка:',
      error?.message || error,
    )

    return {
      source: SOURCE,
      status: 'error',
      results: [],
      error:
        error?.message ||
        String(error),
    }
  }
}