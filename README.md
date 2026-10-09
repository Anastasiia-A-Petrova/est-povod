# ЕСТЬ ПОВОД | EST POVOD

**A calendar of occasions and a greeting card generator.**
**Календарь поводов и генератор поздравительных открыток.**

🌐 **Live website:** https://est-povod-nnm.pages.dev/

🇬🇧 [English](#english) | 🇷🇺 [Русский](#русский)

---

<a id="english"></a>

## 🇬🇧 English

### About the project

**EST POVOD** is a web application that helps people remember meaningful dates and create greeting cards for holidays and personal occasions.

The project combines an occasion calendar, Orthodox calendar data, personal dates, and a search for ready-made greeting cards.

### Features

* 📅 Calendar of holidays and occasions.
* ☦️ Orthodox calendar data retrieved through a custom backend.
* 🎉 Search for ready-made greeting cards.
* 🎨 Greeting card creation with customizable templates and fonts.
* 👨‍👩‍👧 Personal occasions such as birthdays and anniversaries.
* 💾 Browser-based storage for personal dates and settings.
* 📱 Responsive interface designed for mobile and desktop.
* 🌍 Russian-language interface.

### Tech stack

| Technology / service            | Purpose                                        |
| ------------------------------- | ---------------------------------------------- |
| React                           | User interface                                 |
| Vite                            | Development server and production build        |
| JavaScript, HTML, CSS           | Application logic, structure and styling       |
| html-to-image                   | Exporting card designs as images               |
| Node.js                         | Backend runtime                                |
| Git and GitHub                  | Version control and source code hosting        |
| Cloudflare Pages                | Frontend hosting and deployment                |
| Render                          | Backend hosting                                |
| Nager.Date API                  | Public holiday data                            |
| Azbyka API                      | Orthodox calendar data                         |
| External greeting card websites | Sources for ready-made card search             |
| localStorage                    | Storing personal dates and browser preferences |

### Architecture

The application consists of two main parts.

**1. Frontend — Cloudflare Pages**

Live URL: https://est-povod-nnm.pages.dev/

The frontend renders the calendar and card creation interface. It communicates with the backend when Orthodox calendar information or ready-made card search is needed.

**2. Backend — Render**

Service: `est-povod-api`

Base URL: https://est-povod-api.onrender.com

The Node.js backend provides API endpoints and handles requests for Orthodox calendar information and ready-made greeting cards.

### Backend API endpoints

| Method | Endpoint                        | Purpose                                           |
| ------ | ------------------------------- | ------------------------------------------------- |
| GET    | `/api/health`                   | Check whether the backend is running              |
| GET    | `/api/orthodox?date=YYYY-MM-DD` | Retrieve Orthodox calendar information for a date |
| POST   | `/api/ready-cards`              | Search for ready-made greeting cards              |

Example health check:

`https://est-povod-api.onrender.com/api/health`

Expected response:

```json
{
  "ok": true,
  "service": "azbyka"
}
```

The ready-card endpoint accepts a JSON request containing a title:

```json
{
  "title": "День рождения"
}
```

### External services and APIs

**Cloudflare Pages**

* Hosts the public frontend.
* Builds and deploys the website from the connected GitHub repository.

**Render**

* Hosts the Node.js backend.
* Provides the public API URL.
* Stores backend environment variables.

**Nager.Date**

* Provides public holiday data.
* Used for the Russian holiday calendar.

**Azbyka**

* Provides Orthodox calendar data through the backend.
* Backend credentials are configured through environment variables.

**Ready-made greeting card sources**

* The backend searches external websites for existing greeting cards.
* Search results depend on the availability and structure of the source websites.

**localStorage**

* Stores personal calendar dates and browser-side preferences.
* Data stored in localStorage belongs to the current browser and is not automatically synchronized between devices.

### Environment variables

The backend uses the following environment variables:

| Variable          | Purpose                                                                         |
| ----------------- | ------------------------------------------------------------------------------- |
| `AZBYKA_EMAIL`    | Account email used for Azbyka API access                                        |
| `AZBYKA_PASSWORD` | Account password used for Azbyka API access                                     |
| `PORT`            | Port assigned by the hosting platform; the backend falls back to `3001` locally |

**Security:** Never commit `.env` files, passwords, API credentials, or other secrets to GitHub. Configure production secrets in Render's Environment settings.

### Run locally

**Requirements:** Node.js and npm.

1. Clone the repository:

```bash
git clone https://github.com/Anastasiia-A-Petrova/est-povod.git
cd est-povod
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root and configure the required Azbyka credentials:

```env
AZBYKA_EMAIL=your_email
AZBYKA_PASSWORD=your_password
```

Use your own credentials locally. Do not publish this file.

4. Start the frontend development server:

```bash
npm run dev
```

Vite will display the local URL, usually `http://localhost:5173`.

5. Start the backend in a separate terminal:

```bash
npm start
```

The backend runs on `http://localhost:3001` when no custom `PORT` is set.

6. Check the backend:

`http://localhost:3001/api/health`

The frontend currently uses the deployed backend URL. If you want to test the backend locally, configure the frontend API URLs for your local environment.

### Build and quality checks

Build the production frontend:

```bash
npm run build
```

Run the linter:

```bash
npm run lint
```

Preview the production build locally:

```bash
npm run preview
```

### Deployment workflow

1. Make changes to the source code.
2. Build and test the application locally.
3. Commit and push changes to GitHub.
4. Cloudflare Pages deploys the frontend from the connected repository.
5. Deploy backend changes to Render when the server code changes.
6. Test the deployed website and API endpoints.

### Project goals

* Make important dates easier to remember.
* Bring holidays and personal occasions together in one calendar.
* Make greeting card creation simple and accessible.
* Expand the calendar and greeting card sources over time.

---

<a id="русский"></a>

## 🇷🇺 Русский

### О проекте

**ЕСТЬ ПОВОД** — веб-приложение, которое помогает не забывать важные даты и создавать поздравительные открытки к праздникам и личным событиям.

Проект объединяет календарь поводов, православный календарь, личные даты и поиск готовых открыток.

### Возможности

* 📅 Календарь праздников и памятных дат.
* ☦️ Православный календарь, данные которого загружаются через собственный backend.
* 🎉 Поиск готовых поздравительных открыток.
* 🎨 Создание открыток с шаблонами и выбором шрифтов.
* 👨‍👩‍👧 Личные поводы: дни рождения, годовщины и другие даты.
* 💾 Сохранение личных дат и настроек в браузере.
* 📱 Адаптация интерфейса под мобильные устройства и компьютеры.
* 🌍 Русскоязычный интерфейс.

### Технологический стек

| Технология / сервис    | Для чего используется                     |
| ---------------------- | ----------------------------------------- |
| React                  | Пользовательский интерфейс                |
| Vite                   | Локальная разработка и production-сборка  |
| JavaScript, HTML, CSS  | Логика, структура и оформление приложения |
| html-to-image          | Экспорт дизайна открытки в изображение    |
| Node.js                | Среда выполнения backend                  |
| Git и GitHub           | Хранение исходного кода и контроль версий |
| Cloudflare Pages       | Хостинг и публикация frontend             |
| Render                 | Хостинг backend                           |
| Nager.Date API         | Данные о государственных праздниках       |
| Azbyka API             | Данные православного календаря            |
| Внешние сайты открыток | Источники для поиска готовых открыток     |
| localStorage           | Хранение личных дат и настроек в браузере |

### Архитектура проекта

Приложение состоит из двух основных частей.

**1. Frontend — Cloudflare Pages**

Адрес сайта: https://est-povod-nnm.pages.dev/

Frontend отображает календарь и интерфейс создания открыток. Когда нужны данные православного календаря или поиск готовых открыток, он обращается к backend.

**2. Backend — Render**

Название сервиса: `est-povod-api`

Адрес API: https://est-povod-api.onrender.com

Backend написан на Node.js. Он обрабатывает запросы к православному календарю и поиску готовых открыток.

### API-адреса backend

| Метод | Endpoint                        | Назначение                                                     |
| ----- | ------------------------------- | -------------------------------------------------------------- |
| GET   | `/api/health`                   | Проверка работоспособности сервера                             |
| GET   | `/api/orthodox?date=YYYY-MM-DD` | Получение информации православного календаря на выбранную дату |
| POST  | `/api/ready-cards`              | Поиск готовых поздравительных открыток                         |

Проверка сервера:

`https://est-povod-api.onrender.com/api/health`

Ожидаемый ответ:

```json
{
  "ok": true,
  "service": "azbyka"
}
```

Для поиска открыток передаётся JSON с названием повода:

```json
{
  "title": "День рождения"
}
```

### Какие внешние сервисы используются

**Cloudflare Pages**

* Хранит опубликованную версию frontend.
* Собирает и публикует сайт из подключённого GitHub-репозитория.

**Render**

* Запускает Node.js backend в интернете.
* Предоставляет публичный адрес API.
* Хранит переменные окружения backend.

**Nager.Date**

* Предоставляет данные о государственных праздниках.
* Используется для календаря праздников России.

**Azbyka**

* Источник данных православного календаря.
* Доступ к API настраивается через переменные окружения backend.

**Внешние сайты с готовыми открытками**

* Backend ищет существующие открытки на внешних сайтах.
* Результаты зависят от доступности сайтов и изменений в их HTML-разметке.

**localStorage**

* Сохраняет личные даты и настройки на стороне браузера.
* Данные хранятся локально в конкретном браузере и автоматически не синхронизируются между устройствами.

### Переменные окружения

Backend использует следующие переменные:

| Переменная        | Назначение                                                             |
| ----------------- | ---------------------------------------------------------------------- |
| `AZBYKA_EMAIL`    | Email аккаунта для доступа к Azbyka API                                |
| `AZBYKA_PASSWORD` | Пароль аккаунта для доступа к Azbyka API                               |
| `PORT`            | Порт, назначаемый хостингом; локально по умолчанию используется `3001` |

**Безопасность:** никогда не загружай `.env`, пароли и секретные ключи в GitHub. На Render секреты задаются в разделе Environment.

### Как запустить проект локально

**Требования:** установленный Node.js и npm.

1. Склонировать репозиторий:

```bash
git clone https://github.com/Anastasiia-A-Petrova/est-povod.git
cd est-povod
```

2. Установить зависимости:

```bash
npm install
```

3. Создать файл `.env` в корневой папке проекта и указать свои данные Azbyka:

```env
AZBYKA_EMAIL=your_email
AZBYKA_PASSWORD=your_password
```

Используй собственные данные. Не публикуй этот файл.

4. Запустить frontend:

```bash
npm run dev
```

Vite покажет локальный адрес, обычно `http://localhost:5173`.

5. Открыть второе окно CMD и запустить backend:

```bash
npm start
```

Локально сервер работает на `http://localhost:3001`, если переменная `PORT` не задана.

6. Проверить backend:

`http://localhost:3001/api/health`

Сейчас frontend использует опубликованный адрес backend. Для локального тестирования сервера необходимо настроить адреса API в frontend под локальное окружение.

### Сборка и проверки

Собрать production-версию frontend:

```bash
npm run build
```

Запустить линтер:

```bash
npm run lint
```

Посмотреть production-сборку локально:

```bash
npm run preview
```

### Как публикуются изменения

1. Внести изменения в исходный код.
2. Собрать и проверить приложение локально.
3. Создать коммит и отправить изменения на GitHub.
4. Cloudflare Pages автоматически публикует frontend из подключённого репозитория.
5. При изменениях backend развернуть новую версию на Render.
6. Проверить сайт и API после публикации.

### Цели проекта

* Помогать помнить о важных датах.
* Объединить праздники и личные события в одном календаре.
* Сделать создание поздравительных открыток простым и доступным.
* Постепенно расширять календарь и источники открыток.


