const occasions = [
  // =========================================================
  // ЯНВАРЬ
  // =========================================================

  {
    id: 'old-new-year',
    date: '01-14',
    title: 'Старый Новый год',
    description:
      'Тёплый неофициальный повод ещё раз поздравить близких с началом года.',
    category: 'tradition',
    categoryLabel: 'Традиции',
    icon: '🎄',
    calendar: 'secular',
    type: 'tradition',
    priority: 76,
    congratulatable: true,
    recipients: ['Родным', 'Друзьям'],
  },

  {
    id: 'student-day',
    date: '01-25',
    title: 'День студента',
    description:
      'Татьянин день и повод поздравить студентов, бывших студентов и преподавателей.',
    category: 'professional',
    categoryLabel: 'Профессиональные',
    icon: '🎓',
    calendar: 'secular',
    type: 'professional',
    priority: 88,
    congratulatable: true,
    recipients: ['Друзьям', 'Коллегам'],
  },

  // =========================================================
  // ФЕВРАЛЬ
  // =========================================================

  {
    id: 'valentines-day',
    date: '02-14',
    title: 'День святого Валентина',
    description:
      'Неформальный повод сказать близкому человеку о своих чувствах.',
    category: 'love',
    categoryLabel: 'Любовь',
    icon: '💌',
    calendar: 'secular',
    type: 'love',
    priority: 86,
    congratulatable: true,
    recipients: ['Любимым'],
  },

  {
    id: 'mother-language-day',
    date: '02-21',
    title: 'Международный день родного языка',
    description:
      'День языкового и культурного многообразия.',
    category: 'culture',
    categoryLabel: 'Культура',
    icon: '🔤',
    calendar: 'secular',
    type: 'culture',
    priority: 62,
    congratulatable: false,
    recipients: [],
  },

  // =========================================================
  // МАРТ
  // =========================================================

  {
    id: 'pi-day',
    date: '03-14',
    title: 'День числа π',
    description:
      'Необычный день для любителей математики, науки и красивых чисел.',
    category: 'science',
    categoryLabel: 'Наука',
    icon: 'π',
    calendar: 'secular',
    type: 'science',
    priority: 67,
    congratulatable: true,
    recipients: ['Друзьям', 'Коллегам'],
  },

  {
    id: 'happiness-day',
    date: '03-20',
    title: 'Международный день счастья',
    description:
      'Хороший повод напомнить близким, что счастье складывается из маленьких вещей.',
    category: 'kindness',
    categoryLabel: 'Добрые поводы',
    icon: '☀️',
    calendar: 'secular',
    type: 'kindness',
    priority: 84,
    congratulatable: true,
    recipients: ['Родным', 'Друзьям'],
  },

  {
    id: 'poetry-day',
    date: '03-21',
    title: 'Всемирный день поэзии',
    description:
      'Повод отправить кому-нибудь любимое стихотворение.',
    category: 'culture',
    categoryLabel: 'Культура',
    icon: '📖',
    calendar: 'secular',
    type: 'culture',
    priority: 73,
    congratulatable: true,
    recipients: ['Друзьям', 'Коллегам'],
  },

  {
    id: 'theatre-day',
    date: '03-27',
    title: 'Всемирный день театра',
    description:
      'Праздник театрального искусства и всех, кто создаёт спектакли.',
    category: 'culture',
    categoryLabel: 'Культура',
    icon: '🎭',
    calendar: 'secular',
    type: 'culture',
    priority: 74,
    congratulatable: true,
    recipients: ['Друзьям', 'Коллегам'],
  },

  // =========================================================
  // АПРЕЛЬ
  // =========================================================

  {
    id: 'april-fools',
    date: '04-01',
    title: 'День смеха',
    description:
      'Самый несерьёзный день года и отличный повод отправить кому-нибудь улыбку.',
    category: 'fun',
    categoryLabel: 'Необычные',
    icon: '🤡',
    calendar: 'secular',
    type: 'fun',
    priority: 82,
    congratulatable: true,
    recipients: ['Друзьям', 'Коллегам'],
  },

  {
    id: 'cosmonautics-day',
    date: '04-12',
    title: 'День космонавтики',
    description:
      'Памятная дата, связанная с первым полётом человека в космос.',
    category: 'science',
    categoryLabel: 'Наука',
    icon: '🚀',
    calendar: 'secular',
    type: 'science',
    priority: 88,
    congratulatable: true,
    recipients: ['Родным', 'Друзьям', 'Коллегам'],
  },

  {
    id: 'art-day',
    date: '04-15',
    title: 'Всемирный день искусства',
    description:
      'Повод посмотреть на что-нибудь красивое или поделиться любимым произведением.',
    category: 'culture',
    categoryLabel: 'Культура',
    icon: '🎨',
    calendar: 'secular',
    type: 'culture',
    priority: 70,
    congratulatable: true,
    recipients: ['Друзьям'],
  },

  {
    id: 'book-day',
    date: '04-23',
    title: 'Всемирный день книги',
    description:
      'Праздник книг, чтения и авторов.',
    category: 'culture',
    categoryLabel: 'Культура',
    icon: '📚',
    calendar: 'secular',
    type: 'culture',
    priority: 78,
    congratulatable: true,
    recipients: ['Родным', 'Друзьям', 'Коллегам'],
  },

  // 🔥 ПРОФЕССИОНАЛЬНЫЙ

  {
    id: 'firefighters-day',
    date: '04-30',
    title: 'День пожарной охраны',
    description:
      'Профессиональный праздник сотрудников пожарной охраны и всех, кто занимается предотвращением и ликвидацией пожаров.',
    category: 'professional',
    categoryLabel: 'Профессиональные',
    icon: '🚒',
    calendar: 'secular',
    type: 'professional',
    priority: 94,
    congratulatable: true,
    recipients: ['Пожарным', 'Коллегам', 'Друзьям'],
  },

  {
    id: 'dance-day',
    date: '04-29',
    title: 'Международный день танца',
    description:
      'Повод включить музыку и немного подвигаться.',
    category: 'fun',
    categoryLabel: 'Необычные',
    icon: '💃',
    calendar: 'secular',
    type: 'fun',
    priority: 72,
    congratulatable: true,
    recipients: ['Друзьям'],
  },

  // =========================================================
  // МАЙ
  // =========================================================

  {
    id: 'family-day-international',
    date: '05-15',
    title: 'Международный день семей',
    description:
      'Повод провести время с близкими и напомнить им о своей любви.',
    category: 'family',
    categoryLabel: 'Семейные',
    icon: '❤️',
    calendar: 'secular',
    type: 'family',
    priority: 84,
    congratulatable: true,
    recipients: ['Родным'],
  },

  {
    id: 'museum-day',
    date: '05-18',
    title: 'Международный день музеев',
    description:
      'Хороший повод сходить в музей или открыть для себя новую коллекцию.',
    category: 'culture',
    categoryLabel: 'Культура',
    icon: '🏛️',
    calendar: 'secular',
    type: 'culture',
    priority: 68,
    congratulatable: true,
    recipients: ['Друзьям'],
  },

  {
    id: 'tea-day',
    date: '05-21',
    title: 'Международный день чая',
    description:
      'Идеальный повод устроить маленькое чаепитие.',
    category: 'fun',
    categoryLabel: 'Необычные',
    icon: '🍵',
    calendar: 'secular',
    type: 'fun',
    priority: 76,
    congratulatable: true,
    recipients: ['Родным', 'Друзьям'],
  },

  // =========================================================
  // ИЮНЬ
  // =========================================================

  {
    id: 'children-day',
    date: '06-01',
    title: 'День защиты детей',
    description:
      'День, посвящённый детям, их благополучию и правам.',
    category: 'family',
    categoryLabel: 'Семейные',
    icon: '🧸',
    calendar: 'secular',
    type: 'family',
    priority: 84,
    congratulatable: true,
    recipients: ['Родным'],
  },

  {
    id: 'environment-day',
    date: '06-05',
    title: 'Всемирный день окружающей среды',
    description:
      'Повод вспомнить о природе и о том, как мы можем заботиться о ней.',
    category: 'nature',
    categoryLabel: 'Природа',
    icon: '🌿',
    calendar: 'secular',
    type: 'nature',
    priority: 66,
    congratulatable: true,
    recipients: ['Друзьям'],
  },

  {
    id: 'russian-language-day',
    date: '06-06',
    title: 'День русского языка',
    description:
      'Праздник русского языка и день рождения Александра Пушкина.',
    category: 'culture',
    categoryLabel: 'Культура',
    icon: '✍️',
    calendar: 'secular',
    type: 'culture',
    priority: 82,
    congratulatable: true,
    recipients: ['Друзьям', 'Коллегам'],
  },

  {
    id: 'oceans-day',
    date: '06-08',
    title: 'Всемирный день океанов',
    description:
      'Повод вспомнить о морях, океанах и их обитателях.',
    category: 'nature',
    categoryLabel: 'Природа',
    icon: '🌊',
    calendar: 'secular',
    type: 'nature',
    priority: 65,
    congratulatable: true,
    recipients: ['Друзьям'],
  },

  // 🩺 ПРОФЕССИОНАЛЬНЫЙ

  {
    id: 'medical-worker-day',
    dateRule: {
      type: 'nthWeekday',
      month: 6,
      weekday: 0,
      occurrence: 3,
    },
    title: 'День медицинского работника',
    description:
      'Профессиональный праздник врачей, медицинских сестёр, фельдшеров и всех работников здравоохранения.',
    category: 'professional',
    categoryLabel: 'Профессиональные',
    icon: '🩺',
    calendar: 'secular',
    type: 'professional',
    priority: 98,
    congratulatable: true,
    recipients: ['Медикам', 'Коллегам', 'Друзьям'],
  },

  {
    id: 'youth-day',
    date: '06-27',
    title: 'День молодёжи',
    description:
      'Российский праздник молодых людей, энергии и новых идей.',
    category: 'social',
    categoryLabel: 'Общие',
    icon: '✨',
    calendar: 'secular',
    type: 'social',
    priority: 78,
    congratulatable: true,
    recipients: ['Друзьям'],
  },

  // =========================================================
  // ИЮЛЬ
  // =========================================================

  {
    id: 'family-love-fidelity',
    date: '07-08',
    title: 'День семьи, любви и верности',
    description:
      'Российский праздник, посвящённый семейным ценностям.',
    category: 'family',
    categoryLabel: 'Семейные',
    icon: '🌼',
    calendar: 'secular',
    type: 'family',
    priority: 94,
    congratulatable: true,
    recipients: ['Родным', 'Любимым'],
  },

  {
    id: 'chess-day',
    date: '07-20',
    title: 'Международный день шахмат',
    description:
      'Повод сыграть партию или бросить кому-нибудь интеллектуальный вызов.',
    category: 'hobby',
    categoryLabel: 'Хобби',
    icon: '♟️',
    calendar: 'secular',
    type: 'hobby',
    priority: 70,
    congratulatable: true,
    recipients: ['Друзьям'],
  },

  {
    id: 'friendship-day',
    date: '07-30',
    title: 'Международный день дружбы',
    description:
      'Прекрасный повод написать человеку, с которым давно не общались.',
    category: 'friendship',
    categoryLabel: 'Дружба',
    icon: '🫶',
    calendar: 'secular',
    type: 'friendship',
    priority: 88,
    congratulatable: true,
    recipients: ['Друзьям'],
  },

  // =========================================================
  // АВГУСТ
  // =========================================================

  // 🏗️ ПРОФЕССИОНАЛЬНЫЙ

  {
    id: 'builder-day',
    dateRule: {
      type: 'nthWeekday',
      month: 8,
      weekday: 0,
      occurrence: 2,
    },
    title: 'День строителя',
    description:
      'Профессиональный праздник работников строительной отрасли: строителей, инженеров, проектировщиков и всех, кто создаёт здания и инфраструктуру.',
    category: 'professional',
    categoryLabel: 'Профессиональные',
    icon: '🏗️',
    calendar: 'secular',
    type: 'professional',
    priority: 96,
    congratulatable: true,
    recipients: ['Строителям', 'Коллегам', 'Друзьям'],
  },

  {
    id: 'photography-day',
    date: '08-19',
    title: 'Всемирный день фотографии',
    description:
      'Повод пересмотреть любимые фотографии или сделать новый снимок.',
    category: 'creative',
    categoryLabel: 'Творчество',
    icon: '📷',
    calendar: 'secular',
    type: 'creative',
    priority: 74,
    congratulatable: true,
    recipients: ['Друзьям'],
  },

  {
    id: 'cinema-day',
    date: '08-27',
    title: 'День российского кино',
    description:
      'Повод выбрать фильм и устроить домашний киносеанс.',
    category: 'culture',
    categoryLabel: 'Культура',
    icon: '🎬',
    calendar: 'secular',
    type: 'culture',
    priority: 78,
    congratulatable: true,
    recipients: ['Друзьям', 'Коллегам'],
  },

  // =========================================================
  // СЕНТЯБРЬ
  // =========================================================

  {
    id: 'knowledge-day',
    date: '09-01',
    title: 'День знаний',
    description:
      'Первый день нового учебного года и повод пожелать успехов в учёбе.',
    category: 'education',
    categoryLabel: 'Образование',
    icon: '📚',
    calendar: 'secular',
    type: 'education',
    priority: 86,
    congratulatable: true,
    recipients: ['Родным', 'Друзьям', 'Коллегам'],
  },

  {
    id: 'literacy-day',
    date: '09-08',
    title: 'Международный день грамотности',
    description:
      'День, посвящённый грамотности и доступу к образованию.',
    category: 'education',
    categoryLabel: 'Образование',
    icon: '🔤',
    calendar: 'secular',
    type: 'education',
    priority: 64,
    congratulatable: false,
    recipients: [],
  },

  {
    id: 'programmer-day',
    dateRule: {
      type: 'dayOfYear',
      day: 256,
    },
    title: 'День программиста',
    description:
      'Профессиональный праздник разработчиков и всех, кто работает с кодом.',
    category: 'professional',
    categoryLabel: 'Профессиональные',
    icon: '💻',
    calendar: 'secular',
    type: 'professional',
    priority: 94,
    congratulatable: true,
    recipients: ['Коллегам', 'Друзьям'],
  },

  // 🌐 ПРОФЕССИОНАЛЬНЫЙ

  {
    id: 'translator-day',
    date: '09-30',
    title: 'Международный день переводчика',
    description:
      'Профессиональный праздник переводчиков и специалистов, которые помогают людям понимать друг друга на разных языках.',
    category: 'professional',
    categoryLabel: 'Профессиональные',
    icon: '🌐',
    calendar: 'secular',
    type: 'professional',
    priority: 92,
    congratulatable: true,
    recipients: ['Переводчикам', 'Коллегам', 'Друзьям'],
  },

  {
    id: 'peace-day',
    date: '09-21',
    title: 'Международный день мира',
    description:
      'День, посвящённый миру и ненасилию.',
    category: 'social',
    categoryLabel: 'Общие',
    icon: '🕊️',
    calendar: 'secular',
    type: 'social',
    priority: 72,
    congratulatable: false,
    recipients: [],
  },

  {
    id: 'tourism-day',
    date: '09-27',
    title: 'Всемирный день туризма',
    description:
      'Повод вспомнить любимые поездки или начать планировать новую.',
    category: 'travel',
    categoryLabel: 'Путешествия',
    icon: '🧳',
    calendar: 'secular',
    type: 'travel',
    priority: 76,
    congratulatable: true,
    recipients: ['Друзьям'],
  },

  // =========================================================
  // ОКТЯБРЬ
  // =========================================================

  {
    id: 'coffee-day',
    date: '10-01',
    title: 'Международный день кофе',
    description:
      'Самый уютный повод встретиться за чашкой кофе.',
    category: 'fun',
    categoryLabel: 'Необычные',
    icon: '☕',
    calendar: 'secular',
    type: 'fun',
    priority: 82,
    congratulatable: true,
    recipients: ['Друзьям', 'Коллегам'],
  },

  {
    id: 'older-persons-day',
    date: '10-01',
    title: 'Международный день пожилых людей',
    description:
      'Повод позвонить старшим родственникам и подарить им немного внимания.',
    category: 'family',
    categoryLabel: 'Семейные',
    icon: '🌷',
    calendar: 'secular',
    type: 'family',
    priority: 83,
    congratulatable: true,
    recipients: ['Родным'],
  },

  {
    id: 'animal-day',
    date: '10-04',
    title: 'Всемирный день животных',
    description:
      'Повод вспомнить о наших домашних любимцах и других животных.',
    category: 'nature',
    categoryLabel: 'Природа',
    icon: '🐾',
    calendar: 'secular',
    type: 'nature',
    priority: 80,
    congratulatable: true,
    recipients: ['Родным', 'Друзьям'],
  },

  {
    id: 'teacher-day',
    date: '10-05',
    title: 'День учителя',
    description:
      'Профессиональный праздник работников сферы образования.',
    category: 'professional',
    categoryLabel: 'Профессиональные',
    icon: '📚',
    calendar: 'secular',
    type: 'professional',
    priority: 100,
    congratulatable: true,
    recipients: ['Учителям', 'Коллегам'],
  },

  {
    id: 'smile-day',
    dateRule: {
      type: 'nthWeekday',
      month: 10,
      weekday: 5,
      occurrence: 1,
    },
    title: 'Всемирный день улыбки',
    description:
      'Первую пятницу октября можно посвятить хорошему настроению.',
    category: 'fun',
    categoryLabel: 'Необычные',
    icon: '😊',
    calendar: 'secular',
    type: 'fun',
    priority: 86,
    congratulatable: true,
    recipients: ['Родным', 'Друзьям'],
  },

  {
    id: 'food-day',
    date: '10-16',
    title: 'Всемирный день продовольствия',
    description:
      'День, посвящённый продовольствию, питанию и продовольственной безопасности.',
    category: 'social',
    categoryLabel: 'Общие',
    icon: '🍎',
    calendar: 'secular',
    type: 'social',
    priority: 60,
    congratulatable: false,
    recipients: [],
  },

  {
    id: 'lyceum-day',
    date: '10-19',
    title: 'Всероссийский день лицеиста',
    description:
      'Памятная дата, связанная с историей образования и Царскосельским лицеем.',
    category: 'education',
    categoryLabel: 'Образование',
    icon: '🎓',
    calendar: 'secular',
    type: 'education',
    priority: 68,
    congratulatable: true,
    recipients: ['Друзьям', 'Коллегам'],
  },

  {
    id: 'animation-day',
    date: '10-28',
    title: 'Международный день анимации',
    description:
      'Праздник художников, аниматоров и любителей мультфильмов.',
    category: 'creative',
    categoryLabel: 'Творчество',
    icon: '🎞️',
    calendar: 'secular',
    type: 'creative',
    priority: 72,
    congratulatable: true,
    recipients: ['Друзьям'],
  },

  {
    id: 'halloween',
    date: '10-31',
    title: 'Хэллоуин',
    description:
      'Популярный неформальный праздник с костюмами, украшениями и немного страшным настроением.',
    category: 'fun',
    categoryLabel: 'Необычные',
    icon: '🎃',
    calendar: 'secular',
    type: 'fun',
    priority: 86,
    congratulatable: true,
    recipients: ['Друзьям'],
  },

  // =========================================================
  // НОЯБРЬ
  // =========================================================

  {
    id: 'kindness-day',
    date: '11-13',
    title: 'Всемирный день доброты',
    description:
      'Простой повод сделать что-нибудь хорошее для другого человека.',
    category: 'kindness',
    categoryLabel: 'Добрые поводы',
    icon: '💛',
    calendar: 'secular',
    type: 'kindness',
    priority: 86,
    congratulatable: true,
    recipients: ['Родным', 'Друзьям'],
  },

  {
    id: 'tolerance-day',
    date: '11-16',
    title: 'Международный день толерантности',
    description:
      'День уважения к многообразию людей и культур.',
    category: 'social',
    categoryLabel: 'Общие',
    icon: '🌍',
    calendar: 'secular',
    type: 'social',
    priority: 60,
    congratulatable: false,
    recipients: [],
  },

  {
    id: 'childrens-day-universal',
    date: '11-20',
    title: 'Всемирный день ребёнка',
    description:
      'День, посвящённый благополучию и правам детей.',
    category: 'family',
    categoryLabel: 'Семейные',
    icon: '🧸',
    calendar: 'secular',
    type: 'family',
    priority: 76,
    congratulatable: true,
    recipients: ['Родным'],
  },

  // 📊 ПРОФЕССИОНАЛЬНЫЙ

  {
    id: 'accountant-day',
    date: '11-21',
    title: 'День бухгалтера',
    description:
      'Профессиональный праздник бухгалтеров и специалистов, работающих с финансовым учётом.',
    category: 'professional',
    categoryLabel: 'Профессиональные',
    icon: '📊',
    calendar: 'secular',
    type: 'professional',
    priority: 96,
    congratulatable: true,
    recipients: ['Бухгалтерам', 'Коллегам', 'Друзьям'],
  },

  {
    id: 'mothers-day',
    dateRule: {
      type: 'lastWeekday',
      month: 11,
      weekday: 0,
    },
    title: 'День матери',
    description:
      'Российский праздник, который отмечается в последнее воскресенье ноября.',
    category: 'family',
    categoryLabel: 'Семейные',
    icon: '💐',
    calendar: 'secular',
    type: 'family',
    priority: 100,
    congratulatable: true,
    recipients: ['Мамам'],
  },

  {
    id: 'computer-security-day',
    date: '11-30',
    title: 'День компьютерной безопасности',
    description:
      'Повод вспомнить о паролях, резервных копиях и цифровой безопасности.',
    category: 'technology',
    categoryLabel: 'Технологии',
    icon: '🔐',
    calendar: 'secular',
    type: 'technology',
    priority: 68,
    congratulatable: true,
    recipients: ['Друзьям', 'Коллегам'],
  },

  // =========================================================
  // ДЕКАБРЬ
  // =========================================================

  {
    id: 'volunteer-day',
    date: '12-05',
    title: 'Международный день добровольцев',
    description:
      'День людей, которые помогают другим и делают что-то хорошее просто потому, что могут.',
    category: 'kindness',
    categoryLabel: 'Добрые поводы',
    icon: '🤝',
    calendar: 'secular',
    type: 'kindness',
    priority: 70,
    congratulatable: true,
    recipients: ['Друзьям', 'Коллегам'],
  },

  {
    id: 'constitution-day',
    date: '12-12',
    title: 'День Конституции России',
    description:
      'Памятная дата, посвящённая Конституции Российской Федерации.',
    category: 'state',
    categoryLabel: 'Государственные',
    icon: '📜',
    calendar: 'secular',
    type: 'official',
    priority: 78,
    congratulatable: true,
    recipients: ['Родным', 'Друзьям', 'Коллегам'],
  },

  {
    id: 'human-rights-day',
    date: '12-10',
    title: 'День прав человека',
    description:
      'Международный день, посвящённый правам и свободам человека.',
    category: 'social',
    categoryLabel: 'Общие',
    icon: '🕊️',
    calendar: 'secular',
    type: 'social',
    priority: 64,
    congratulatable: false,
    recipients: [],
  },

  // ⚡ ПРОФЕССИОНАЛЬНЫЙ

  {
    id: 'energy-day',
    dateRule: {
      type: 'nthWeekday',
      month: 12,
      weekday: 0,
      occurrence: 3,
    },
    title: 'День энергетика',
    description:
      'Профессиональный праздник работников энергетической отрасли.',
    category: 'professional',
    categoryLabel: 'Профессиональные',
    icon: '⚡',
    calendar: 'secular',
    type: 'professional',
    priority: 92,
    congratulatable: true,
    recipients: ['Энергетикам', 'Коллегам', 'Друзьям'],
  },

  {
    id: 'new-years-eve',
    date: '12-31',
    title: 'Канун Нового года',
    description:
      'День последних приготовлений, подарков и ожидания полуночи.',
    category: 'tradition',
    categoryLabel: 'Традиции',
    icon: '✨',
    calendar: 'secular',
    type: 'tradition',
    priority: 98,
    congratulatable: true,
    recipients: ['Родным', 'Друзьям', 'Коллегам'],
  },
]

export default occasions
