const BASE_URL = 'https://otkritkionline.ru'
const SOURCE = 'otkritkionline.ru'

function normalizeText(text = '') {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/ё/gi, 'е')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function cleanText(text = '') {
  return text
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function getAttribute(attributes, name) {
  const regex = new RegExp(
    `${name}\\s*=\\s*["']([^"']+)["']`,
    'i'
  )

  const match = attributes.match(regex)

  return match ? match[1].trim() : ''
}

function removeDuplicates(items) {
  const seen = new Set()

  return items.filter((item) => {
    if (!item.image) {
      return false
    }

    const key = item.image.toLowerCase()

    if (seen.has(key)) {
      return false
    }

    seen.add(key)
    return true
  })
}

function makeAbsoluteUrl(url) {
  if (!url) {
    return ''
  }

  if (url.startsWith('//')) {
    return `https:${url}`
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  if (url.startsWith('/')) {
    return `${BASE_URL}${url}`
  }

  return `${BASE_URL}/${url}`
}

function getWords(text) {
  return normalizeText(text)
    .split(/[^a-zа-я0-9]+/i)
    .filter((word) => word.length >= 3)
}

function scoreTitle(target, candidate) {
  const targetNormalized = normalizeText(target)
  const candidateNormalized = normalizeText(candidate)

  if (!targetNormalized || !candidateNormalized) {
    return 0
  }

  if (targetNormalized === candidateNormalized) {
    return 10000
  }

  if (
    candidateNormalized.includes(targetNormalized) ||
    targetNormalized.includes(candidateNormalized)
  ) {
    return 5000
  }

  const targetWords = getWords(target)
  const candidateWords = new Set(getWords(candidate))

  /*
   * Для названий православных праздников особенно важно
   * не перепутать конкретный объект.
   *
   * Например:
   * "Смоленской иконы" и
   * "Казанской иконы"
   *
   * имеют много общих слов, но это разные праздники.
   */

  const importantWords = targetWords.filter(
    (word) =>
      ![
        'день',
        'праздник',
        'икона',
        'иконы',
        'божией',
        'божья',
        'божьей',
        'матери',
        'пресвятой',
        'пресвятая',
        'богородицы',
        'приснодевы',
        'марии',
      ].includes(word)
  )

  /*
   * Если в исходном названии есть конкретное значимое слово
   * (например "смоленской", "казанской", "иверская"),
   * оно обязательно должно присутствовать в найденном названии.
   */
  if (importantWords.length > 0) {
    const missingImportantWords = importantWords.filter(
      (word) => !candidateWords.has(word)
    )

    if (missingImportantWords.length > 0) {
      return 0
    }
  }

  let score = 0

  for (const word of targetWords) {
    if (candidateWords.has(word)) {
      score += 100
    }
  }

  return score
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml',
      'Accept-Language': 'ru-RU,ru;q=0.9,en;q=0.8',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  return response.text()
}

async function findHolidayPage(occasionTitle) {
  const url = `${BASE_URL}/prazdnik`

  const html = await fetchHtml(url)

  const links = [
    ...html.matchAll(
      /<a\b([^>]*)href=["']([^"']+)["']([^>]*)>([\s\S]*?)<\/a>/gi
    ),
  ]
    .map((match) => {
      const attributes = `${match[1]} ${match[3]}`

      return {
        href: match[2],
        text: cleanText(match[4]),
        attributes,
      }
    })
    .filter((item) => item.text && item.href)

  const exactTarget = normalizeText(occasionTitle)

  const exactMatches = links.filter(
    (item) => normalizeText(item.text) === exactTarget
  )

  if (exactMatches.length > 0) {
    const item = exactMatches[0]

    return {
      title: item.text,
      page: makeAbsoluteUrl(item.href),
      score: 10000,
    }
  }

  const scored = links
    .map((item) => ({
      ...item,
      score: scoreTitle(occasionTitle, item.text),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  if (scored.length === 0) {
    return null
  }

  return {
    title: scored[0].text,
    page: makeAbsoluteUrl(scored[0].href),
    score: scored[0].score,
  }
}

function extractImageUrls(html) {
  const urls = []

  // Обычные src / data-src / lazy-src
  const imgMatches = [
    ...html.matchAll(/<img\b([^>]*)>/gi),
  ]

  for (const match of imgMatches) {
    const attributes = match[1]

    const candidates = [
      getAttribute(attributes, 'src'),
      getAttribute(attributes, 'data-src'),
      getAttribute(attributes, 'data-lazy-src'),
      getAttribute(attributes, 'data-original'),
    ]

    for (const candidate of candidates) {
      if (candidate) {
        urls.push(candidate)
      }
    }

    // srcset
    const srcset = getAttribute(attributes, 'srcset')

    if (srcset) {
      const srcsetUrls = srcset
        .split(',')
        .map((part) => part.trim().split(/\s+/)[0])
        .filter(Boolean)

      urls.push(...srcsetUrls)
    }
  }

  // og:image
  const ogImages = [
    ...html.matchAll(
      /<meta\b[^>]*(?:property|name)=["']og:image["'][^>]*content=["']([^"']+)["'][^>]*>/gi
    ),
  ]

  for (const match of ogImages) {
    urls.push(match[1])
  }

  // Дополнительный поиск прямых URL CDN.
  const directUrls = [
    ...html.matchAll(
      /https?:\/\/cdn\.wishoonapp\.com\/[^"'\\\s<>]+/gi
    ),
  ]

  for (const match of directUrls) {
    urls.push(match[0])
  }

  return urls.map(makeAbsoluteUrl)
}

function isUsefulImage(url) {
  if (!url) {
    return false
  }

  const lower = url.toLowerCase()

  if (
    lower.includes('logo') ||
    lower.includes('favicon') ||
    lower.includes('avatar') ||
    lower.includes('icon-social') ||
    lower.includes('sprite')
  ) {
    return false
  }

  const extensions = [
    '.jpg',
    '.jpeg',
    '.png',
    '.gif',
    '.webp',
  ]

  return extensions.some((extension) => lower.includes(extension))
}

async function fetchHolidayImages(page, title) {
  const html = await fetchHtml(page)

  const rawUrls = extractImageUrls(html)

  const imageUrls = removeDuplicates(
    rawUrls
      .filter(isUsefulImage)
      .map((image) => ({
        image,
        page,
        title,
        source: SOURCE,
      }))
  )

  return imageUrls
}

export async function searchOtkritkiOnline(occasionTitle) {
  if (!occasionTitle) {
    return {
      source: SOURCE,
      status: 'empty',
      results: [],
    }
  }

  try {
    console.log(`\n[OtkritkiOnline] Ищем: ${occasionTitle}`)

    const holiday = await findHolidayPage(occasionTitle)

    if (!holiday) {
      console.log('[OtkritkiOnline] Страница праздника не найдена')

      return {
        source: SOURCE,
        status: 'empty',
        results: [],
      }
    }

    console.log(`[OtkritkiOnline] Найдена страница:`)
    console.log(`  ${holiday.title}`)
    console.log(`  ${holiday.page}`)
    console.log(`  score: ${holiday.score}`)

    const results = await fetchHolidayImages(
      holiday.page,
      holiday.title
    )

    console.log(
      `[OtkritkiOnline] Найдено изображений: ${results.length}`
    )

    return {
      source: SOURCE,
      status: results.length > 0 ? 'ok' : 'empty',
      results,
    }
  } catch (error) {
    console.error(
      `[OtkritkiOnline] Ошибка: ${error.message}`
    )

    return {
      source: SOURCE,
      status: 'error',
      results: [],
      error: error.message,
    }
  }
}
