import { useMemo, useState } from 'react'
import { toPng, toBlob } from 'html-to-image'
import './CardCreator.css'

const IMAGE_PROXY_URL =
  'https://est-povod-images.anastasiiapetrovam1.workers.dev/'

const STYLES = [
  {
    id: 'bright',
    name: 'Яркий',
    description:
      'Градиентный фон и несколько праздничных акцентов',
    className: 'card-style-bright',
    icon: '🌈',
  },
  {
    id: 'warm',
    name: 'Тёплый',
    description:
      'Спокойный цвет, тонкая рамка и уютное оформление',
    className: 'card-style-warm',
    icon: '🌷',
  },
  {
    id: 'minimal',
    name: 'Минималистичный',
    description:
      'Чистая типографика, воздух и ничего лишнего',
    className: 'card-style-minimal',
    icon: 'Aa',
  },
]

const BRIGHT_COLORS = [
  {
    id: 'coral',
    name: 'Коралловый',
    value: '#ff6f61',
    second: '#ffd166',
  },
  {
    id: 'pink',
    name: 'Розовый',
    value: '#f05fa5',
    second: '#ffb3d1',
  },
  {
    id: 'lilac',
    name: 'Сиреневый',
    value: '#9b7cff',
    second: '#d5a6ff',
  },
  {
    id: 'blue',
    name: 'Голубой',
    value: '#4da9ff',
    second: '#72e0d1',
  },
  {
    id: 'peach',
    name: 'Персиковый',
    value: '#ffad73',
    second: '#ffe0a3',
  },
  {
    id: 'yellow',
    name: 'Солнечный',
    value: '#ffd43b',
    second: '#ff9f43',
  },
  {
    id: 'mint',
    name: 'Мятный',
    value: '#45d6b0',
    second: '#a8f0d2',
  },
  {
    id: 'turquoise',
    name: 'Бирюзовый',
    value: '#24c6dc',
    second: '#7ee8fa',
  },
  {
    id: 'violet',
    name: 'Фиолетовый',
    value: '#7c5cff',
    second: '#e58cff',
  },
  {
    id: 'sunset',
    name: 'Закатный',
    value: '#ff7b54',
    second: '#c850c0',
  },
  {
    id: 'emerald',
    name: 'Изумрудный',
    value: '#00a878',
    second: '#a8e063',
  },
  {
    id: 'berry',
    name: 'Ягодный',
    value: '#c2185b',
    second: '#ff8a80',
  },
]

const WARM_COLORS = [
  {
    id: 'cream',
    name: 'Кремовый',
    value: '#f7eddf',
    text: '#493c32',
  },

  {
    id: 'rose',
    name: 'Пудровый',
    value: '#f3d8dc',
    text: '#4b353b',
  },

  {
    id: 'sage',
    name: 'Шалфей',
    value: '#dce7d8',
    text: '#344238',
  },

  {
    id: 'sky',
    name: 'Небесный',
    value: '#dce9f3',
    text: '#34414d',
  },

  {
    id: 'sand',
    name: 'Песочный',
    value: '#e8dcc4',
    text: '#493d2f',
  },

  {
    id: 'lavender',
    name: 'Лавандовый',
    value: '#e4dcef',
    text: '#43394d',
  },

  {
    id: 'butter',
    name: 'Сливочный',
    value: '#f6e7b8',
    text: '#51452d',
  },

  {
    id: 'terracotta',
    name: 'Терракотовый',
    value: '#e8c1ad',
    text: '#51382e',
  },

  {
    id: 'mist',
    name: 'Туманный',
    value: '#dce1e2',
    text: '#384144',
  },

  {
    id: 'pearl',
    name: 'Жемчужный',
    value: '#eee9e4',
    text: '#443f3b',
  },

  {
    id: 'apricot',
    name: 'Абрикосовый',
    value: '#f3d3b5',
    text: '#513c2d',
  },

  {
    id: 'dusty-blue',
    name: 'Дымчато-синий',
    value: '#ccdce5',
    text: '#35434c',
  },
]

const MINIMAL_COLORS = [
  {
    id: 'white',
    name: 'Белый',
    value: '#fafafa',
    accent: '#1f2933',
  },

  {
    id: 'ivory',
    name: 'Слоновая кость',
    value: '#f7f4ed',
    accent: '#39352f',
  },

  {
    id: 'cream',
    name: 'Молочный',
    value: '#f2ede4',
    accent: '#443d36',
  },

  {
    id: 'sand',
    name: 'Песочный',
    value: '#ebe6dc',
    accent: '#45413b',
  },

  {
    id: 'mist',
    name: 'Серый туман',
    value: '#e9eceb',
    accent: '#343c3d',
  },

  {
    id: 'stone',
    name: 'Каменный',
    value: '#deded9',
    accent: '#303330',
  },

  {
    id: 'blue',
    name: 'Холодный',
    value: '#edf3f7',
    accent: '#263b4d',
  },

  {
    id: 'ice',
    name: 'Лёд',
    value: '#e5eef2',
    accent: '#304653',
  },

  {
    id: 'sage',
    name: 'Шалфей',
    value: '#e4ebe3',
    accent: '#344238',
  },

  {
    id: 'dusty-rose',
    name: 'Пыльная роза',
    value: '#eee3e4',
    accent: '#493d40',
  },

  {
    id: 'lavender',
    name: 'Лаванда',
    value: '#e9e6ef',
    accent: '#413d4b',
  },

  {
    id: 'charcoal',
    name: 'Графит',
    value: '#e2e3e1',
    accent: '#252827',
  },
]

