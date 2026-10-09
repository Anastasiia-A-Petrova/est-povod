const LIVE_CARD_BASE = 'https://livecard.xyz'

/**
 * Нормализует текст для сравнения.
 */
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^а-яa-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Разбивает название повода на слова.
 */
function getWords(text) {
  return normalizeText(text)
    .split(' ')
    .filter((word) => word.length >= 3)
}

/**
 * Ищет тему Livecard по названию повода.
 *
 * Возвращает:
 * {
 *   theme: '68034',
 *   title: 'День Смоленской иконы Божией Матери',
 *   page: 'https://livecard.xyz/selectimage.php?...'
 * }
 */
export async function findLivecardTheme(occasionTitle) {
  if (!occasionTitle?.trim()) {
    return null
  }

  const response = await fetch(LIVE_CARD_BASE, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154 Safari/537.36',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.9',
    },
  })

  if (!response.ok) {
    throw new Error(
      `Livecard вернул ошибку ${response.status}: ${response.statusText}`,
    )
  }

  const html = await response.text()

  const links =
    html.match(/<a\b[^>]*data-image=["'][^"']+["'][^>]*>[\s\S]*?<\/a>/gi) ||
    []

  const query = normalizeText(occasionTitle)
  const queryWords = getWords(occasionTitle)

  const candidates = []

  for (const link of links) {
    const themeMatch = link.match(
      /data-image=["']([^"']+)["']/i,
    )

    const titleMatch = link.match(
      />([\s\S]*?)<\/a>/i,
    )

    if (!themeMatch || !titleMatch) {
      continue
    }

    const theme = themeMatch[1]

    const title = titleMatch[1]
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&quot;/gi, '"')
      .replace(/&amp;/gi, '&')
      .replace(/\s+/g, ' ')
      .trim()

    if (!title) {
      continue
    }

    const normalizedTitle = normalizeText(title)

    /*
     * Оцениваем совпадение.
     *
     * Полное совпадение — самый высокий приоритет.
     */
    let score = 0

    if (normalizedTitle === query) {
      score += 1000
    }

    if (
      normalizedTitle.includes(query) ||
      query.includes(normalizedTitle)
    ) {
      score += 500
    }

    /*
     * Считаем совпавшие слова.
     */
    let matchedWords = 0

    for (const word of queryWords) {
      if (normalizedTitle.includes(word)) {
        matchedWords += 1
      }
    }

    score += matchedWords * 20

    /*
     * Дополнительный бонус за совпадение длинных
     * содержательных слов.
     */
    for (const word of queryWords) {
      if (word.length >= 6 && normalizedTitle.includes(word)) {
        score += 10
      }
    }

    if (score === 0) {
      continue
    }

    candidates.push({
      theme,
      title,
      score,
    })
  }

  candidates.sort((a, b) => b.score - a.score)

  if (candidates.length === 0) {
    return null
  }

  const best = candidates[0]

  return {
    theme: best.theme,
    title: best.title,
    page:
      `${LIVE_CARD_BASE}/selectimage.php?lng=ru&theme=${encodeURIComponent(best.theme)}&p=0`,
    score: best.score,
  }
}

/**
 * Загружает страницу конкретной темы Livecard
 * и извлекает реальные изображения.
 */
export async function fetchLivecardPage(pageUrl) {
  const response = await fetch(pageUrl, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/154 Safari/537.36',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'ru-RU,ru;q=0.9',
    },
  })

  if (!response.ok) {
    throw new Error(
      `Livecard вернул ошибку ${response.status}: ${response.statusText}`,
    )
  }

  const html = await response.text()

  return parseLivecardImages(html, pageUrl)
}

/**
 * Извлекает изображения открыток.
 */
function parseLivecardImages(html, pageUrl) {
  const results = []

  const imageTags = html.match(/<img\b[^>]*>/gi) || []

  for (const tag of imageTags) {
    if (
      !/class=["'][^"']*card-img-top[^"']*["']/i.test(
        tag,
      )
    ) {
      continue
    }

    const imageUrl = getAttribute(tag, 'src')

    if (!imageUrl) {
      continue
    }

    const alt = getAttribute(tag, 'alt') || ''

    const absoluteImageUrl = new URL(
      imageUrl,
      pageUrl,
    ).href

    results.push({
      image: absoluteImageUrl,
      page: pageUrl,
      title: cleanText(alt),
      source: 'livecard.xyz',
    })
  }

  return removeDuplicates(results)
}

/**
 * Получает HTML-атрибут.
 */
function getAttribute(tag, attributeName) {
  const pattern = new RegExp(
    `${attributeName}\\s*=\\s*["']([^"']+)["']`,
    'i',
  )

  const match = tag.match(pattern)

  return match ? match[1].trim() : ''
}

/**
 * Чистит текст.
 */
function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Убирает дубликаты.
 */
function removeDuplicates(results) {
  const seen = new Set()

  return results.filter((item) => {
    if (seen.has(item.image)) {
      return false
    }

    seen.add(item.image)

    return true
  })
}

