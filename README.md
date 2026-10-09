# 🎉 ЕСТЬ ПОВОД | EST POVOD

<p align="center">
  <strong>Календарь праздников и личных событий с генератором поздравительных открыток</strong>
  <br />
  A holiday and personal occasion calendar with a greeting card generator
</p>

<p align="center">
  <a href="https://est-povod-nnm.pages.dev/">
    <img src="https://img.shields.io/badge/Live%20Website-Visit%20App-2563eb?style=for-the-badge" alt="Live Website" />
  </a>
  <a href="https://github.com/Anastasiia-A-Petrova/est-povod">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
  <a href="https://est-povod-api.onrender.com/api/health">
    <img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Backend on Render" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/JavaScript-ES_Modules-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Status-Live-success" alt="Project Status" />
</p>

<p align="center">
  🇬🇧 <a href="#english">English</a> · 🇷🇺 <a href="#russian">Русский</a>
</p>

---

<a id="english"></a>

# 🇬🇧 English

## About the project

**EST POVOD** is a web application designed to help people remember holidays, meaningful dates, family birthdays and anniversaries, and create greeting cards for special occasions.

The application brings together a calendar of occasions, Orthodox calendar information, personal events and a search for ready-made greeting cards.

The project is built with React and Vite, with a separate Node.js backend deployed on Render.

**Live application:** https://est-povod-nnm.pages.dev/

## Features

* 📅 Calendar interface for browsing dates and occasions.
* 🎉 Public holidays and other calendar events.
* ☦️ Orthodox calendar information retrieved through a custom backend.
* 🎂 Personal occasions, including birthdays and anniversaries.
* 🗓️ Personal calendar events stored in the browser.
* 💌 Search for ready-made greeting cards.
* 🎨 Greeting card creation using templates and font choices.
* 🖼️ Exporting greeting card designs as images.
* 🔎 Holiday information and image discovery through external sources.
* 📱 Responsive interface for desktop and mobile browsers.

## Tech stack

### Frontend

| Technology              | Purpose                                                |
| ----------------------- | ------------------------------------------------------ |
| React                   | Component-based user interface                         |
| React DOM               | Rendering React in the browser                         |
| Vite                    | Development server and production build                |
| JavaScript (ES Modules) | Application logic                                      |
| HTML and CSS            | Page structure, styling and responsive layout          |
| html-to-image           | Exporting DOM elements as images                       |
| localStorage            | Browser-side storage for personal data and preferences |

### Backend

| Technology                  | Purpose                                                     |
| --------------------------- | ----------------------------------------------------------- |
| Node.js                     | Backend runtime                                             |
| Native Node.js HTTP server  | Handling API requests                                       |
| Native `fetch`              | Requesting external APIs and websites                       |
| dotenv                      | Loading environment variables from `.env`                   |
| Azbyka API                  | Orthodox calendar data                                      |
| HTML parsing and extraction | Collecting ready-card search results from external websites |

### Development tools

| Tool             | Purpose                          |
| ---------------- | -------------------------------- |
| Git              | Version control                  |
| GitHub           | Source code repository           |
| Oxlint           | Code linting                     |
| npm              | Dependency and script management |
| Cloudflare Pages | Frontend hosting and deployment  |
| Render           | Backend hosting and deployment   |

## Architecture

The application is divided into a frontend and a backend.

```text
                         USERS
                           |
                           v
                 CLOUDFLARE PAGES
                 React + Vite frontend
                           |
             +-------------+-------------+
             |                           |
             v                           v
       Calendar APIs              Render backend
                                         |
                               +---------+---------+
                               |                   |
                               v                   v
                         Azbyka API        Ready-card search
                                           +------+------+ 
                                           |      |      |
                                           v      v      v
                                       Yandex  Otkritki  Other
                                       Images  Online   Sources
```

### Frontend — Cloudflare Pages

**URL:** https://est-povod-nnm.pages.dev/

The frontend is responsible for:

* Rendering the calendar and user interface.
* Loading public holiday data.
* Displaying Orthodox calendar information.
* Managing personal dates in the browser.
* Providing the greeting card creation interface.
* Sending requests to the backend when necessary.

The frontend is built with React and Vite.

### Backend — Render

**Service:** `est-povod-api`

**Base URL:** https://est-povod-api.onrender.com

The backend is responsible for:

* Providing a health-check endpoint.
* Retrieving Orthodox calendar data from Azbyka.
* Searching external websites for ready-made greeting cards.
* Returning search results to the frontend.
* Keeping Azbyka credentials on the server rather than in frontend code.

