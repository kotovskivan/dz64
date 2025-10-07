# DZ64 — Express + PUG/EJS + Cookies/JWT + Passport + MongoDB Atlas (Vercel-ready)

Це завершена збірка, яка включає вимоги **ДЗ-61, 62, 63 і 64**:
- **PUG** для `/users` та `/users/:userId`
- **EJS** для `/articles` та `/articles/:articleId` (читання з **MongoDB Atlas**)
- **Favicon** та статичні файли з `public/`
- **Cookies**: збереження теми (`/theme/:name`) та **JWT** у httpOnly cookie
- **JWT-авторизація**: `/login-jwt` (POST), protected `GET /protected`
- **Passport (Local Strategy + сесії)**: `/register`, `/login`, `/logout`, protected `GET /protected_passport`
- **Vercel** сумісність через `serverless-http` та `api/index.js`

## Швидкий старт локально
```bash
npm i
cp .env.example .env   # відредагуйте MONGODB_URI, SECRET-и
npm run seed           # створить 2 статті в БД
npm run dev            # http://localhost:3000
```

## Маршрути
- `GET /` — головна, форми login/register, лінки
- `GET /users` — PUG список (демо-статичні дані)
- `GET /users/:userId` — PUG детальна
- `GET /articles` — EJS список з MongoDB
- `GET /articles/:articleId` — EJS детальна
- `POST /register` — Passport: реєстрація + автобхід
- `POST /login` — Passport: вхід (session cookie)
- `GET /logout` — Passport: вихід
- `POST /login-jwt` — JWT: повертає `{ ok: true }` і встановлює httpOnly cookie `token`
- `GET /protected` — перевірка JWT cookie
- `GET /protected_passport` — перевірка сесії Passport
- `GET /theme/:name` — збереження теми у cookie (`light|dark`)


## Структура
```
api/index.js            # вхід для Vercel (serverless-http)
server.js               # локальний старт
src/
  app.js
  config/
    db.js, passport.js
  middlewares/ensure.js
  models/Article.js, User.js
  routes/
    index.js, auth.js, users.js, articles.js
  views/
    _layout.pug
    users/ (PUG)
    articles/ (EJS)
public/
  css/site.css
  favicon.ico
```

## Примітки
- `/users` реалізовано статично, бо вимога 61 — саме демонстрація PUG. За бажанням можна підключити Users до Mongo.
- Якщо при логіні бачите себе як «гість» на Vercel — це майже завжди **cookies/sameSite/secure** або відсутність `trust proxy`. У цій збірці це виправлено.


## Дополнения
- Добавлены отдельные вьюхи для главной, auth, ошибки 404/500
- Разбитые CSS: `desktop.css` и `mobile.css`
- Формы создания статей (`/articles/new`) защищены Passport
- `.gitignore` включён
