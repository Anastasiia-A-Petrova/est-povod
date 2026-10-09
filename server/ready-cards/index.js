import {
  findLivecardTheme,
  fetchLivecardPage,
} from './livecard.js'

import {
  searchOtkritkiOnline,
} from './otkritkionline.js'

import {
  searchYandexImages,
} from './yandex.js'

const GENERIC_WORDS = new Set([
  'день',
  'праздник',
  'праздника',
  'икона',
  'иконы',
  'божией',
  'божья',
  'божьей',
  'божие',
  'матери',
  'пресвятой',
  'пресвятая',
  'богородицы',
  'приснодевы',
  'марии',
  'святой',
  'святая',
  'святого',
])

function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^а-яa-z0-9\s-]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getImportantWords(value) {
  return normalizeText(value)
    .split(' ')
    .filter(Boolean)
    .filter(
      (word) =>
        !GENERIC_WORDS.has(word),
    )
}

function wordMatches(
  targetWord,
  candidateWord,
) {
  if (
    targetWord === candidateWord
  ) {
    return true
  }

  if (
    targetWord.length >= 5 &&
    candidateWord.length >= 5
  ) {
    return (
      targetWord.startsWith(
        candidateWord.slice(0, 5),
      ) ||
      candidateWord.startsWith(
        targetWord.slice(0, 5),
      )
    )
  }

  return false
}

function titleMatchesQuery(
  query,
  candidateTitle,
) {
  const targetWords =
    getImportantWords(query)

  if (
    targetWords.length === 0
  ) {
    return true
  }

  const candidateWords =
    getImportantWords(candidateTitle)

  if (
    candidateWords.length === 0
  ) {
    return false
  }

  return targetWords.every(
    (targetWord) =>
      candidateWords.some(
        (candidateWord) =>
          wordMatches(
            targetWord,
            candidateWord,
          ),
      ),
  )
}

function buildSearchQueries(query) {
  const normalized =
    normalizeText(query)

  const queries = [
    query.trim(),
  ]

  if (
    normalized.startsWith('день ')
  ) {
    queries.push(
      query
        .trim()
        .replace(
          /^день\s+/i,
          '',
        ),
    )
  }

  if (
    normalized.startsWith(
      'всемирный день ',
    )
  ) {
    const rest = query
      .trim()
      .replace(
        /^всемирный день\s+/i,
        '',
      )

    queries.push(
      `День ${rest}`,
    )

    queries.push(rest)
  }

  if (
    normalized.startsWith(
      'международный день ',
    )
  ) {
    const rest = query
      .trim()
      .replace(
        /^международный день\s+/i,
        '',
      )

    queries.push(
      `День ${rest}`,
    )

    queries.push(rest)
  }

  return [
    ...new Set(
      queries.filter(Boolean),
    ),
  ]
}

function normalizeResult(
  result,
  fallbackTitle,
) {
  if (!result?.image) {
    return null
  }

  return {
    image: result.image,
    page:
      result.page || '',
    title:
      result.title ||
      fallbackTitle,
    source:
      result.source || '',
  }
}

function imageKey(image) {
  try {
    const url = new URL(image)

    /*
     * Для Pinterest разные размеры
     * одной картинки имеют разные URL:
     *
     * /236x/
     * /474x/
     * /736x/
     * /originals/
     *
     * Поэтому убираем размер из ключа.
     */
    if (
      url.hostname
        .toLowerCase()
        .includes('pinimg.com')
    ) {
      url.pathname =
        url.pathname.replace(
          /^\/(?:originals|\d+x)\//i,
          '/',
        )
    }

    /*
     * Query-параметры Yandex/Pinterest
     * часто не меняют саму картинку.
     */
    url.search = ''

    return url.toString()
      .toLowerCase()
  } catch {
    return String(image)
      .toLowerCase()
      .split('?')[0]
  }
}

function addUniqueResults(
  target,
  results,
  queryTitle,
) {
  const existing = new Set(
    target.map((item) =>
      imageKey(item.image),
    ),
  )

  for (const rawResult of results) {
    const result =
      normalizeResult(
        rawResult,
        queryTitle,
      )

    if (!result) {
      continue
    }

    const key =
      imageKey(result.image)

    if (existing.has(key)) {
      continue
    }

    existing.add(key)
    target.push(result)
  }
}

async function searchLivecard(
  query,
) {
  try {
    const theme =
      await findLivecardTheme(
        query,
      )

    if (!theme?.url) {
      return {
        status: 'empty',
        results: [],
      }
    }

    const page =
      await fetchLivecardPage(
        theme.url,
      )

    const results =
      Array.isArray(page)
        ? page
        : page?.results || []

    const filtered =
      results.filter((item) =>
        titleMatchesQuery(
          query,
          item.title ||
            theme.title ||
            query,
        ),
      )

    return {
      status:
        filtered.length > 0
          ? 'ok'
          : 'empty',
      results: filtered,
    }
  } catch (error) {
    console.error(
      '[ReadyCards] Livecard ошибка:',
      error?.message || error,
    )

    return {
      status: 'error',
      results: [],
      error:
        error?.message ||
        String(error),
    }
  }
}