const IMAGE_SHAPES = [
  {
    id: 'square',
    name: 'Квадрат',
    className: 'shape-square',
  },
  {
    id: 'rounded',
    name: 'Скруглённая',
    className: 'shape-rounded',
  },
  {
    id: 'circle',
    name: 'Круг',
    className: 'shape-circle',
  },
  {
    id: 'vertical',
    name: 'Вертикальная',
    className: 'shape-vertical',
  },
  {
    id: 'horizontal',
    name: 'Горизонтальная',
    className: 'shape-horizontal',
  },
]

const BRIGHT_EMOJIS = [
  '✨',
  '🌸',
  '💐',
  '🎈',
  '🌼',
  '💛',
  '🦋',
  '⭐',
]

const GREETINGS = [
  'Желаю крепкого здоровья, счастья, любви и исполнения самых заветных желаний!',

  'Пусть каждый день приносит что-нибудь хорошее: добрые встречи, приятные новости и поводы для улыбки.',

  'Желаю, чтобы в жизни было больше радости, тепла, вдохновения и моментов, которые хочется запомнить.',

  'Пусть всё задуманное получается, мечты становятся планами, а планы — приятной реальностью.',

  'Желаю здоровья, душевного спокойствия, семейного тепла и большого человеческого счастья!',

  'Пусть рядом всегда будут люди, с которыми легко смеяться, приятно молчать и не страшно мечтать.',

  'Желаю побольше солнечных дней, уютных вечеров, счастливых событий и хороших новостей!',

  'Пусть жизнь радует неожиданными подарками, приятными встречами и маленькими чудесами.',

  'Желаю никогда не терять поводов для улыбки и всегда находить время для того, что действительно дорого сердцу.',

  'Пусть в доме будет тепло и уютно, в душе — спокойно, а в сердце — светло.',

  'Желаю сил для новых свершений, вдохновения для мечтаний и удачи во всех начинаниях!',

  'Пусть каждый новый день открывает что-то хорошее и оставляет после себя приятные воспоминания.',

  'Желаю любви, которая согревает, дружбы, которая поддерживает, и счастья, которым хочется делиться.',

  'Пусть всё хорошее приходит вовремя, нужные люди оказываются рядом, а счастливых моментов становится всё больше.',

  'Желаю побольше беззаботных дней, искреннего смеха, душевных разговоров и приятных сюрпризов.',

  'Пусть впереди ждёт много интересного, доброго и прекрасного. И пусть всё самое хорошее ещё только начинается!',

  'Желаю верить в себя, смело идти к мечтам и замечать счастье в самых простых вещах.',

  'Пусть сердце будет наполнено любовью, мысли — светом, а каждый день — чем-нибудь прекрасным.',

  'Желаю, чтобы желания исполнялись, возможности находились, а удача всегда была на вашей стороне.',

  'Пусть жизнь будет щедра на радость, добрых людей, приятные события и счастливые совпадения.',

  'Желаю мира в душе, гармонии в жизни и много-много поводов гордиться собой и радоваться каждому дню.',

  'Пусть рядом будут те, кто любит, понимает и всегда готов поддержать. А впереди — только хорошие перемены!',

  'Желаю прекрасного настроения сегодня, счастливых событий завтра и большой радости на долгие годы.',

  'Пусть каждый день будет наполнен теплом, заботой, улыбками и любовью близких людей.',

  'Желаю, чтобы жизнь чаще удивляла приятно, а каждый новый день приносил хотя бы одну маленькую радость.',

  'Пусть всё, о чём мечтается, однажды станет приятным воспоминанием о том, как мечта сбылась.',

  'Здоровья, счастья, любви и внутреннего света! Пусть этого всегда будет с избытком.',

  'Пусть в жизни будет место и большим мечтам, и маленьким радостям, и спонтанным счастливым моментам.',

  'Желаю лёгкости, вдохновения и уверенности в том, что впереди вас ждёт много хорошего.',

  'Пусть сегодняшний день станет началом ещё одного прекрасного периода в жизни. Счастья вам и всего самого доброго!'
]