Frontend and backend are deployed separately.

### Source code — GitHub

**Repository:** https://github.com/Anastasiia-A-Petrova/est-povod

GitHub stores the source code and commit history. Changes pushed to the connected repository can trigger a new Cloudflare Pages deployment.

Backend changes must also be deployed to Render.

## External APIs and data sources

| Service                                                     | How it is used                                                                                  |
| ----------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| [Nager.Date](https://date.nager.at/)                        | Public holiday data, requested for Russia using the `/api/v3/PublicHolidays/{year}/RU` endpoint |
| [Kuzyak Calendar API](https://calendar.kuzyak.in/)          | Additional calendar data, requested from `/api/calendar/{year}/holidays`                        |
| [Azbyka — Orthodox Calendar](https://azbyka.ru/days)        | Orthodox calendar information retrieved through the custom backend                              |
| [Russian Wikipedia API](https://ru.wikipedia.org/w/api.php) | Searching for holiday information and relevant images                                           |
| [Yandex Images](https://yandex.ru/images/)                  | External image search for ready-made greeting cards                                             |
| [OtkritkiOnline](https://otkritkionline.ru/)                | Source website for ready-made greeting cards                                                    |
| Livecard                                                    | Additional source used by the ready-card search implementation                                  |

**Important:** these sources do not all provide official APIs. The ready-card search implementation retrieves and extracts information from external websites. Changes to their HTML structure, access restrictions or anti-bot protection may affect search results.

Availability and response formats of third-party services are outside the project's control.

## Backend API

Base URL:

`https://est-povod-api.onrender.com`

### 1. Health check

```http
GET /api/health
```

Checks whether the backend is running.

Example:

`https://est-povod-api.onrender.com/api/health`

Expected response:

```json
{
  "ok": true,
  "service": "azbyka"
}
```

### 2. Orthodox calendar

```http
GET /api/orthodox?date=YYYY-MM-DD
```

Returns Orthodox calendar information for a specific date.

Example:

`https://est-povod-api.onrender.com/api/orthodox?date=2026-10-09`

The date must use the `YYYY-MM-DD` format.

### 3. Ready greeting cards

```http
POST /api/ready-cards
Content-Type: application/json
```

Request body:

```json
{
  "title": "День рождения"
}
```

The `title` field contains the occasion or holiday for which cards should be searched.

The endpoint returns the results produced by the backend search implementation.

An empty title is rejected with HTTP `400`. Errors during the search may produce HTTP `500`.

## Environment variables and security

The backend uses the following environment variables:

| Variable          | Purpose                                                           |
| ----------------- | ----------------------------------------------------------------- |
| `AZBYKA_EMAIL`    | Email for Azbyka API authentication                               |
| `AZBYKA_PASSWORD` | Password for Azbyka API authentication                            |
| `PORT`            | Port assigned by the hosting platform; defaults to `3001` locally |

### Local configuration

Create a `.env` file in the project root:

```env
AZBYKA_EMAIL=your_email
AZBYKA_PASSWORD=your_password
```

Use your own credentials. Never commit the real `.env` file to GitHub.

### Production configuration

Configure `AZBYKA_EMAIL` and `AZBYKA_PASSWORD` in the Render service's Environment settings.

The backend uses `process.env.PORT` when provided by the hosting platform.

**Security rules:**

* Never publish passwords, API credentials or access tokens.
* Never place backend secrets in frontend JavaScript.
* Keep `.env` excluded from version control.
* If a secret is accidentally published, revoke or rotate it.

## Getting started

### Requirements

* Node.js
* npm
* Git
* An internet connection for external APIs

### 1. Clone the repository

```bash
git clone https://github.com/Anastasiia-A-Petrova/est-povod.git
cd est-povod
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root with your Azbyka credentials.

```env
AZBYKA_EMAIL=your_email
AZBYKA_PASSWORD=your_password
```

Do not share or commit this file.

### 4. Start the frontend

```bash
npm run dev
```

Vite will display the local development URL, usually:

`http://localhost:5173`

### 5. Start the backend

Open a second terminal in the project directory:

```bash
npm start
```

The backend normally starts at:

`http://localhost:3001`

Verify that it is running:

`http://localhost:3001/api/health`

**Note:** the frontend currently points to the deployed Render backend. Local backend testing may require changing the frontend API configuration to use `http://localhost:3001`.

## Available npm scripts

| Command           | Purpose                              |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite development server    |
| `npm run build`   | Build the production frontend        |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run Oxlint                           |
| `npm start`       | Start the Node.js backend            |

## Build and test

Build the frontend:

```bash
npm run build
```

Run the linter:

```bash
npm run lint
```

Preview the production build:

```bash
npm run preview
```

Check the deployed backend:

```text
https://est-povod-api.onrender.com/api/health
```

After deploying changes, test both the live website and the backend endpoints.

## Deployment workflow

### Frontend

1. Make changes to the React application.
2. Run `npm run build`.
3. Commit and push the changes to GitHub.
4. Cloudflare Pages builds and deploys the connected repository.
5. Open the live website and verify the changes.

### Backend

1. Make changes to the server code.
2. Test the backend locally.
3. Commit and push the changes to GitHub.
4. Render deploys the updated server according to its deployment configuration.
5. Check `/api/health` and test the affected endpoint.

### Hosting considerations

The backend is hosted on Render. If the service is on a free plan, it may spin down after inactivity and take longer to respond to the first request.

External APIs and websites may also be temporarily unavailable or rate-limited.

## Personal data and storage

Personal dates and browser preferences are stored using `localStorage`.

This means:

* Data belongs to the browser and origin where it was saved.
* Data is not automatically synchronized across devices.
* Clearing browser storage may remove locally saved data.
* Browser storage is not a substitute for a server-side database or backup.

## Current limitations

* Ready-card search depends on external websites and their page structures.
* Calendar data depends on third-party API availability.
* Personal dates are stored locally in the browser.
* The frontend and backend require separate deployment workflows.
* The application does not currently provide automatic cross-device synchronization of personal dates.

## Future improvements

Potential directions for development:

* Expand the holiday and occasion database.
* Improve search reliability and source fallback handling.
* Add more card templates and customization options.
* Improve mobile usability and accessibility.
* Introduce optional data export and backup.
* Consider server-side storage and synchronization for personal calendars.
* Add monitoring and more detailed backend error reporting.

## License

No license has been specified yet. Unless a license is added, the repository should not be assumed to grant permission to reuse, modify or redistribute its code.

---

<a id="russian"></a>

# 🇷🇺 Русский

## О проекте

**ЕСТЬ ПОВОД** — веб-приложение, которое помогает помнить о праздниках, памятных датах, днях рождениях близких и годовщинах, а также создавать поздравительные открытки.

Приложение объединяет календарь поводов, данные православного календаря, личные события и поиск готовых открыток.

Проект создан на React и Vite. Для обработки запросов к православному календарю и поиска открыток используется отдельный backend на Node.js.

**Работающий сайт:** https://est-povod-nnm.pages.dev/

## Возможности

* 📅 Календарь праздников и поводов.
* 🎉 Государственные и другие календарные события.
* ☦️ Православный календарь через собственный backend.
* 🎂 Личные поводы: дни рождения, годовщины и другие даты.
* 🗓️ Сохранение личных событий в браузере.
* 💌 Поиск готовых поздравительных открыток.
* 🎨 Создание открыток с шаблонами и выбором шрифтов.
* 🖼️ Экспорт открыток в виде изображений.
* 🔎 Поиск информации и изображений праздников через внешние источники.
* 📱 Адаптация интерфейса для компьютеров и мобильных устройств.

## Технологический стек

### Frontend

| Технология              | Назначение                                   |
| ----------------------- | -------------------------------------------- |
| React                   | Компонентный пользовательский интерфейс      |
| React DOM               | Отображение React в браузере                 |
| Vite                    | Локальная разработка и production-сборка     |
| JavaScript (ES Modules) | Логика приложения                            |
| HTML и CSS              | Структура страниц, оформление и адаптивность |
| html-to-image           | Экспорт элементов интерфейса в изображения   |
| localStorage            | Хранение личных данных и настроек в браузере |

### Backend

| Технология                     | Назначение                                                 |
| ------------------------------ | ---------------------------------------------------------- |
| Node.js                        | Среда выполнения сервера                                   |
| Встроенный HTTP-сервер Node.js | Обработка API-запросов                                     |
| Встроенный `fetch`             | Запросы к внешним API и сайтам                             |
| dotenv                         | Загрузка переменных окружения из `.env`                    |
| Azbyka API                     | Получение данных православного календаря                   |
| Извлечение данных из HTML      | Сбор результатов поиска готовых открыток на внешних сайтах |

### Инструменты разработки и публикации

| Инструмент       | Назначение                             |
| ---------------- | -------------------------------------- |
| Git              | Контроль версий                        |
| GitHub           | Хранение исходного кода                |
| Oxlint           | Проверка кода                          |
| npm              | Установка зависимостей и запуск команд |
| Cloudflare Pages | Хостинг и публикация frontend          |
| Render           | Хостинг и публикация backend           |

## Архитектура

Приложение состоит из frontend и backend.

```text
                       ПОЛЬЗОВАТЕЛИ
                            |
                            v
                  CLOUDFLARE PAGES
                   React + Vite
                            |
               +------------+------------+
               |                         |
               v                         v
        Календарные API            Render backend
                                         |
                               +---------+---------+
                               |                   |
                               v                   v
                         Azbyka API        Поиск открыток
                                           +------+------+ 
                                           |      |      |
                                           v      v      v
                                         Яндекс  Otkritki Другие
                                         Картинки Online  источники
```

### Frontend — Cloudflare Pages

**Адрес:** https://est-povod-nnm.pages.dev/

Frontend отвечает за:

* отображение календаря и интерфейса;
* загрузку государственных праздников;
* отображение православных событий;
* работу с личными датами в браузере;
* интерфейс создания открыток;
* отправку запросов к backend.

Frontend построен на React и Vite.

### Backend — Render

**Название сервиса:** `est-povod-api`

**Адрес:** https://est-povod-api.onrender.com

Backend написан на Node.js и отвечает за:

* проверку работоспособности сервера;
* получение данных православного календаря из Azbyka;
* поиск готовых открыток на внешних сайтах;
* передачу результатов поиска frontend;
* хранение учётных данных Azbyka вне клиентского кода.

Frontend и backend публикуются независимо друг от друга.

### Исходный код — GitHub

**Репозиторий:** https://github.com/Anastasiia-A-Petrova/est-povod

GitHub хранит исходный код и историю коммитов. Отправка изменений в подключённый репозиторий может запускать автоматическую публикацию frontend через Cloudflare Pages.

Изменения backend также должны быть развёрнуты на Render.

## Внешние API и источники данных

| Сервис                                                         | Как используется                                                          |
| -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| [Nager.Date](https://date.nager.at/)                           | Государственные праздники России через `/api/v3/PublicHolidays/{year}/RU` |
| [Kuzyak Calendar API](https://calendar.kuzyak.in/)             | Дополнительные календарные данные через `/api/calendar/{year}/holidays`   |
| [Азбука веры — православный календарь](https://azbyka.ru/days) | Данные православного календаря через собственный backend                  |
| [API русской Википедии](https://ru.wikipedia.org/w/api.php)    | Поиск информации о праздниках и связанных изображений                     |
| [Яндекс Картинки](https://yandex.ru/images/)                   | Дополнительный источник поиска готовых открыток                           |
| [OtkritkiOnline](https://otkritkionline.ru/)                   | Сайт с готовыми поздравительными открытками                               |
| Livecard                                                       | Дополнительный источник в реализации поиска открыток                      |

**Важно:** не все источники предоставляют официальные API. Реализация поиска готовых открыток извлекает информацию из HTML внешних сайтов. Если сайты изменят структуру страниц, ограничат доступ или включат защиту от автоматических запросов, результаты поиска могут измениться или перестать загружаться.

Доступность сторонних сервисов и формат их ответов не контролируются проектом.

## API собственного backend

Базовый адрес:

`https://est-povod-api.onrender.com`

### 1. Проверка сервера

```http
GET /api/health
```

Проверяет, работает ли backend.

Пример:

`https://est-povod-api.onrender.com/api/health`

Ожидаемый ответ:

```json
{
  "ok": true,
  "service": "azbyka"
}
```

### 2. Православный календарь

```http
GET /api/orthodox?date=YYYY-MM-DD
```

Возвращает информацию православного календаря для конкретной даты.

Пример:

`https://est-povod-api.onrender.com/api/orthodox?date=2026-10-09`

Дата передаётся в формате `YYYY-MM-DD`.

### 3. Поиск готовых открыток

```http
POST /api/ready-cards
Content-Type: application/json
```

Тело запроса:

```json
{
  "title": "День рождения"
}
```

Поле `title` содержит название праздника или повода, для которого нужно найти открытки.

Endpoint возвращает результаты, сформированные поисковым модулем backend.

Если название не указано, сервер возвращает HTTP `400`. При ошибке поиска может возвращаться HTTP `500`.

## Переменные окружения и безопасность

Backend использует следующие переменные окружения:

| Переменная        | Назначение                                                             |
| ----------------- | ---------------------------------------------------------------------- |
| `AZBYKA_EMAIL`    | Email для авторизации в Azbyka API                                     |
| `AZBYKA_PASSWORD` | Пароль для авторизации в Azbyka API                                    |
| `PORT`            | Порт, назначаемый хостингом; локально по умолчанию используется `3001` |

### Локальная настройка

Создай файл `.env` в корневой папке проекта:

```env
AZBYKA_EMAIL=your_email
AZBYKA_PASSWORD=your_password
```

Укажи собственные данные. Не отправляй настоящий `.env` в GitHub.

### Настройка на Render

Переменные `AZBYKA_EMAIL` и `AZBYKA_PASSWORD` задаются в разделе Environment настроек Render-сервиса.

Если хостинг передаёт переменную `PORT`, сервер использует её.

**Правила безопасности:**

* Не публикуй пароли, токены и секретные ключи.
* Не помещай серверные секреты в JavaScript frontend.
* Не добавляй `.env` в систему контроля версий.
* Если секрет случайно попал в публичный репозиторий, отзови или замени его.

## Как запустить проект локально

### Требования

* Node.js;
* npm;
* Git;
* доступ к интернету для внешних API.

### 1. Клонирование репозитория

```bash
git clone https://github.com/Anastasiia-A-Petrova/est-povod.git
cd est-povod
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка переменных окружения

Создай `.env` в корневой папке проекта и добавь свои данные Azbyka:

```env
AZBYKA_EMAIL=your_email
AZBYKA_PASSWORD=your_password
```

Не публикуй и не передавай этот файл.

### 4. Запуск frontend

```bash
npm run dev
```

Vite выведет локальный адрес. Обычно это:

`http://localhost:5173`

### 5. Запуск backend

Открой второе окно терминала в папке проекта:

```bash
npm start
```

По умолчанию локальный сервер работает на:

`http://localhost:3001`

Проверь его работу:

`http://localhost:3001/api/health`

**Примечание:** сейчас frontend обращается к опубликованному backend на Render. Для тестирования полностью локальной связки потребуется изменить адреса API в frontend на `http://localhost:3001`.

## Команды npm

| Команда           | Назначение                            |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Запустить локальный frontend          |
| `npm run build`   | Собрать production-версию frontend    |
| `npm run preview` | Посмотреть production-сборку локально |
| `npm run lint`    | Запустить Oxlint                      |
| `npm start`       | Запустить Node.js backend             |

## Сборка и проверка

Сборка frontend:

```bash
npm run build
```

Проверка кода:

```bash
npm run lint
```

Просмотр production-сборки:

```bash
npm run preview
```

Проверка опубликованного backend:

```text
https://est-povod-api.onrender.com/api/health
```

После публикации изменений нужно проверить работу сайта и затронутых API-endpoints.

## Процесс публикации

### Frontend

1. Внести изменения в React-приложение.
2. Выполнить `npm run build`.
3. Создать коммит и отправить изменения в GitHub.
4. Cloudflare Pages соберёт и опубликует подключённый репозиторий.
5. Открыть сайт и проверить изменения.

### Backend

1. Изменить серверный код.
2. Проверить backend локально.
3. Создать коммит и отправить изменения в GitHub.
4. Render развернёт обновлённый сервер согласно настройкам деплоя.
5. Проверить `/api/health` и изменённые endpoints.

### Особенности хостинга

Если Render используется на бесплатном тарифе, сервер может засыпать после периода бездействия. Поэтому первый запрос после паузы иногда выполняется медленнее.

Внешние API и сайты также могут быть временно недоступны или ограничивать частоту запросов.

## Хранение личных данных

Личные даты и настройки сохраняются с помощью `localStorage`.

Это означает, что:

* данные принадлежат конкретному браузеру и адресу сайта;
* они автоматически не синхронизируются между устройствами;
* очистка данных браузера может удалить сохранённые события;
* `localStorage` не заменяет серверную базу данных или резервное копирование.

## Текущие ограничения

* Поиск готовых открыток зависит от внешних сайтов и их HTML-разметки.
* Календарные данные зависят от доступности сторонних API.
* Личные даты хранятся локально в браузере.
* Frontend и backend развёртываются отдельно.
* Автоматическая синхронизация личных дат между устройствами не реализована.

## Возможные направления развития

* Расширение базы праздников и памятных дат.
* Повышение надёжности поиска открыток и добавление резервных источников.
* Новые шаблоны и настройки дизайна открыток.
* Улучшение мобильного интерфейса и доступности.
* Экспорт и резервное копирование личных событий.
* Серверное хранение и синхронизация календаря.
* Мониторинг и более подробная обработка ошибок backend.

---

<p align="center">
  Made with ❤️ for the occasions worth remembering.
  <br />
  Создано ❤️ для поводов, которые не хочется забыть.
</p>