async function searchOtkritki(
  query,
) {
  try {
    const response =
      await searchOtkritkiOnline(
        query,
      )

    const results =
      Array.isArray(response)
        ? response
        : response?.results || []

    const filtered =
      results.filter((item) =>
        titleMatchesQuery(
          query,
          item.title || query,
        ),
      )

    return {
      status:
        filtered.length > 0
          ? 'ok'
          : 'empty',
      results: filtered,
    }
  } catch (error) {
    console.error(
      '[ReadyCards] OtkritkiOnline ошибка:',
      error?.message || error,
    )

    return {
      status: 'error',
      results: [],
      error:
        error?.message ||
        String(error),
    }
  }
}

async function searchYandex(
  query,
) {
  try {
    const response =
      await searchYandexImages(
        query,
      )

    return {
      status:
        response?.status ||
        'empty',
      results:
        Array.isArray(
          response?.results,
        )
          ? response.results
          : [],
      error:
        response?.error || '',
    }
  } catch (error) {
    console.error(
      '[ReadyCards] Yandex ошибка:',
      error?.message || error,
    )

    return {
      status: 'error',
      results: [],
      error:
        error?.message ||
        String(error),
    }
  }
}

export async function searchReadyCards(
  occasionTitle,
) {
  const query = String(
    occasionTitle || '',
  ).trim()

  if (!query) {
    return {
      query: '',
      results: [],
      sources: {},
    }
  }

  const queries =
    buildSearchQueries(query)

  console.log('')
  console.log(
    '========================================',
  )
  console.log(
    '[ReadyCards] Поиск:',
    query,
  )
  console.log(
    '[ReadyCards] Запросы:',
    queries,
  )
  console.log(
    '========================================',
  )

  const allResults = []
  const sources = {}

  /*
   * Сначала наши специализированные
   * источники.
   */
  for (const searchQuery of queries) {
    const [
      livecard,
      otkritki,
    ] = await Promise.all([
      searchLivecard(
        searchQuery,
      ),
      searchOtkritki(
        searchQuery,
      ),
    ])

    if (!sources['livecard.xyz']) {
      sources['livecard.xyz'] = {
        status: 'empty',
        found: 0,
        queries: [],
      }
    }

    if (
      !sources[
        'otkritkionline.ru'
      ]
    ) {
      sources[
        'otkritkionline.ru'
      ] = {
        status: 'empty',
        found: 0,
        queries: [],
      }
    }

    sources[
      'livecard.xyz'
    ].queries.push({
      query: searchQuery,
      found:
        livecard.results.length,
      status: livecard.status,
    })

    sources[
      'otkritkionline.ru'
    ].queries.push({
      query: searchQuery,
      found:
        otkritki.results.length,
      status: otkritki.status,
    })

    sources[
      'livecard.xyz'
    ].found +=
      livecard.results.length

    sources[
      'otkritkionline.ru'
    ].found +=
      otkritki.results.length

    if (
      livecard.status === 'ok'
    ) {
      sources[
        'livecard.xyz'
      ].status = 'ok'
    }

    if (
      otkritki.status === 'ok'
    ) {
      sources[
        'otkritkionline.ru'
      ].status = 'ok'
    }

    addUniqueResults(
      allResults,
      livecard.results,
      query,
    )

    addUniqueResults(
      allResults,
      otkritki.results,
      query,
    )
  }

  /*
   * Yandex используем как fallback.
   *
   * То есть если специализированные
   * источники уже нашли много картинок,
   * мы всё равно можем добавить Yandex,
   * но не позволяем ему заменить
   * хорошие результаты.
   */
  const yandexQuery =
    queries[0] || query

  const yandex =
    await searchYandex(
      yandexQuery,
    )

  sources['yandex.ru'] = {
    status: yandex.status,
    found:
      yandex.results.length,
    queries: [
      {
        query: yandexQuery,
        found:
          yandex.results.length,
        status: yandex.status,
      },
    ],
  }

  addUniqueResults(
    allResults,
    yandex.results,
    query,
  )

  /*
   * Максимум 60 результатов на API.
   */
  const results =
    allResults.slice(0, 60)

  console.log(
    '[ReadyCards] Всего уникальных:',
    results.length,
  )

  console.log(
    '[ReadyCards] Источники:',
    JSON.stringify(
      sources,
      null,
      2,
    ),
  )

  return {
    query,
    results,
    sources,
  }
}