function CardCreator({
  occasion = {
    title: 'День рождения',
    description:
      'Праздничный день, который хочется провести рядом с близкими людьми.',
    category: 'secular',
  },
  onBack,
}) {
  const [mode, setMode] = useState(null)
  const [step, setStep] = useState(1)

  const [style, setStyle] = useState('bright')

  const [brightColor, setBrightColor] =
    useState('coral')

  const [warmColor, setWarmColor] =
    useState('cream')

  const [minimalColor, setMinimalColor] =
    useState('white')

  const [imageShape, setImageShape] =
    useState('rounded')

  const [imageSize, setImageSize] =
    useState(140)

  const [greetingIndex, setGreetingIndex] =
    useState(0)

  const [customText, setCustomText] =
    useState('')

  const [isExporting, setIsExporting] =
    useState(false)

  const [readyCards, setReadyCards] = useState([])
  const [readyCardsLoading, setReadyCardsLoading] =
    useState(false)
  const [readyCardsError, setReadyCardsError] =
    useState('')

  const [selectedReadyCard, setSelectedReadyCard] =
  useState(null)

  const [readyCardActionLoading, setReadyCardActionLoading] =
    useState(false)

  const isOrthodox =
    occasion.calendar === 'orthodox'

  const selectedBrightColor = useMemo(
    () =>
      BRIGHT_COLORS.find(
        (item) => item.id === brightColor,
      ) || BRIGHT_COLORS[0],
    [brightColor],
  )

  const selectedWarmColor = useMemo(
    () =>
      WARM_COLORS.find(
        (item) => item.id === warmColor,
      ) || WARM_COLORS[0],
    [warmColor],
  )

  const selectedMinimalColor = useMemo(
    () =>
      MINIMAL_COLORS.find(
        (item) => item.id === minimalColor,
      ) || MINIMAL_COLORS[0],
    [minimalColor],
  )

  const greeting =
    customText.trim() ||
    GREETINGS[greetingIndex]

  const infoUrl =
    occasion.infoUrl || null

  /*
   * Находим именно открытку, которая сейчас
   * находится в финальном предпросмотре.
   *
   * Важно: live preview на шаге редактора
   * тоже существует, поэтому нельзя просто
   * использовать getElementById, если на странице
   * одновременно присутствуют две открытки.
   */
  const getExportCard = () => {
    const previewWrapper =
      document.querySelector(
        '.card-preview-wrapper',
      )

    if (previewWrapper) {
      const card =
        previewWrapper.querySelector(
          '.greeting-card',
        )

      if (card) {
        return card
      }
    }

    const livePreview =
      document.querySelector(
        '.live-card-preview',
      )

    if (livePreview) {
      const card =
        livePreview.querySelector(
          '.greeting-card',
        )

      if (card) {
        return card
      }
    }

    return document.querySelector(
      '.greeting-card',
    )
  }

  /*
   * Небольшая пауза перед экспортом.
   *
   * Она нужна, чтобы браузер успел отрисовать
   * шрифты, изображения и последние изменения
   * перед тем, как html-to-image будет делать PNG.
   */
  const waitForRender = async () => {
    if (document.fonts?.ready) {
      try {
        await document.fonts.ready
      } catch {
        // Не блокируем экспорт, если fonts.ready недоступен.
      }
    }

    await new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(resolve)
      })
    })
  }

  const prepareImagesForExport = async (card) => {
    const images = Array.from(
      card.querySelectorAll('img'),
    )

    const restoreTasks = []

    const waitForImage = (img, src) =>
      new Promise((resolve, reject) => {
        const finish = () => {
          img.removeEventListener('load', onLoad)
          img.removeEventListener('error', onError)
        }

        const onLoad = () => {
          finish()
          resolve()
        }

        const onError = () => {
          finish()
          reject(
            new Error(`Не удалось загрузить изображение: ${src}`),
          )
        }

        img.addEventListener('load', onLoad, { once: true })
        img.addEventListener('error', onError, { once: true })

        img.src = src

        if (img.complete) {
          finish()

          if (img.naturalWidth > 0) {
            resolve()
          } else {
            reject(
              new Error(`Изображение недоступно: ${src}`),
            )
          }
        }
      })

    try {
      for (const img of images) {
        const originalSrc = img.currentSrc || img.src

        let sourceUrl

        try {
          sourceUrl = new URL(originalSrc)
        } catch {
          continue
        }

        const host = sourceUrl.hostname.toLowerCase()

        const isAzbyka =
          sourceUrl.protocol === 'https:' &&
          (host === 'azbyka.ru' ||
            host.endsWith('.azbyka.ru'))

        if (!isAzbyka) {
          continue
        }

        const proxyUrl = new URL(IMAGE_PROXY_URL)
        proxyUrl.searchParams.set('url', sourceUrl.href)

        restoreTasks.push({
          img,
          originalSrc: img.getAttribute('src'),
        })

        await waitForImage(img, proxyUrl.href)

        if (img.decode) {
          await img.decode()
        }
      }
    } catch (error) {
      for (const task of restoreTasks.reverse()) {
        if (task.originalSrc !== null) {
          task.img.src = task.originalSrc
        } else {
          task.img.removeAttribute('src')
        }
      }

      throw error
    }

    return () => {
      for (const task of restoreTasks.reverse()) {
        if (task.originalSrc !== null) {
          task.img.src = task.originalSrc
        } else {
          task.img.removeAttribute('src')
        }
      }
    }
  }

  const handleDownload = async () => {
    if (isExporting) return

    const card = getExportCard()

    if (!card) {
      alert(
        'Не удалось найти открытку для сохранения.',
      )
      return
    }

    setIsExporting(true)

    let restoreImages = () => {}

    try {
      await waitForRender()

      restoreImages = await prepareImagesForExport(card)
      await waitForRender()

      const dataUrl = await toPng(card, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff',
        imagePlaceholder:
          'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
      })

      const link =
        document.createElement('a')

      link.download = 'otkrytka.png'
      link.href = dataUrl

      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error(
        'Не удалось создать PNG:',
        error,
      )

      alert(
        'Не получилось сохранить открытку. Попробуйте ещё раз.',
      )

    } finally {
      restoreImages()
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    if (isExporting) return

    const card = getExportCard()

    if (!card) {
      alert(
        'Не удалось найти открытку для отправки.',
      )
      return
    }

    setIsExporting(true)

    let restoreImages = () => {}

    try {
      await waitForRender()

      restoreImages = await prepareImagesForExport(card)
      await waitForRender()

      /*
       * Важный момент:
       * раньше здесь использовалось
       *
       * fetch(dataUrl)
       *
       * что может работать нестабильно в Telegram
       * WebView и некоторых браузерах.
       *
       * Теперь получаем Blob непосредственно
       * через html-to-image.
       */
      const blob = await toBlob(card, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#ffffff',
        imagePlaceholder:
          'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
      })

      if (!blob) {
        throw new Error(
          'html-to-image не вернул Blob',
        )
      }

      const file = new File(
        [blob],
        'otkrytka.png',
        {
          type: 'image/png',
        },
      )

      /*
       * Сначала пробуем нативное меню
       * «Поделиться».
       */
      if (
        typeof navigator !== 'undefined' &&
        typeof navigator.share === 'function'
      ) {
        let canShareFile = false

        if (
          typeof navigator.canShare ===
          'function'
        ) {
          try {
            canShareFile =
              navigator.canShare({
                files: [file],
              })
          } catch {
            canShareFile = false
          }
        }

        if (canShareFile) {
          await navigator.share({
            files: [file],
            title: occasion.title,
            text: greeting,
          })

          return
        }
      }

      /*
       * Если браузер не умеет делиться файлами,
       * просто сохраняем PNG.
       */
      const dataUrl =
        await toPng(card, {
          pixelRatio: 2,
          cacheBust: true,
          backgroundColor: '#ffffff',
          imagePlaceholder:
            'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=',
        })

      const link =
        document.createElement('a')

      link.download = 'otkrytka.png'
      link.href = dataUrl

      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      /*
       * Пользователь нажал «Отмена» в меню
       * поделиться — это не ошибка.
       */
      if (
        error?.name === 'AbortError'
      ) {
        return
      }

      console.error(
        'Ошибка при отправке открытки:',
        error,
      )

      alert(
        'Не удалось поделиться открыткой. Попробуйте сохранить PNG.',
      )

    } finally {
      restoreImages()
      setIsExporting(false)
    }
  }

  const previousStep = () => {
    if (mode === null) {
      onBack?.()
      return
    }

    if (mode === 'search') {
      setMode(null)
      return
    }

    if (step === 1) {
      setMode(null)
      return
    }

    setStep(1)
  }

  const nextStep = () => {
    setStep(2)
  }

  const changeGreeting = () => {
    setGreetingIndex(
      (current) =>
        (current + 1) %
        GREETINGS.length,
    )

    setCustomText('')
  }

  const chooseMode = (nextMode) => {
    setMode(nextMode)

    if (nextMode === 'create') {
      setStep(1)
    }
  }

  const searchReadyCards = async () => {
    const occasionTitle = occasion.title?.trim()

    if (!occasionTitle) {
      return
    }

    setReadyCards([])
    setReadyCardsError('')
    setReadyCardsLoading(true)

    try {
      const response = await fetch(
        'https://est-povod-api.onrender.com/api/ready-cards',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: occasionTitle,
          }),
        },
      )

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`,
        )
      }

      const data = await response.json()

      const results = Array.isArray(
        data.results,
      )
        ? data.results
        : []

      setReadyCards(results)

      if (results.length === 0) {
        setReadyCardsError(
          'Готовых открыток для этого повода пока не нашли.',
        )
      }
    } catch (error) {
      console.error(
        'Ошибка поиска готовых открыток:',
        error,
      )

      setReadyCardsError(
        'Не удалось найти готовые открытки. Попробуйте ещё раз.',
      )
    } finally {
      setReadyCardsLoading(false)
    }
  }

  const openReadyCard = (card) => {
    setSelectedReadyCard(card)
  }

  const closeReadyCard = () => {
    if (readyCardActionLoading) return

    setSelectedReadyCard(null)
  }

  const handleReadyCardDownload = async () => {
    if (
      !selectedReadyCard?.image ||
      readyCardActionLoading
    ) {
      return
    }

    setReadyCardActionLoading(true)

    try {
      const response = await fetch(
        selectedReadyCard.image,
      )

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`,
        )
      }

      const blob =
        await response.blob()

      const extension =
        blob.type === 'image/png'
          ? 'png'
          : blob.type === 'image/gif'
            ? 'gif'
            : blob.type === 'image/webp'
              ? 'webp'
              : 'jpg'

      const fileName =
        `otkrytka-${Date.now()}.${extension}`

      const blobUrl =
        URL.createObjectURL(blob)

      const link =
        document.createElement('a')

      link.href = blobUrl
      link.download = fileName

      document.body.appendChild(link)
      link.click()
      link.remove()

      URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error(
        'Не удалось сохранить готовую открытку:',
        error,
      )

      /*
      * Это как раз тот случай, когда внешний
      * сайт может запретить fetch из браузера
      * через CORS.
      *
      * Пока локально не подключаем Cloudflare.
      * Вместо этого открываем оригинал —
      * пользователь всё равно сможет сохранить
      * изображение средствами браузера / Telegram.
      */
      window.open(
        selectedReadyCard.image,
        '_blank',
        'noopener,noreferrer',
      )
    } finally {
      setReadyCardActionLoading(false)
    }
  }

  const handleReadyCardShare = async () => {
    if (
      !selectedReadyCard?.image ||
      readyCardActionLoading
    ) {
      return
    }

    setReadyCardActionLoading(true)

    try {
      /*
      * Сначала пробуем получить сам файл.
      * Если источник разрешает CORS, можем
      * поделиться именно изображением.
      */
      const response = await fetch(
        selectedReadyCard.image,
      )

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`,
        )
      }

      const blob =
        await response.blob()

      const extension =
        blob.type === 'image/png'
          ? 'png'
          : blob.type === 'image/gif'
            ? 'gif'
            : blob.type === 'image/webp'
              ? 'webp'
              : 'jpg'

      const file =
        new File(
          [blob],
          `otkrytka.${extension}`,
          {
            type:
              blob.type ||
              'image/jpeg',
          },
        )

      if (
        typeof navigator !== 'undefined' &&
        typeof navigator.share === 'function'
      ) {
        let canShareFile = true

        if (
          typeof navigator.canShare ===
          'function'
        ) {
          try {
            canShareFile =
              navigator.canShare({
                files: [file],
              })
          } catch {
            canShareFile = false
          }
        }

        if (canShareFile) {
          await navigator.share({
            files: [file],
            title:
              selectedReadyCard.title ||
              occasion.title,
            text:
              'Открытка найдена через «ЕСТЬ ПОВОД»',
          })

          return
        }
      }

      /*
      * Если браузер не умеет делиться файлами,
      * открываем оригинал.
      */
      window.open(
        selectedReadyCard.image,
        '_blank',
        'noopener,noreferrer',
      )
    } catch (error) {
      /*
      * Отмена системного меню Share — нормальная
      * ситуация, ничего не показываем.
      */
      if (
        error?.name === 'AbortError'
      ) {
        return
      }

      console.error(
        'Не удалось поделиться готовой открыткой:',
        error,
      )

      /*
      * Пока нет Cloudflare-прокси.
      * Поэтому даём пользователю открыть
      * оригинальную картинку.
      */
      window.open(
        selectedReadyCard.image,
        '_blank',
        'noopener,noreferrer',
      )
    } finally {
      setReadyCardActionLoading(false)
    }
  }
  
  const renderOccasionMeta = () => (
    <>
      <h3>{occasion.title}</h3>

      {isOrthodox &&
        occasion.description && (
          <div className="card-occasion-description">
            {occasion.description}
          </div>
        )}
    </>
  )

  const renderOccasionImage = () => {
    if (!occasion.imageUrl) {
      return null
    }

    return (
      <div
        className={`card-occasion-image shape-${imageShape}`}
        style={{
          '--image-size': `${imageSize}px`,
        }}
      >
        <img
          src={occasion.imageUrl}
          alt={occasion.title}
        />
      </div>
    )
  }

  const renderInfoLink = () => {
    if (!infoUrl) {
      return null
    }

    return (
      <a
        href={infoUrl}
        target="_blank"
        rel="noreferrer"
        className="card-info-link"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        Подробнее о празднике →
      </a>
    )
  }

  const renderWatermark = () => (
    <div
      className="card-watermark"
      aria-hidden="true"
    >
      ★ ЕСТЬ ПОВОД!
    </div>
  )

  const renderBrightCard = () => (
    <div
      className="greeting-card greeting-card-bright"
      style={{
        '--bright-main':
          selectedBrightColor.value,
        '--bright-second':
          selectedBrightColor.second,
      }}
    >
      <div className="bright-orb bright-orb-one" />
      <div className="bright-orb bright-orb-two" />

      <div className="bright-emoji bright-emoji-one">
        {BRIGHT_EMOJIS[0]}
      </div>

      <div className="bright-emoji bright-emoji-two">
        {BRIGHT_EMOJIS[2]}
      </div>

      <div className="bright-emoji bright-emoji-three">
        {BRIGHT_EMOJIS[5]}
      </div>

      <div className="bright-emoji bright-emoji-four">
        {BRIGHT_EMOJIS[6]}
      </div>

      <div className="bright-content">
        <div className="bright-kicker">
          {isOrthodox
            ? 'ПРАВОСЛАВНЫЙ ПРАЗДНИК'
            : 'С ПРАЗДНИКОМ!'}
        </div>

        {renderOccasionImage()}

        {renderOccasionMeta()}

        <div className="bright-divider">
          <span />
          <b>✦</b>
          <span />
        </div>

        <p>{greeting}</p>

        {renderInfoLink()}
      </div>

      {renderWatermark()}
    </div>
  )

  const renderWarmCard = () => (
    <div
      className="greeting-card greeting-card-warm"
      style={{
        '--warm-bg':
          selectedWarmColor.value,
        '--warm-text':
          selectedWarmColor.text,
      }}
    >
      <div className="warm-frame">
        <div className="warm-content">
          <div className="warm-kicker">
            {isOrthodox
              ? 'ПРАВОСЛАВНЫЙ ПРАЗДНИК'
              : 'С ТЕПЛОМ И ЛЮБОВЬЮ'}
          </div>

          {renderOccasionImage()}

          {renderOccasionMeta()}

          <div className="warm-divider">
            ✦
          </div>

          <p>{greeting}</p>

          {renderInfoLink()}
        </div>
      </div>

      {renderWatermark()}
    </div>
  )

  const renderMinimalCard = () => (
    <div
      className="greeting-card greeting-card-minimal"
      style={{
        '--minimal-bg':
          selectedMinimalColor.value,
        '--minimal-accent':
          selectedMinimalColor.accent,
      }}
    >
      <div className="minimal-content">
        {renderOccasionImage()}

        <div className="minimal-kicker">
          {isOrthodox
            ? 'ПРАВОСЛАВНЫЙ КАЛЕНДАРЬ'
            : '★ ЕСТЬ ПОВОД!'}
        </div>

        {renderOccasionMeta()}

        <div className="minimal-line" />

        <p>{greeting}</p>

        {renderInfoLink()}
      </div>

      {renderWatermark()}
    </div>
  )

  const renderCard = () => {
    if (style === 'warm') {
      return renderWarmCard()
    }

    if (style === 'minimal') {
      return renderMinimalCard()
    }

    return renderBrightCard()
  }

  return (
    <div className="card-creator">
      <header className="card-creator-header">
        <button
          type="button"
          className="creator-back-button"
          onClick={previousStep}
          disabled={isExporting}
        >
          ← Назад
        </button>

        <div className="creator-header-title">
          <div className="creator-kicker">
            ★ ЕСТЬ ПОВОД!
          </div>

          <h1>{occasion.title}</h1>
        </div>
      </header>

      {mode === 'create' && (
        <div className="creator-progress">
          <div
            className={`creator-progress-item ${
              step >= 1 ? 'active' : ''
            }`}
          />

          <div
            className={`creator-progress-item ${
              step >= 2 ? 'active' : ''
            }`}
          />
        </div>
      )}

      {mode === null && (
        <section className="creator-step mode-step">
          <div className="creator-step-label">
            ПОЗДРАВЛЕНИЕ
          </div>

          <h2>
            Что хочешь отправить?
          </h2>

          <p className="creator-description">
            Можно сделать свою открытку
            или найти готовую картинку
            в интернете.
          </p>

          <div className="mode-grid">
            <button
              type="button"
              className="mode-card mode-create"
              onClick={() =>
                chooseMode('create')
              }
            >
              <div className="mode-card-art">
                🌈
                <span>✨</span>
                💐
              </div>

              <strong>
                Создать открытку
              </strong>

              <span>
                Выбрать оформление,
                написать поздравление
                и поделиться
              </span>

              <b>→</b>
            </button>

            <button
              type="button"
              className="mode-card mode-search"
              onClick={() =>
                chooseMode('search')
              }
            >
              <div className="mode-card-art">
                🖼️
                <span>🔎</span>
              </div>

              <strong>
                Найти готовую картинку
              </strong>

              <span>
                Поиск праздничных
                изображений в интернете
              </span>

              <b>→</b>
            </button>
          </div>
        </section>
      )}

      {mode === 'create' &&
        step === 1 && (
          <section className="creator-step creator-editor-step">
            <div className="creator-step-label">
              ШАГ 1
            </div>

            <h2>
              Создай свою открытку
            </h2>

            <p className="creator-description">
              Выбери оформление, цвет и
              поздравление. Результат
              меняется сразу в предпросмотре.
            </p>

            <div className="editor-section">
              <div className="editor-section-heading">
                <div>
                  <div className="option-label">
                    ОФОРМЛЕНИЕ
                  </div>

                  <span>
                    Выбери настроение открытки
                  </span>
                </div>
              </div>

              <div className="style-grid">
                {STYLES.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`style-card ${
                      style === item.id
                        ? 'selected'
                        : ''
                    }`}
                    onClick={() =>
                      setStyle(item.id)
                    }
                  >
                    <div
                      className={`style-preview ${item.className}`}
                    >
                      {item.id ===
                        'bright' && (
                        <>
                          <span className="style-preview-emoji one">
                            ✨
                          </span>

                          <span className="style-preview-emoji two">
                            🌸
                          </span>

                          <strong>
                            С ПРАЗДНИКОМ!
                          </strong>

                          <span className="style-preview-dot" />
                        </>
                      )}

                      {item.id === 'warm' && (
                        <div className="style-preview-frame">
                          <strong>
                            С ТЕПЛОМ
                          </strong>

                          <span>✦</span>
                        </div>
                      )}

                      {item.id ===
                        'minimal' && (
                        <>
                          <span className="style-preview-small">
                            ★ ЕСТЬ ПОВОД!
                          </span>

                          <strong>
                            ПРАЗДНИК
                          </strong>

                          <span className="style-preview-line" />
                        </>
                      )}
                    </div>

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="editor-section">
              {style === 'bright' && (
                <>
                  <div className="option-label">
                    ЦВЕТ ГРАДИЕНТА
                  </div>

                  <div className="color-options">
                    {BRIGHT_COLORS.map(
                      (color) => (
                        <button
                          type="button"
                          key={color.id}
                          title={color.name}
                          aria-label={
                            color.name
                          }
                          className={`color-option ${
                            brightColor ===
                            color.id
                              ? 'selected'
                              : ''
                          }`}
                          style={{
                            background: `linear-gradient(135deg, ${color.value}, ${color.second})`,
                          }}
                          onClick={() =>
                            setBrightColor(
                              color.id,
                            )
                          }
                        />
                      ),
                    )}
                  </div>
                </>
              )}

              {style === 'warm' && (
                <>
                  <div className="option-label">
                    ЦВЕТ ФОНА
                  </div>

                  <div className="color-options">
                    {WARM_COLORS.map(
                      (color) => (
                        <button
                          type="button"
                          key={color.id}
                          title={color.name}
                          aria-label={
                            color.name
                          }
                          className={`color-option ${
                            warmColor ===
                            color.id
                              ? 'selected'
                              : ''
                          }`}
                          style={{
                            backgroundColor:
                              color.value,
                          }}
                          onClick={() =>
                            setWarmColor(
                              color.id,
                            )
                          }
                        />
                      ),
                    )}
                  </div>
                </>
              )}

              {style === 'minimal' && (
                <>
                  <div className="option-label">
                    ЦВЕТ
                  </div>

                  <div className="color-options">
                    {MINIMAL_COLORS.map(
                      (color) => (
                        <button
                          type="button"
                          key={color.id}
                          title={color.name}
                          aria-label={
                            color.name
                          }
                          className={`color-option ${
                            minimalColor ===
                            color.id
                              ? 'selected'
                              : ''
                          }`}
                          style={{
                            backgroundColor:
                              color.value,
                          }}
                          onClick={() =>
                            setMinimalColor(
                              color.id,
                            )
                          }
                        />
                      ),
                    )}
                  </div>
                </>
              )}
            </div>

            {occasion.imageUrl && (
              <div className="editor-section image-editor">
                <div className="editor-section-heading">
                  <div>
                    <div className="option-label">
                      ИЗОБРАЖЕНИЕ
                    </div>

                    <span>
                      Настрой форму и размер
                    </span>
                  </div>
                </div>

                <div className="image-editor-group">
                  <span className="image-editor-label">
                    Форма
                  </span>

                  <div className="image-shape-options">
                    {IMAGE_SHAPES.map(
                      (shape) => (
                        <button
                          type="button"
                          key={shape.id}
                          className={`image-shape-option ${
                            imageShape ===
                            shape.id
                              ? 'selected'
                              : ''
                          }`}
                          onClick={() =>
                            setImageShape(
                              shape.id,
                            )
                          }
                          aria-label={
                            shape.name
                          }
                        >
                          <span
                            className={`shape-preview ${shape.className}`}
                          />

                          <span>
                            {shape.name}
                          </span>
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className="image-editor-group image-size-group">
                  <div className="image-size-header">
                    <span className="image-editor-label">
                      Размер
                    </span>

                    <strong>
                      {imageSize}px
                    </strong>
                  </div>

                  <input
                    type="range"
                    min="60"
                    max="300"
                    step="5"
                    value={imageSize}
                    onChange={(event) =>
                      setImageSize(
                        Number(
                          event.target.value,
                        ),
                      )
                    }
                    className="image-size-range"
                    aria-label="Размер изображения"
                  />

                  <div className="image-size-hints">
                    <span>60 px</span>
                    <span>300 px</span>
                  </div>
                </div>
              </div>
            )}

            <div className="editor-section greeting-editor">
              <div className="editor-section-heading">
                <div>
                  <div className="option-label">
                    ПОЗДРАВЛЕНИЕ
                  </div>

                  <span>
                    Готовый текст или свой
                  </span>
                </div>

                <button
                  type="button"
                  className="change-greeting-button"
                  onClick={
                    changeGreeting
                  }
                >
                  ↻ Другой вариант
                </button>
              </div>

              <div className="greeting-preview">
                {greeting}
              </div>

              <textarea
                value={customText}
                onChange={(event) =>
                  setCustomText(
                    event.target.value,
                  )
                }
                placeholder="Или напиши свой текст..."
                rows={4}
              />
            </div>

            <div className="live-card-editor">
              <div className="live-card-editor-header">
                <div>
                  <div className="option-label">
                    ПРЕДПРОСМОТР
                  </div>

                  <span>
                    Открытка меняется сразу
                  </span>
                </div>
              </div>

              <div className="live-card-preview">
                {renderCard()}
              </div>
            </div>

            <button
              type="button"
              className="creator-primary-button"
              onClick={nextStep}
            >
              Посмотреть открытку →
            </button>
          </section>
        )}

      {mode === 'create' &&
        step === 2 && (
          <section className="creator-step creator-preview-step">
            <div className="creator-step-label">
              ГОТОВО
            </div>

            <h2>
              Вот что получилось
            </h2>

            <p className="creator-description">
              Открытку можно сохранить или
              сразу отправить.
            </p>

            <div className="card-preview-wrapper">
              {renderCard()}
            </div>

            <div className="creator-actions">
              <button
                type="button"
                className="creator-primary-button"
                onClick={handleShare}
                disabled={isExporting}
              >
                {isExporting
                  ? 'Готовим открытку…'
                  : '✈️ Поделиться'}
              </button>

              <button
                type="button"
                className="creator-secondary-button"
                onClick={
                  handleDownload
                }
                disabled={isExporting}
              >
                {isExporting
                  ? 'Подготовка…'
                  : '↓ Сохранить PNG'}
              </button>

              <button
                type="button"
                className="creator-secondary-button"
                onClick={() =>
                  setStep(1)
                }
                disabled={isExporting}
              >
                ← Изменить открытку
              </button>
            </div>
          </section>
        )}

      {mode === 'search' && (
        <section className="creator-step search-step">
          <div className="creator-step-label">
            ★ ЕСТЬ ПОВОД!
          </div>

          <h2>
            Готовые открытки
          </h2>

          <p className="creator-description">
            Ищем готовые картинки для выбранного
            праздника сразу в нескольких источниках.
          </p>

          <div className="ready-card-occasion">
            <span>ПОВОД</span>

            <strong>
              {occasion.title}
            </strong>
          </div>

          {!readyCardsLoading &&
            readyCards.length === 0 &&
            !readyCardsError && (
              <button
                type="button"
                className="creator-primary-button"
                onClick={searchReadyCards}
              >
                🔎 Найти готовые открытки
              </button>
            )}

          {readyCardsLoading && (
            <div className="ready-cards-loading">
              <div className="ready-cards-loading-icon">
                🔎
              </div>

              <strong>
                Ищем открытки…
              </strong>

              <span>
                Проверяем несколько источников
              </span>
            </div>
          )}

          {readyCardsError && (
            <div className="ready-cards-error">
              <strong>
                {readyCardsError}
              </strong>

              <button
                type="button"
                className="creator-secondary-button"
                onClick={searchReadyCards}
              >
                Попробовать ещё раз
              </button>
            </div>
          )}

          {!readyCardsLoading &&
            readyCards.length > 0 && (
              <>
                <div className="ready-cards-found">
                  Найдено открыток: {readyCards.length}
                </div>

                <div className="ready-cards-grid">
                  {readyCards.map(
                    (card, index) => (
                      <button
                        type="button"
                        key={`${card.image}-${index}`}
                        className="ready-card-item"
                        onClick={() =>
                          openReadyCard(card)
                        }
                      >
                        <div className="ready-card-image-wrapper">
                          <img
                            src={card.image}
                            alt={
                              card.title ||
                              occasion.title
                            }
                            loading="lazy"
                          />
                        </div>

                        <span className="ready-card-source">
                          {card.source}
                        </span>
                      </button>
                    ),
                  )}
                </div>
              </>
            )}
        </section>
      )}

      {selectedReadyCard && (
        <div
          className="ready-card-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр готовой открытки"
          onClick={closeReadyCard}
        >
          <div
            className="ready-card-modal-content"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              className="ready-card-modal-close"
              onClick={closeReadyCard}
              disabled={
                readyCardActionLoading
              }
              aria-label="Закрыть"
            >
              ×
            </button>

            <div className="ready-card-modal-image-wrapper">
              <img
                src={selectedReadyCard.image}
                alt={
                  selectedReadyCard.title ||
                  occasion.title
                }
              />
            </div>

            <div className="ready-card-modal-info">
              <strong>
                {selectedReadyCard.title ||
                  occasion.title}
              </strong>

              <span>
                Найдено через «★ ЕСТЬ ПОВОД!»
              </span>

              {selectedReadyCard.source && (
                <small>
                  Источник:{' '}
                  {selectedReadyCard.source}
                </small>
              )}
            </div>

            <div className="ready-card-modal-actions">
              <button
                type="button"
                className="creator-primary-button"
                onClick={
                  handleReadyCardShare
                }
                disabled={
                  readyCardActionLoading
                }
              >
                {readyCardActionLoading
                  ? 'Подготовка…'
                  : '✈️ Поделиться'}
              </button>

              <button
                type="button"
                className="creator-secondary-button"
                onClick={
                  handleReadyCardDownload
                }
                disabled={
                  readyCardActionLoading
                }
              >
                {readyCardActionLoading
                  ? 'Подготовка…'
                  : '↓ Сохранить'}
              </button>

              {selectedReadyCard.page && (
                <a
                  href={
                    selectedReadyCard.page
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="ready-card-source-link"
                >
                  Источник →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default CardCreator