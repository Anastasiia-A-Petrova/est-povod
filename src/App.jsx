import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import './App.css'
import customOccasions from './data/occasions'
import CardCreator from './components/CardCreator'
import { getOrthodoxDate } from './api/orthodox'

const NAGER_API =
  'https://date.nager.at/api/v3'

const RUSSIAN_CALENDAR_API =
  'https://calendar.kuzyak.in/api/calendar'

const WIKIPEDIA_API =
  'https://ru.wikipedia.org/w/api.php'

const WIKIPEDIA_IMAGE_CACHE_KEY =
  'greeting-wikipedia-holiday-images'

const calendarModes = [
  {
    id: 'all',
    label: 'Все',
    icon: '◎',
  },
  {
    id: 'secular',
    label: 'Светский',
    icon: '🌍',
  },
  {
    id: 'orthodox',
    label: 'Православный',
    icon: '✝️',
  },
  {
    id: 'personal',
    label: 'Мой',
    icon: '❤️',
  },
]

const personalDateTypes = [
  {
    id: 'birthday',
    label: 'День рождения',
    icon: '🎂',
  },
  {
    id: 'anniversary',
    label: 'Годовщина',
    icon: '💍',
  },
  {
    id: 'other',
    label: 'Другой повод',
    icon: '🎉',
  },
]

const monthNames = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
]

const weekdayNames = [
  'Пн',
  'Вт',
  'Ср',
  'Чт',
  'Пт',
  'Сб',
  'Вс',
]

function pad(value) {
  return String(value).padStart(2, '0')
}

function toDateString(
  year,
  monthIndex,
  day,
) {
  return `${year}-${pad(
    monthIndex + 1,
  )}-${pad(day)}`
}

function getTodayString() {
  const now = new Date()

  return toDateString(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  )
}

function getCalendarDays(
  year,
  monthIndex,
) {
  const firstDay = new Date(
    year,
    monthIndex,
    1,
  )

  const daysInMonth = new Date(
    year,
    monthIndex + 1,
    0,
  ).getDate()

  let weekday = firstDay.getDay()

  // JS: Sunday = 0, Monday = 1.
  // Для нашей сетки Monday = 0.
  weekday =
    weekday === 0
      ? 6
      : weekday - 1

  const days = []

  for (
    let index = 0;
    index < weekday;
    index += 1
  ) {
    days.push(null)
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day += 1
  ) {
    days.push(
      toDateString(
        year,
        monthIndex,
        day,
      ),
    )
  }

  return days
}

function getNagerIcon(holiday) {
  const title =
    `${holiday.localName || ''} ${
      holiday.name || ''
    }`.toLowerCase()

  if (
    title.includes('новый год') ||
    title.includes('new year')
  ) {
    return '🎄'
  }

  if (
    title.includes('рождество') ||
    title.includes('christmas')
  ) {
    return '🎄'
  }

  if (
    title.includes('женщин') ||
    title.includes('women')
  ) {
    return '🌷'
  }

  if (
    title.includes('труд') ||
    title.includes('labour') ||
    title.includes('labor')
  ) {
    return '🛠️'
  }

  if (
    title.includes('побед') ||
    title.includes('victory')
  ) {
    return '🎖️'
  }

  if (
    title.includes('единств') ||
    title.includes('unity')
  ) {
    return '🇷🇺'
  }

  return '🎉'
}

function getOccasionPriority(
  occasion,
) {
  return typeof occasion.priority ===
    'number'
    ? occasion.priority
    : 0
}

function sortOccasions(a, b) {
  const priorityDifference =
    getOccasionPriority(b) -
    getOccasionPriority(a)

  if (priorityDifference !== 0) {
    return priorityDifference
  }

  return String(
    a.title || '',
  ).localeCompare(
    String(b.title || ''),
    'ru',
  )
}

