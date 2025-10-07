// examples/app.cookie-session.example.js
// Повний приклад для орієнтиру. Налаштуй під свій проєкт!

const express = require('express');
const path = require('path');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');

const app = express();
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DEMO in-memory users
const usersStore = global.__usersStore || (global.__usersStore = []);

// LocalStrategy (email+password)
passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    const user = usersStore.find(u => u.email === email);
    if (!user) return done(null, false, { message: 'Користувача не знайдено' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return done(null, false, { message: 'Невірний пароль' });
    return done(null, user);
  }
));

passport.serializeUser((user, done) => done(null, user.email));
passport.deserializeUser((email, done) => {
  const user = usersStore.find(u => u.email === email) || null;
  done(null, user);
});

// Cookie session for Vercel
if (process.env.VERCEL || process.env.USE_COOKIE_SESSION) {
  app.use(cookieSession({
    name: 'sess',
    keys: [process.env.SESSION_SECRET || 'dz63_secret'],
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  }));
} else {
  const session = require('express-session');
  app.use(session({
    secret: process.env.SESSION_SECRET || 'dz63_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    }
  }));
}

app.use(passport.initialize());
app.use(passport.session());

// locals to templates
app.use((req, res, next) => {
  res.locals.passportAuth = Boolean(req.isAuthenticated && req.isAuthenticated());
  res.locals.passportUser = req.user || null;
  next();
});

// demo protected route
app.get('/protected_passport', (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: 'Потрібно увійти через Passport' });
  }
  res.json({ message: 'OK', user: { email: req.user.email } });
});

// auth routes (custom callbacks)
app.post('/auth/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: 'Невірний email або пароль' });
    req.logIn(user, (e) => {
      if (e) return next(e);
      return res.json({ message: 'Вхід успішний', user: { email: user.email } });
    });
  })(req, res, next);
});

app.post('/auth/register', async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Вкажіть email і пароль' });
    if (usersStore.find(u => u.email === email)) return res.status(400).json({ message: 'Email вже зареєстрований' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { email, passwordHash };
    usersStore.push(user);
    req.login(user, () => res.json({ message: 'Реєстрація успішна й виконано вхід', user: { email } }));
  } catch (e) {
    next(e);
  }
});

// static files & demo page (optional)
app.use('/public', express.static(path.join(__dirname, 'public')));

module.exports = app;
