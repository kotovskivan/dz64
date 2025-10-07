const express = require('express');
const Article = require('../models/Article');
const router = express.Router();
router.get('/', (req, res) => {
  res.render('index', { title: 'DZ64 — MongoDB Atlas + Passport' });
});
router.get('/protected_passport', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: 'Потрібно увійти через Passport' });
  }
  res.json({ message: 'OK', user: res.locals.passportUser });
});
router.get('/articles', async (req, res, next) => {
  try {
    const list = await Article.find({}).sort({ createdAt: -1 }).limit(50).lean();
    res.render('articles', { title: 'Статті з MongoDB', articles: list });
  } catch (e) { next(e); }
});
router.post('/dev/seed-articles', async (req, res, next) => {
  try {
    const count = await Article.countDocuments();
    if (count > 0) return res.json({ message: 'Вже є дані', count });
    await Article.insertMany([
      { title: 'MongoDB Atlas старт', body: 'Перша стаття у колекції.', tags: ['intro'] },
      { title: 'Passport + cookie-session', body: 'Працює на Vercel.', tags: ['auth'] },
      { title: 'DZ64 читання з БД', body: 'Маршрут /articles рендерить список.', tags: ['dz64'] }
    ]);
    res.json({ message: 'OK, додано', count: await Article.countDocuments() });
  } catch (e) { next(e); }
});
module.exports = router;
