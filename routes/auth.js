const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();
router.post('/register', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Вкажіть email і пароль' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email вже зареєстрований' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });
    req.login({ id: user._id.toString(), email: user.email }, (e) => {
      if (e) return next(e);
      res.json({ message: 'Реєстрація успішна й виконано вхід', user: { email: user.email } });
    });
  } catch (e) { next(e); }
});
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: 'Невірний email або пароль' });
    req.logIn(user, (e) => {
      if (e) return next(e);
      res.json({ message: 'Вхід успішний', user: { email: user.email } });
    });
  })(req, res, next);
});
router.post('/logout', (req, res) => {
  req.logout?.(() => {});
  req.session = null;
  res.json({ message: 'Вихід виконано' });
});
module.exports = router;
