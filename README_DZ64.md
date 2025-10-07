# ДЗ64 — Passport + cookie-session + MongoDB Atlas + /articles

## Что сделано
- Убран лишний код (JWT и пр.). Сохранены ваши существующие странички/шаблоны.
- Добавлено подключение к MongoDB Atlas через Mongoose (`utils/db.js`).
- Добавлены модели `User` и `Article`.
- Маршрут чтения: **GET `/articles`** (рендер списком из коллекции `articles`).
- Опциональный сид: **POST `/dev/seed-articles`**.
- Сессии: **cookie-session** (совместимо с Vercel).
- `fetch` авторизации настроен на `credentials: "same-origin"`.

## Переменные окружения
- `SESSION_SECRET` — произвольная длинная строка.
- `MONGODB_URI` — строка Atlas, например:
  `mongodb+srv://USER:PASS@CLUSTER/dz64?retryWrites=true&w=majority`
- (Vercel) `USE_COOKIE_SESSION=1`

## Локальный запуск (Windows PowerShell)
```powershell
npm i
$env:SESSION_SECRET="your_secret"
$env:MONGODB_URI="mongodb+srv://USER:PASS@CLUSTER/dz64?retryWrites=true&w=majority"
npm run dev
```
Откройте `http://localhost:3000`, проверьте `/articles`. Если пусто — вызовите `POST /dev/seed-articles` или кнопку на странице.

## Публикация в Git
```bash
git init
git add .
git commit -m "DZ64: MongoDB Atlas + /articles"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

## Деплой на Vercel
1) Импортируйте репозиторий.  
2) В `Settings → Environment Variables` добавьте: `SESSION_SECRET`, `USE_COOKIE_SESSION=1`, `MONGODB_URI`.  
3) Deploy → проверяйте `/articles` и `/protected_passport`.