function normalizeOrthodoxTitle(
  value,
) {
  return String(value || '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[«»"„“]/g, '')
    .replace(/[()]/g, ' ')
    .replace(/[.,:;!?]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getAzbykaUrl(
  value,
) {
  if (!value) return null

  if (
    typeof value === 'string' &&
    value.startsWith('http')
  ) {
    return value.replace(
      /^http:\/\//i,
      'https://',
    )
  }

  return null
}

function getWikipediaSearchUrl(
  title,
) {
  if (!title) return null

  return `https://ru.wikipedia.org/w/index.php?search=${encodeURIComponent(
    title,
  )}`
}

function getWikipediaCacheKey(title) {
  return String(title || '')
    .trim()
    .toLowerCase()
}

function readWikipediaImageCache() {
  try {
    const saved = localStorage.getItem(
      WIKIPEDIA_IMAGE_CACHE_KEY,
    )

    if (!saved) return {}

    const parsed = JSON.parse(saved)

    return parsed &&
      typeof parsed === 'object'
      ? parsed
      : {}
  } catch {
    return {}
  }
}

function saveWikipediaImageCache(cache) {
  try {
    localStorage.setItem(
      WIKIPEDIA_IMAGE_CACHE_KEY,
      JSON.stringify(cache),
    )
  } catch {
    // Кеш необязателен.
  }
}

async function fetchWikipediaImageUrl(
  title,
) {
  if (!title) return null

  const url =
    `${WIKIPEDIA_API}` +
    `?action=query` +
    `&generator=search` +
    `&gsrsearch=${encodeURIComponent(title)}` +
    `&gsrnamespace=0` +
    `&gsrlimit=1` +
    `&prop=pageimages` +
    `&piprop=thumbnail` +
    `&pithumbsize=120` +
    `&format=json` +
    `&origin=*`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(
      `Wikipedia HTTP ${response.status}`,
    )
  }

  const data = await response.json()

  const pages = Object.values(
    data?.query?.pages || {},
  )

  const thumbnail =
    pages[0]?.thumbnail?.source

  return typeof thumbnail === 'string' &&
    thumbnail.trim()
    ? thumbnail
    : null
}

/*
 * =========================================================
 * AZBYKA
 * =========================================================
 *
 * Теперь православные данные приходят не напрямую
 * из браузера, а через наш локальный backend:
 *
 * App.jsx
 *   ↓
 * src/api/orthodox.js
 *   ↓
 * localhost:3001/api/orthodox
 *   ↓
 * server/azbyka.js
 *   ↓
 * Azbyka API
 *
 * Формат ответа backend:
 *
 * {
 *   date,
 *   holiday,
 *   holidays,
 *   icons,
 *   saints,
 *   priorities
 * }
 */

function getAzbykaHolidayLink(
  holiday,
) {
  if (!holiday) return null

  if (holiday.link) {
    return getAzbykaUrl(
      holiday.link,
    )
  }

  if (holiday.uri) {
    return `https://azbyka.ru/days/${holiday.uri}`
  }

  return null
}

function getAzbykaIconLink(
  icon,
) {
  if (!icon) return null

  if (icon.link) {
    return getAzbykaUrl(
      icon.link,
    )
  }

  if (icon.uri) {
    return `https://azbyka.ru/days/${icon.uri}`
  }

  return null
}

function getAzbykaSaintLink(
  saint,
) {
  if (!saint) return null

  if (saint.link) {
    return getAzbykaUrl(
      saint.link,
    )
  }

  if (saint.uri) {
    return `https://azbyka.ru/days/${saint.uri}`
  }

  return null
}

function getAzbykaPriority(
  priority,
) {
  if (!priority) return 0

  const paragraph =
    Number(priority.paragraph)

  /*
   * По фактическому ответу Azbyka:
   *
   * paragraph 1 — главный праздник
   * paragraph 2 — святые / группы
   * paragraph 3 — святые
   * paragraph 4 — икона
   *
   * Это используется только как дополнительный
   * ориентир. Основной праздник берём из holiday.
   */

  if (paragraph === 1) {
    return 100
  }

  if (paragraph === 4) {
    return 84
  }

  if (paragraph === 2) {
    return 75
  }

  if (paragraph === 3) {
    return 70
  }

  return 60
}

function getBestAzbykaIcon(
  icons,
) {
  if (!Array.isArray(icons)) {
    return null
  }

  const withImages = icons.filter(
    (icon) =>
      icon &&
      typeof icon.imageUrl ===
        'string' &&
      icon.imageUrl.trim(),
  )

  if (
    withImages.length === 0
  ) {
    return null
  }

  /*
   * В Azbyka priority=98/99 и т.п.
   * Меньшее число оказалось более
   * приоритетным изображением.
   */
  return [...withImages].sort(
    (a, b) =>
      Number(a.priority ?? 999) -
      Number(b.priority ?? 999),
  )[0]
}

function normalizeAzbykaDay(
  date,
  data,
) {
  const occasions = []

  if (!data) {
    return occasions
  }

  /*
   * -------------------------------------------------------
   * 1. Главный праздник
   * -------------------------------------------------------
   */

  const mainHoliday =
    data.holiday ||
    data.holidays?.[0] ||
    null

  if (mainHoliday?.title) {
    const holidayLink =
      getAzbykaHolidayLink(
        mainHoliday,
      )

    const bestIcon =
      getBestAzbykaIcon(
        data.icons,
      )

    occasions.push({
      id: `orthodox-holiday-${date}-${
        mainHoliday.id || 'main'
      }`,
      date,
      title: mainHoliday.title,
      description:
        'Православный праздник',
      category:
        'orthodox_feast',
      categoryLabel:
        'Православный праздник',
      icon: '✝️',
      calendar: 'orthodox',
      type: 'orthodox',
      source: 'azbyka',
      priority: 110,
      congratulatable: true,
      recipients: [
        'Родным',
        'Друзьям',
      ],
      imageUrl:
        bestIcon?.imageUrl ||
        null,
      infoUrl:
        holidayLink ||
        getAzbykaSearchFallbackUrl(
          mainHoliday.title,
        ),
      infoLabel:
        holidayLink
          ? 'Подробнее о празднике'
          : 'Подробнее',
    })
  }

  /*
   * -------------------------------------------------------
   * 2. Иконы Божией Матери
   * -------------------------------------------------------
   */

  if (Array.isArray(data.icons)) {
    const seenIcons = new Set()

    data.icons.forEach(
      (icon, index) => {
        if (!icon?.title) {
          return
        }

        const normalized =
          normalizeOrthodoxTitle(
            icon.title,
          )

        if (
          !normalized ||
          seenIcons.has(normalized)
        ) {
          return
        }

        seenIcons.add(normalized)

        const link =
          getAzbykaIconLink(icon)

        occasions.push({
          id: `orthodox-icon-${date}-${
            icon.id || index
          }`,
          date,
          title: icon.title,
          description:
            'Икона Божией Матери',
          category:
            'orthodox_icon',
          categoryLabel:
            'Икона Божией Матери',
          icon: '🕊️',
          calendar: 'orthodox',
          type: 'orthodox_icon',
          source: 'azbyka',
          priority: 84,
          congratulatable: true,
          recipients: [
            'Родным',
            'Друзьям',
          ],
          imageUrl:
            icon.imageUrl ||
            null,
          infoUrl:
            link ||
            getAzbykaSearchFallbackUrl(
              icon.title,
            ),
          infoLabel:
            link
              ? 'Подробнее об иконе'
              : 'Подробнее',
        })
      },
    )
  }

  /*
   * -------------------------------------------------------
   * 3. Группы святых
   * -------------------------------------------------------
   */

  if (Array.isArray(data.saints)) {
    const seenSaints = new Set()

    data.saints.forEach(
      (saint, index) => {
        if (!saint?.title) {
          return
        }

        const normalized =
          normalizeOrthodoxTitle(
            saint.title,
          )

        if (
          !normalized ||
          seenSaints.has(normalized)
        ) {
          return
        }

        seenSaints.add(normalized)

        const link =
          getAzbykaSaintLink(saint)

        occasions.push({
          id: `orthodox-saint-group-${date}-${
            saint.id || index
          }`,
          date,
          title: saint.title,
          description:
            'День памяти святых',
          category:
            'orthodox_saint',
          categoryLabel:
            'День памяти святых',
          icon: '🕯️',
          calendar: 'orthodox',
          type: 'orthodox',
          source: 'azbyka',
          priority: 75,
          congratulatable: true,
          recipients: [
            'Родным',
            'Друзьям',
          ],
          imageUrl:
            saint.imageUrl ||
            null,
          infoUrl:
            link ||
            getAzbykaSearchFallbackUrl(
              saint.title,
            ),
          infoLabel:
            link
              ? 'Подробнее'
              : 'Подробнее',
        })
      },
    )
  }

  /*
   * -------------------------------------------------------
   * 4. Если holiday отсутствует, но priorities
   *    содержат основной праздник — используем его.
   *
   * Это важно, например, для дат вроде Пасхи,
   * где cache_dates сам по себе может не содержать
   * holiday.
   * -------------------------------------------------------
   */

  if (
    !mainHoliday &&
    Array.isArray(data.priorities)
  ) {
    const holidayPriority =
      data.priorities.find(
        (item) =>
          Number(
            item?.paragraph,
          ) === 1 &&
          item?.title,
      )

    if (holidayPriority) {
      const priorityTitle =
        holidayPriority.title

      occasions.push({
        id: `orthodox-priority-${date}`,
        date,
        title: priorityTitle,
        description:
          'Православный праздник',
        category:
          'orthodox_feast',
        categoryLabel:
          'Православный праздник',
        icon: '✝️',
        calendar: 'orthodox',
        type: 'orthodox',
        source: 'azbyka',
        priority: 110,
        congratulatable: true,
        recipients: [
          'Родным',
          'Друзьям',
        ],
        imageUrl: null,
        infoUrl:
          getAzbykaSearchFallbackUrl(
            priorityTitle,
          ),
        infoLabel: 'Подробнее',
      })
    }
  }

  return occasions
}

function getAzbykaSearchFallbackUrl(
  title,
) {
  if (!title) return null

  /*
   * Это только fallback.
   *
   * Для реальных праздников, икон и групп,
   * которые backend уже получил из Azbyka,
   * используются прямые ссылки.
   */
  return `https://www.google.com/search?q=${encodeURIComponent(
    `site:azbyka.ru/days "${title}"`,
  )}`
}

/*
 * =========================================================
 * SECULAR
 * =========================================================
 */

function normalizeNagerHoliday(
  holiday,
) {
  const title =
    holiday.localName ||
    holiday.name ||
    'Праздничный день'

  return {
    id: `nager-${holiday.date}-${holiday.name}`,
    date: holiday.date,
    title,
    description:
      holiday.name ||
      'Официальный праздничный день',
    category: 'state',
    categoryLabel:
      'Государственные',
    icon: getNagerIcon(holiday),
    calendar: 'secular',
    type: 'official',
    source: 'nager',
    priority: holiday.global
      ? 95
      : 80,
    congratulatable: true,
    recipients: [
      'Родным',
      'Друзьям',
      'Коллегам',
    ],
    infoUrl:
      getWikipediaSearchUrl(title),
    infoLabel: 'Подробнее',
  }
}

function normalizeRussianCalendarDay(
  day,
  type = 'holiday',
) {
  if (!day?.date) {
    return null
  }

  // API возвращает ISO-дату в UTC:
  // 2026-01-01T00:00:00.000Z
  // Нам нужна только календарная дата.
  const date =
    String(day.date).slice(0, 10)

  let category = 'russian_calendar'
  let categoryLabel =
    'Официальный календарь РФ'
  let description =
    'Официальный праздничный день'
  let priority = 105
  let icon = '🇷🇺'

  if (type === 'transfer') {
    category = 'transfer'
    categoryLabel = 'Перенос'
    description =
      'Перенесённый выходной день'
    priority = 90
    icon = '🔄'
  }

  if (type === 'short') {
    category = 'short_day'
    categoryLabel =
      'Сокращённый рабочий день'
    description =
      'Рабочий день сокращён на один час'
    priority = 70
    icon = '⏰'
  }

  const title =
    day.name ||
    'Официальный календарь РФ'

  // Для основных государственных
  // праздников используем более привычные иконки.
  const lowerTitle =
    title.toLowerCase()

  if (
    lowerTitle.includes('новогод')
  ) {
    icon = '🎄'
  } else if (
    lowerTitle.includes('рождеств')
  ) {
    icon = '🎄'
  } else if (
    lowerTitle.includes('женщин')
  ) {
    icon = '🌷'
  } else if (
    lowerTitle.includes('побед')
  ) {
    icon = '🎖️'
  } else if (
    lowerTitle.includes('защитник')
  ) {
    icon = '🛡️'
  } else if (
    lowerTitle.includes('весны') ||
    lowerTitle.includes('труд')
  ) {
    icon = '🛠️'
  } else if (
    lowerTitle.includes('росси')
  ) {
    icon = '🇷🇺'
  } else if (
    lowerTitle.includes(
      'народного единства',
    )
  ) {
    icon = '🇷🇺'
  }

  return {
    id: `russian-calendar-${type}-${date}-${title}`,
    date,
    title,
    description,
    category,
    categoryLabel,
    icon,

    // Именно сюда:
    // эти даты должны появляться
    // в разделе "Мой".
    calendar: 'personal',

    type: 'russian_calendar',
    source: 'russian-calendar',

    priority,

    // Это календарная информация,
    // а не отдельный повод для поздравления.
    congratulatable: false,

    recipients: [],

    infoUrl: null,
    infoLabel: null,
  }
}

/*
 * =========================================================
 * CUSTOM OCCASIONS
 * =========================================================
 */

function getNthWeekdayOfMonth(
  year,
  monthIndex,
  weekday,
  occurrence,
) {
  const firstDay = new Date(
    year,
    monthIndex,
    1,
  )

  const firstWeekday =
    firstDay.getDay()

  const offset =
    (weekday -
      firstWeekday +
      7) %
    7

  const day =
    1 +
    offset +
    (occurrence - 1) * 7

  const result = new Date(
    year,
    monthIndex,
    day,
  )

  if (
    result.getMonth() !==
    monthIndex
  ) {
    return null
  }

  return toDateString(
    year,
    monthIndex,
    day,
  )
}

function getLastWeekdayOfMonth(
  year,
  monthIndex,
  weekday,
) {
  const lastDay = new Date(
    year,
    monthIndex + 1,
    0,
  )

  const lastWeekday =
    lastDay.getDay()

  const offset =
    (lastWeekday -
      weekday +
      7) %
    7

  const day =
    lastDay.getDate() - offset

  return toDateString(
    year,
    monthIndex,
    day,
  )
}

function getDayOfYearDate(
  year,
  dayOfYear,
) {
  const date = new Date(
    year,
    0,
    dayOfYear,
  )

  return toDateString(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  )
}

function resolveCustomOccasionDate(
  occasion,
  year,
) {
  if (occasion.dateRule) {
    if (
      occasion.dateRule.type ===
      'dayOfYear'
    ) {
      return getDayOfYearDate(
        year,
        occasion.dateRule.day,
      )
    }

    if (
      occasion.dateRule.type ===
      'nthWeekday'
    ) {
      return getNthWeekdayOfMonth(
        year,
        occasion.dateRule.month - 1,
        occasion.dateRule.weekday,
        occasion.dateRule.occurrence,
      )
    }

    if (
      occasion.dateRule.type ===
      'lastWeekday'
    ) {
      return getLastWeekdayOfMonth(
        year,
        occasion.dateRule.month - 1,
        occasion.dateRule.weekday,
      )
    }
  }

  if (
    typeof occasion.date ===
      'string' &&
    /^\d{2}-\d{2}$/.test(
      occasion.date,
    )
  ) {
    return `${year}-${occasion.date}`
  }

  return occasion.date
}

function normalizeCustomOccasion(
  occasion,
  year,
) {
  return {
    ...occasion,
    date: resolveCustomOccasionDate(
      occasion,
      year,
    ),
    calendar:
      occasion.calendar ||
      occasion.type ||
      'secular',
    type:
      occasion.type ||
      occasion.calendar ||
      'secular',
    source: 'custom',
    priority:
      typeof occasion.priority ===
      'number'
        ? occasion.priority
        : 70,
    congratulatable:
      occasion.congratulatable !==
      false,
    recipients:
      occasion.recipients || [
        'Родным',
        'Друзьям',
      ],
    infoUrl:
      occasion.infoUrl ||
      getWikipediaSearchUrl(
        occasion.title,
      ),
    infoLabel:
      occasion.infoLabel ||
      'Подробнее',
  }
}

function getRelativeDateLabel(
  dateString,
) {
  const today = new Date(
    `${getTodayString()}T12:00:00`,
  )

  const target = new Date(
    `${dateString}T12:00:00`,
  )

  const difference = Math.round(
    (target - today) /
      (1000 * 60 * 60 * 24),
  )

  if (difference === 0) {
    return 'Сегодня'
  }

  if (difference === 1) {
    return 'Завтра'
  }

  if (difference === 2) {
    return 'Послезавтра'
  }

  if (
    difference > 2 &&
    difference < 7
  ) {
    return `Через ${difference} дн.`
  }

  return target.toLocaleDateString(
    'ru-RU',
    {
      day: 'numeric',
      month: 'short',
    },
  )
}

/*
 * =========================================================
 * APP
 * =========================================================
 */

function App() {
  const todayString =
    getTodayString()

  const today = new Date()

  const [
    currentYear,
    setCurrentYear,
  ] = useState(
    today.getFullYear(),
  )

  const [
    currentMonth,
    setCurrentMonth,
  ] = useState(
    today.getMonth(),
  )

  const [
    activeCalendar,
    setActiveCalendar,
  ] = useState('all')

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(todayString)

  const [
    apiOccasions,
    setApiOccasions,
  ] = useState([])

  const [
    personalOccasions,
    setPersonalOccasions,
  ] = useState(() => {
    try {
      const saved =
        localStorage.getItem(
          'greeting-personal-dates',
        )

      return saved
        ? JSON.parse(saved)
        : []
    } catch {
      return []
    }
  })

  const [loading, setLoading] =
    useState(true)

  const [apiError, setApiError] =
    useState(false)

  const [
    wikipediaImages,
    setWikipediaImages,
  ] = useState(() =>
    readWikipediaImageCache(),
  )

  const [
    showPersonalModal,
    setShowPersonalModal,
  ] = useState(false)

  const [editingPersonalId, setEditingPersonalId] =
    useState(null)

  const [
    personalForm,
    setPersonalForm,
  ] = useState({
    date: todayString,
    title: '',
    type: 'birthday',
  })

  /*
   * =======================================================
   * LOAD CALENDARS
   * =======================================================
   */

  useEffect(() => {
    let cancelled = false

    async function loadCalendars() {
      setLoading(true)
      setApiError(false)

      const russianCalendarPromise =
        fetch(
          `${RUSSIAN_CALENDAR_API}/${currentYear}/holidays`,
        ).then((response) => {
          if (!response.ok) {
            throw new Error(
              `Russian calendar HTTP ${response.status}`,
            )
          }

          return response.json()
        })

      /*
       * Светские праздники по-прежнему
       * загружаются как раньше.
       */
      const nagerPromise = fetch(
        `${NAGER_API}/PublicHolidays/${currentYear}/RU`,
      ).then((response) => {
        if (!response.ok) {
          throw new Error(
            `Nager HTTP ${response.status}`,
          )
        }

        return response.json()
      })

      /*
       * Azbyka работает по конкретной дате.
       *
       * Поэтому вместо старого:
       *
       * /calendar/month/2026/10
       *
       * мы запрашиваем даты текущего месяца.
       *
       * Backend уже кэширует токен Azbyka,
       * поэтому логин не происходит для
       * каждого запроса.
       */
      const daysInMonth =
        new Date(
          currentYear,
          currentMonth + 1,
          0,
        ).getDate()

      const orthodoxDates = []

      for (
        let day = 1;
        day <= daysInMonth;
        day += 1
      ) {
        orthodoxDates.push(
          toDateString(
            currentYear,
            currentMonth,
            day,
          ),
        )
      }

      /*
       * Добавляем первые дни следующего месяца.
       *
       * Это нужно для блока
       * «Ближайшие поводы», когда пользователь
       * находится в конце месяца.
       */
      const nextMonth =
        currentMonth === 11
          ? {
              year:
                currentYear + 1,
              month: 0,
            }
          : {
              year: currentYear,
              month:
                currentMonth + 1,
            }

      for (
        let day = 1;
        day <= 7;
        day += 1
      ) {
        orthodoxDates.push(
          toDateString(
            nextMonth.year,
            nextMonth.month,
            day,
          ),
        )
      }

      const orthodoxPromises =
        orthodoxDates.map(
          async (date) => {
            try {
              return await getOrthodoxDate(
                date,
              )
            } catch (error) {
              console.warn(
                `Azbyka: не удалось загрузить ${date}`,
                error,
              )

              return null
            }
          },
        )

      const [
        nagerResult,
        russianCalendarResult,
        orthodoxResults,
      ] = await Promise.all([
        Promise.allSettled([
          nagerPromise,
        ]),
        Promise.allSettled([
          russianCalendarPromise,
        ]),
        Promise.all(
          orthodoxPromises,
        ),
      ])

      if (cancelled) return

      const loaded = []

      /*
       * Nager
       */

      const nagerItem =
        nagerResult[0]

      if (
        nagerItem?.status ===
          'fulfilled' &&
        Array.isArray(
          nagerItem.value,
        )
      ) {
        nagerItem.value.forEach(
          (holiday) => {
            loaded.push(
              normalizeNagerHoliday(
                holiday,
              ),
            )
          },
        )
      } else {
        console.warn(
          'Nager API недоступен:',
          nagerItem?.reason,
        )

        setApiError(true)
      }

      const russianResult =
        russianCalendarResult[0]

      if (
        russianResult?.status ===
        'fulfilled'
      ) {
        const russianData =
          russianResult.value

        ;(
          russianData.holidays || []
        ).forEach((day) => {
          const occasion =
            normalizeRussianCalendarDay(
              day,
              'holiday',
            )

          if (occasion) {
            loaded.push(occasion)
          }
        })

        ;(
          russianData.transferredHolidays ||
          []
        ).forEach((day) => {
          const occasion =
            normalizeRussianCalendarDay(
              day,
              'transfer',
            )

          if (occasion) {
            loaded.push(occasion)
          }
        })

        ;(
          russianData.shortDays || []
        ).forEach((day) => {
          const occasion =
            normalizeRussianCalendarDay(
              day,
              'short',
            )

          if (occasion) {
            loaded.push(occasion)
          }
        })
      } else {
        setApiError(true)
      }

      /*
       * Azbyka
       */

      let orthodoxLoaded = false

      orthodoxResults.forEach(
        (result) => {
          if (!result) {
            return
          }

          orthodoxLoaded = true

          const date =
            result.date

          loaded.push(
            ...normalizeAzbykaDay(
              date,
              result,
            ),
          )
        },
      )

      /*
       * Если вообще ни один день
       * не загрузился — показываем
       * предупреждение.
       */
      if (!orthodoxLoaded) {
        setApiError(true)
      }

      if (!cancelled) {
        setApiOccasions(loaded)
        setLoading(false)
      }
    }

    loadCalendars()

    return () => {
      cancelled = true
    }
  }, [
    currentYear,
    currentMonth,
  ])

  /*
   * =======================================================
   * CUSTOM OCCASIONS
   * =======================================================
   */

  const normalizedCustomOccasions =
    useMemo(
      () =>
        customOccasions
          .map((occasion) =>
            normalizeCustomOccasion(
              occasion,
              currentYear,
            ),
          )
          .filter(
            (occasion) =>
              Boolean(
                occasion.date,
              ),
          ),
      [currentYear],
    )

  /*
   * =======================================================
   * WIKIPEDIA IMAGES
   * =======================================================
   *
   * Эта часть остаётся прежней:
   * Wikipedia используется для светских
   * праздников.
   *
   * Православные картинки сюда больше
   * не попадают — их отдаёт Azbyka.
   */

  useEffect(() => {
    let cancelled = false

    async function loadWikipediaImages() {
      const cache =
        readWikipediaImageCache()

      const secularOccasions = [
        ...apiOccasions,
        ...normalizedCustomOccasions,
      ].filter(
        (occasion) =>
          occasion.calendar ===
            'secular' &&
          !occasion.imageUrl &&
          occasion.title,
      )

      const titles = [
        ...new Set(
          secularOccasions.map(
            (occasion) =>
              occasion.title,
          ),
        ),
      ]

      const missingTitles =
        titles.filter((title) => {
          const key =
            getWikipediaCacheKey(
              title,
            )

          return !Object.prototype.hasOwnProperty.call(
            cache,
            key,
          )
        })

      if (
        missingTitles.length ===
        0
      ) {
        if (!cancelled) {
          setWikipediaImages(cache)
        }

        return
      }

      const results =
        await Promise.all(
          missingTitles.map(
            async (title) => {
              try {
                const imageUrl =
                  await fetchWikipediaImageUrl(
                    title,
                  )

                return {
                  key:
                    getWikipediaCacheKey(
                      title,
                    ),
                  imageUrl,
                }
              } catch (error) {
                console.warn(
                  'Wikipedia image недоступна:',
                  title,
                  error,
                )

                return {
                  key:
                    getWikipediaCacheKey(
                      title,
                    ),
                  imageUrl: null,
                }
              }
            },
          ),
        )

      if (cancelled) return

      results.forEach(
        ({ key, imageUrl }) => {
          cache[key] = imageUrl
        },
      )

      saveWikipediaImageCache(cache)
      setWikipediaImages(cache)
    }

    loadWikipediaImages()

    return () => {
      cancelled = true
    }
  }, [
    apiOccasions,
    normalizedCustomOccasions,
  ])

  /*
   * =======================================================
   * PERSONAL OCCASIONS
   * =======================================================
   */

  const normalizedPersonalOccasions =
    useMemo(() => {
      // Личные даты повторяются ежегодно.
      // Храним исходную дату один раз, а для календаря
      // создаём отображаемые экземпляры нужных лет.
      const currentCalendarYear = currentYear
      const todayYear = Number(todayString.slice(0, 4))
      const years = new Set([
        currentCalendarYear - 1,
        currentCalendarYear,
        currentCalendarYear + 1,
        todayYear,
        todayYear + 1,
      ])

      return personalOccasions.flatMap((occasion) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(occasion.date || '')) {
          return [{
            ...occasion,
            calendar: 'personal',
            type: 'personal',
            priority: typeof occasion.priority === 'number' ? occasion.priority : 100,
          }]
        }

        const monthDay = occasion.date.slice(5)

        return [...years].flatMap((year) => {
          const recurringDate = `${year}-${monthDay}`
          const [dateYear, month, day] = recurringDate.split('-').map(Number)
          const checkDate = new Date(dateYear, month - 1, day)

          // Например, 29 февраля показываем только в високосные годы.
          if (
            checkDate.getFullYear() !== dateYear ||
            checkDate.getMonth() !== month - 1 ||
            checkDate.getDate() !== day
          ) {
            return []
          }

          return [{
            ...occasion,
            date: recurringDate,
            calendar: 'personal',
            type: 'personal',
            priority: typeof occasion.priority === 'number' ? occasion.priority : 100,
          }]
        })
      })
    }, [personalOccasions, currentYear, todayString])

  /*
   * =======================================================
   * ALL OCCASIONS
   * =======================================================
   */

  const allOccasions = useMemo(
    () =>
      [
        ...apiOccasions,
        ...normalizedCustomOccasions,
        ...normalizedPersonalOccasions,
      ].map((occasion) => {
        if (
          occasion.imageUrl ||
          occasion.calendar !==
            'secular'
        ) {
          return occasion
        }

        const imageUrl =
          wikipediaImages[
            getWikipediaCacheKey(
              occasion.title,
            )
          ]

        return imageUrl
          ? {
              ...occasion,
              imageUrl,
            }
          : occasion
      }),
    [
      apiOccasions,
      normalizedCustomOccasions,
      normalizedPersonalOccasions,
      wikipediaImages,
    ],
  )

  const visibleOccasions =
    useMemo(() => {
      if (
        activeCalendar ===
        'all'
      ) {
        return allOccasions
      }

      return allOccasions.filter(
        (occasion) =>
          occasion.calendar ===
          activeCalendar,
      )
    }, [
      allOccasions,
      activeCalendar,
    ])

  function getDayOccasions(
    dateString,
  ) {
    return visibleOccasions
      .filter(
        (occasion) =>
          occasion.date ===
          dateString,
      )
      .sort(sortOccasions)
  }

  const calendarDays = useMemo(
    () =>
      getCalendarDays(
        currentYear,
        currentMonth,
      ),
    [currentYear, currentMonth],
  )

  const selectedDayOccasions =
    getDayOccasions(
      selectedDate,
    )

  const selectedDateObject =
    new Date(
      `${selectedDate}T12:00:00`,
    )

  const selectedDateLabel =
    selectedDateObject.toLocaleDateString(
      'ru-RU',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      },
    )

  const [
    cardCreatorOccasion,
    setCardCreatorOccasion,
  ] = useState(null)

  const [congratulateOccasions, setCongratulateOccasions] = useState([])

  /*
   * =======================================================
   * TODAY
   * =======================================================
   */

  const todayOccasions =
    useMemo(
      () =>
        allOccasions
          .filter(
            (occasion) =>
              occasion.date ===
              todayString,
          )
          .sort(sortOccasions),
      [
        allOccasions,
        todayString,
      ],
    )

  /*
   * =======================================================
   * UPCOMING
   * =======================================================
   */

  const upcomingOccasions =
    useMemo(() => {
      return allOccasions
        .filter(
          (occasion) =>
            occasion.date >
              todayString &&
            occasion.congratulatable !==
              false,
        )
        .sort((a, b) => {
          const dateDifference =
            a.date.localeCompare(
              b.date,
            )

          if (
            dateDifference !== 0
          ) {
            return dateDifference
          }

          return sortOccasions(
            a,
            b,
          )
        })
        .filter(
          (
            occasion,
            index,
            array,
          ) =>
            array.findIndex(
              (item) =>
                item.date ===
                  occasion.date &&
                item.title ===
                  occasion.title &&
                item.calendar ===
                  occasion.calendar,
            ) === index,
        )
        .slice(0, 6)
    }, [
      allOccasions,
      todayString,
    ])

  /*
   * =======================================================
   * NAVIGATION
   * =======================================================
   */

  function openDate(dateString) {
    const date = new Date(
      `${dateString}T12:00:00`,
    )

    setCurrentYear(
      date.getFullYear(),
    )

    setCurrentMonth(
      date.getMonth(),
    )

    setSelectedDate(dateString)

    requestAnimationFrame(() => {
      window.setTimeout(() => {
        const section =
          document.getElementById(
            'selected-day-section',
          )

        if (section) {
          section.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      }, 50)
    })
  }

  function openOccasion(
    occasion,
  ) {
    if (!occasion?.date) return

    openDate(occasion.date)
  }

  function openCongratulate(occasion) {
    if (!occasion?.date) return

    const dayOccasions =
      allOccasions
        .filter(
          (item) =>
            item.date === occasion.date &&
            item.congratulatable,
        )
        .sort(sortOccasions)

    setSelectedDate(occasion.date)
    setCongratulateOccasions(
      dayOccasions,
    )
  }

  function goToPreviousMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)

      setCurrentYear(
        (year) => year - 1,
      )
    } else {
      setCurrentMonth(
        (month) => month - 1,
      )
    }
  }

  function goToNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)

      setCurrentYear(
        (year) => year + 1,
      )
    } else {
      setCurrentMonth(
        (month) => month + 1,
      )
    }
  }

  function goToToday() {
    const now = new Date()

    const dateString =
      toDateString(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      )

    setCurrentYear(
      now.getFullYear(),
    )

    setCurrentMonth(
      now.getMonth(),
    )

    setSelectedDate(dateString)
  }

  function goToDate(dateString) {
    if (!dateString) {
      return
    }

    setSelectedDate(dateString)

    setCurrentYear(
      Number(dateString.slice(0, 4)),
    )

    setCurrentMonth(
      Number(dateString.slice(5, 7)) - 1,
    )
  }

  /*
   * =======================================================
   * PERSONAL DATE
   * =======================================================
   */

  function persistPersonalOccasions(updated) {
    setPersonalOccasions(updated)

    try {
      localStorage.setItem(
        'greeting-personal-dates',
        JSON.stringify(updated),
      )
    } catch (error) {
      console.error('Не удалось сохранить личные поводы:', error)
    }
  }

  function savePersonalDate(event) {
    event.preventDefault()

    const title = personalForm.title.trim()
    if (!title || !personalForm.date) return

    const type = personalDateTypes.find(
      (item) => item.id === personalForm.type,
    )

    const occasionData = {
      date: personalForm.date,
      title,
      description: type?.label || 'Личная дата',
      category: personalForm.type,
      categoryLabel: type?.label || 'Личная дата',
      icon: type?.icon || '❤️',
      calendar: 'personal',
      type: 'personal',
      source: 'personal',
      priority: 100,
      congratulatable: true,
      recipients: ['Родным', 'Друзьям'],
    }

    let updated

    if (editingPersonalId) {
      updated = personalOccasions.map((occasion) =>
        occasion.id === editingPersonalId
          ? { ...occasion, ...occasionData, id: occasion.id }
          : occasion,
      )
    } else {
      updated = [
        ...personalOccasions,
        {
          ...occasionData,
          id: `personal-${Date.now()}`,
        },
      ]
    }

    persistPersonalOccasions(updated)

    setSelectedDate(personalForm.date)
    setCurrentYear(Number(personalForm.date.slice(0, 4)))
    setCurrentMonth(Number(personalForm.date.slice(5, 7)) - 1)
    setShowPersonalModal(false)
    setEditingPersonalId(null)
    setPersonalForm({
      date: personalForm.date,
      title: '',
      type: 'birthday',
    })
  }

  function editPersonalDate(occasion) {
    setEditingPersonalId(occasion.id)
    setPersonalForm({
      date: occasion.date,
      title: occasion.title || '',
      type: personalDateTypes.some((item) => item.id === occasion.category)
        ? occasion.category
        : 'other',
    })
    setShowPersonalModal(true)
  }

  function deletePersonalDate(occasion) {
    const confirmed = window.confirm(
      `Удалить повод «${occasion.title}»? Он исчезнет из личного календаря во всех годах.`,
    )

    if (!confirmed) return

    const updated = personalOccasions.filter(
      (item) => item.id !== occasion.id,
    )
    persistPersonalOccasions(updated)

    if (editingPersonalId === occasion.id) {
      setEditingPersonalId(null)
      setShowPersonalModal(false)
    }
  }

  function closePersonalModal() {
    setShowPersonalModal(false)
    setEditingPersonalId(null)
  }

  /*
   * =======================================================
   * CARD CREATOR
   * =======================================================
   */

  if (cardCreatorOccasion) {
    return (
      <CardCreator
        occasion={
          cardCreatorOccasion
        }
        onBack={() => {
          setCardCreatorOccasion(
            null,
          )
        }}
      />
    )
  }

  /*
   * =======================================================
   * UI
   * =======================================================
   */

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">
            ★ ЕСТЬ ПОВОД!
          </div>

          <h1>
            Для тёплых слов всегда
            найдётся повод.
          </h1>

          <p className="intro">
            Календарь праздников и памятных
            дат, идеи поздравлений и открытки
            для тех, кто дорог.
          </p>
        </div>
      </header>

      <main className="workspace">
        <section className="calendar-section">
          <div className="calendar-switcher">
            {calendarModes.map(
              (mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={`calendar-mode ${
                    activeCalendar ===
                    mode.id
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setActiveCalendar(
                      mode.id,
                    )
                  }
                >
                  <span>
                    {mode.icon}
                  </span>

                  {mode.label}
                </button>
              ),
            )}
          </div>

          {/* =========================
              TODAY
             ========================= */}

          <section className="today-panel">
            <div className="today-panel-main">
              <div className="section-label">
                Сегодня
              </div>

              <div className="today-panel-date">
                {new Date(
                  `${todayString}T12:00:00`,
                ).toLocaleDateString(
                  'ru-RU',
                  {
                    weekday:
                      'long',
                    day: 'numeric',
                    month: 'long',
                  },
                )}
              </div>
            </div>

            {todayOccasions.length >
            0 ? (
              <div className="today-occasion-list">
                {todayOccasions
                  .slice(0, 3)
                  .map(
                    (occasion) => (
                      <button
                        type="button"
                        className={`today-occasion ${occasion.calendar}`}
                        key={
                          occasion.id
                        }
                        onClick={() =>
                          openOccasion(
                            occasion,
                          )
                        }
                      >
                        <span className="today-occasion-icon">
                          {occasion.imageUrl ? (
                            <img
                              src={
                                occasion.imageUrl
                              }
                              alt=""
                              onError={(
                                event,
                              ) => {
                                event.currentTarget.style.display =
                                  'none'
                              }}
                            />
                          ) : (
                            occasion.icon
                          )}
                        </span>

                        <span className="today-occasion-content">
                          <strong>
                            {
                              occasion.title
                            }
                          </strong>

                          <small>
                            {
                              occasion.categoryLabel
                            }
                          </small>
                        </span>

                        <span className="occasion-card-arrow">
                          →
                        </span>
                      </button>
                    ),
                  )}
              </div>
            ) : (
              <button
                type="button"
                className="today-empty"
                onClick={() =>
                  openDate(
                    todayString,
                  )
                }
              >
                <span>☁️</span>

                <span>
                  Сегодня пока нет
                  отмеченных поводов
                </span>

                <span className="occasion-card-arrow">
                  →
                </span>
              </button>
            )}
          </section>

          {/* =========================
              CALENDAR HEADER
             ========================= */}

          <div className="calendar-header">
            <button
              type="button"
              className="month-arrow"
              onClick={
                goToPreviousMonth
              }
              aria-label="Предыдущий месяц"
            >
              ‹
            </button>

            <div className="calendar-month">
              <strong>
                {
                  monthNames[
                    currentMonth
                  ]
                }
              </strong>

              <span className="calendar-year">
                {currentYear}
              </span>
            </div>

            <button
              type="button"
              className="month-arrow"
              onClick={
                goToNextMonth
              }
              aria-label="Следующий месяц"
            >
              ›
            </button>

            <button
              type="button"
              className="today-button"
              onClick={
                goToToday
              }
            >
              Сегодня
            </button>

            <label className="date-picker-button">
              <span>Выбрать дату</span>

              <input
                type="date"
                value={selectedDate}
                onChange={(event) =>
                  goToDate(
                    event.target.value,
                  )
                }
                aria-label="Выбрать дату"
              />
            </label>

          </div>

          {loading && (
            <div className="calendar-status">
              Загружаем календарь…
            </div>
          )}

          {!loading &&
            apiError && (
              <div className="calendar-status">
                Некоторые данные
                временно
                недоступны. Локальные
                поводы продолжают
                работать.
              </div>
            )}

          <div className="calendar-grid weekday-row">
            {weekdayNames.map(
              (weekday) => (
                <div
                  className="weekday"
                  key={weekday}
                >
                  {weekday}
                </div>
              ),
            )}
          </div>

          <div className="calendar-grid">
            {calendarDays.map(
              (dateString, index) => {
                if (!dateString) {
                  return (
                    <div
                      className="calendar-day empty"
                      key={`empty-${index}`}
                    />
                  )
                }

                const day = Number(
                  dateString.slice(-2),
                )

                const dayOccasions =
                  getDayOccasions(
                    dateString,
                  )

                const isToday =
                  dateString ===
                  todayString

                const isSelected =
                  dateString ===
                  selectedDate

                const mainOccasion =
                  dayOccasions[0]

                return (
                  <button
                    className={`calendar-day ${
                      isToday
                        ? 'today'
                        : ''
                    } ${
                      isSelected
                        ? 'selected'
                        : ''
                    } ${
                      mainOccasion
                        ? `has-${mainOccasion.calendar}`
                        : ''
                    }`}
                    type="button"
                    key={dateString}
                    onClick={() => {
                      setSelectedDate(dateString)

                      if (dayOccasions.some(
                        (occasion) => occasion.congratulatable,
                      )) {
                        setCongratulateOccasions(
                          dayOccasions.filter(
                            (occasion) =>
                              occasion.congratulatable,
                          ),
                        )
                      }
                    }}
                  >
                    <span className="day-number">
                      {day}
                    </span>

                    {mainOccasion && (
                      <div className="day-main-occasion">
                        <span className="day-main-icon">
                          {mainOccasion.imageUrl ? (
                            <img
                              src={
                                mainOccasion.imageUrl
                              }
                              alt=""
                              onError={(
                                event,
                              ) => {
                                event.currentTarget.style.display =
                                  'none'
                              }}
                            />
                          ) : (
                            mainOccasion.icon
                          )}
                        </span>

                        <span className="day-main-title">
                          {
                            mainOccasion.title
                          }
                        </span>
                      </div>
                    )}

                    {dayOccasions.length >
                      1 && (
                      <div className="day-markers">
                        {dayOccasions
                          .slice(
                            1,
                            5,
                          )
                          .map(
                            (
                              occasion,
                            ) => (
                              <span
                                className={`day-marker ${occasion.calendar}`}
                                key={
                                  occasion.id
                                }
                              />
                            ),
                          )}
                      </div>
                    )}

                    {dayOccasions.length >
                      1 && (
                      <span className="day-count">
                        +
                        {dayOccasions.length -
                          1}
                      </span>
                    )}
                  </button>
                )
              },
            )}
          </div>

          {/* =========================
              UPCOMING
             ========================= */}

          <section className="upcoming-section">
            <div className="upcoming-header">
              <div>
                <div className="section-label">
                  Скоро поздравлять
                </div>

                <h2>
                  Ближайшие события
                </h2>
              </div>

              <span className="upcoming-hint">
                Не пропусти хороший
                повод
              </span>
            </div>

            {upcomingOccasions.length >
            0 ? (
              <div className="upcoming-grid">
                {upcomingOccasions.map(
                  (occasion) => (
                    <button
                      type="button"
                      className={`upcoming-card ${occasion.calendar}`}
                      key={`${occasion.id}-${occasion.date}`}
                      onClick={() =>
                        openOccasion(
                          occasion,
                        )
                      }
                    >
                      <div className="upcoming-card-top">
                        <span className="upcoming-icon">
                          {occasion.imageUrl ? (
                            <img
                              src={
                                occasion.imageUrl
                              }
                              alt=""
                              onError={(
                                event,
                              ) => {
                                event.currentTarget.style.display =
                                  'none'
                              }}
                            />
                          ) : (
                            occasion.icon
                          )}
                        </span>

                        <span className="upcoming-date">
                          {getRelativeDateLabel(
                            occasion.date,
                          )}
                        </span>
                      </div>

                      <strong>
                        {
                          occasion.title
                        }
                      </strong>

                      <small>
                        {
                          occasion.categoryLabel
                        }
                      </small>

                      <span className="occasion-card-arrow">
                        →
                      </span>
                    </button>
                  ),
                )}
              </div>
            ) : (
              <div className="upcoming-empty">
                <span>🌙</span>

                <p>
                  Ближайших поводов пока
                  нет.
                </p>
              </div>
            )}
          </section>
        </section>

        {/* =========================
            SELECTED DAY
           ========================= */}

        <section
          className="selected-day-section"
          id="selected-day-section"
        >
          <div className="selected-day-heading">
            <div>
              <div className="section-label">
                Выбранная дата
              </div>

              <h2>
                {selectedDateLabel}
              </h2>
            </div>

            <button
              type="button"
              className="add-personal-button"
              onClick={() => {
                setEditingPersonalId(null)
                setPersonalForm({
                  date: selectedDate,
                  title: '',
                  type: 'birthday',
                })
                setShowPersonalModal(true)
              }}
            >
              + Добавить свой повод
            </button>
          </div>

          {selectedDayOccasions.length ===
            0 && (
            <div className="empty-day">
              <span>☁️</span>

              <p>
                На эту дату пока нет
                событий.
              </p>

              <small>
                Можно добавить сюда
                собственный повод.
              </small>
            </div>
          )}

          <div className="day-occasion-list">
            {selectedDayOccasions.map(
              (occasion) => (
                <article
                  className={`day-occasion-card ${occasion.calendar}`}
                  key={occasion.id}
                >
                  <div className="occasion-icon">
                    {occasion.imageUrl ? (
                      <img
                        src={
                          occasion.imageUrl
                        }
                        alt=""
                        onError={(
                          event,
                        ) => {
                          event.currentTarget.style.display =
                            'none'
                        }}
                      />
                    ) : (
                      occasion.icon
                    )}
                  </div>

                  <div className="occasion-info">
                    <div className="occasion-meta">
                      {occasion.categoryLabel ||
                        occasion.category ||
                        'Повод'}
                    </div>

                    <h3>
                      {
                        occasion.title
                      }
                    </h3>

                    {occasion.description && (
                      <p>
                        {
                          occasion.description
                        }
                      </p>
                    )}

                    {occasion.infoUrl && (
                      <a
                        className="occasion-info-link"
                        href={
                          occasion.infoUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        {occasion.infoLabel ||
                          'Подробнее'}{' '}
                        ↗
                      </a>
                    )}
                  </div>

                  <div className="day-occasion-actions">
                    {occasion.congratulatable && (
                      <button
                        type="button"
                        className="congratulate-button"
                        onClick={() => {
                          setCardCreatorOccasion(occasion)
                        }}
                      >
                        ✨ Поздравить
                      </button>
                    )}

                    {occasion.source === 'personal' && (
                      <>
                        <button
                          type="button"
                          className="personal-edit-button"
                          onClick={() => editPersonalDate(occasion)}
                        >
                          ✎ Изменить
                        </button>
                        <button
                          type="button"
                          className="personal-delete-button"
                          onClick={() => deletePersonalDate(occasion)}
                          aria-label={`Удалить повод ${occasion.title}`}
                        >
                          Удалить
                        </button>
                      </>
                    )}
                  </div>
                </article>
              ),
            )}
          </div>
        </section>
      </main>

      {/* =========================
          PERSONAL MODAL
         ========================= */}

      {showPersonalModal && (
        <div
          className="personal-modal"
          onClick={closePersonalModal}
        >
          <div
            className="personal-modal-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="section-label">
              Мой календарь
            </div>

            <h2>
              {editingPersonalId ? 'Редактировать повод' : 'Добавить свой повод'}
            </h2>

            <p className="personal-modal-note">
              Личные поводы будут повторяться каждый год в эту дату.
            </p>

            <form
              onSubmit={
                savePersonalDate
              }
            >
              <label>
                Дата

                <input
                  type="date"
                  value={
                    personalForm.date
                  }
                  onChange={(event) =>
                    setPersonalForm(
                      (form) => ({
                        ...form,
                        date:
                          event.target
                            .value,
                      }),
                    )
                  }
                />
              </label>

              <label>
                Название

                <input
                  type="text"
                  placeholder="Например, день рождения мамы"
                  value={
                    personalForm.title
                  }
                  onChange={(event) =>
                    setPersonalForm(
                      (form) => ({
                        ...form,
                        title:
                          event.target
                            .value,
                      }),
                    )
                  }
                />
              </label>

              <label>
                Тип

                <select
                  value={
                    personalForm.type
                  }
                  onChange={(event) =>
                    setPersonalForm(
                      (form) => ({
                        ...form,
                        type:
                          event.target
                            .value,
                      }),
                    )
                  }
                >
                  {personalDateTypes.map(
                    (type) => (
                      <option
                        value={type.id}
                        key={type.id}
                      >
                        {type.icon}{' '}
                        {type.label}
                      </option>
                    ),
                  )}
                </select>
              </label>

              <div className="personal-modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closePersonalModal}
                >
                  Отмена
                </button>

                <button
                  type="submit"
                  className="congratulate-button"
                >
                  {editingPersonalId ? 'Сохранить изменения' : 'Добавить повод'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {congratulateOccasions.length > 0 && (
        <div
          className="congratulate-modal"
          onClick={() => {
            setCongratulateOccasions([])
          }}
        >
          <div
            className="congratulate-modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="congratulate-modal-close"
              onClick={() => {
                setCongratulateOccasions([])
              }}
              aria-label="Закрыть"
            >
              ×
            </button>

            <div className="section-label">
              Есть повод
            </div>

            <h2>
              Что будем отмечать?
            </h2>

            <p className="congratulate-modal-title">
              Выбери повод для поздравления
            </p>

            <div className="congratulate-modal-actions">
              {congratulateOccasions.map((occasion) => (
                <button
                  key={occasion.id}
                  type="button"
                  className="congratulate-choice"
                  onClick={() => {
                    setCongratulateOccasions([])
                    setCardCreatorOccasion(occasion)
                  }}
                >
                  <span className="congratulate-choice-icon">
                    {occasion.imageUrl ? (
                      <img
                        src={occasion.imageUrl}
                        alt=""
                      />
                    ) : (
                      occasion.icon
                    )}
                  </span>

                  <span>
                    <strong>
                      {occasion.title}
                    </strong>

                    {occasion.description && (
                      <small>
                        {occasion.description}
                      </small>
                    )}
                  </span>

                  <span>→</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="congratulate-cancel"
              onClick={() => {
                setCongratulateOccasions([])
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default App