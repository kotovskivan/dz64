const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');
const { connectDB } = require('./utils/db');
const passport = require('./passport');
const authRoutes = require('./routes/auth');
const pagesRoutes = require('./routes/pages');
const app = express();
app.set('trust proxy', 1);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
connectDB();
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use(cookieSession({
  name: 'sess',
  keys: [process.env.SESSION_SECRET || 'dz64_secret'],
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production'
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.passportAuth = Boolean(req.isAuthenticated && req.isAuthenticated());
  res.locals.passportUser = req.user || null;
  next();
});
app.use('/', pagesRoutes);
app.use('/auth', authRoutes);
app.use((err, req, res, next) => {
  console.error(err);
  if (req.accepts('json')) return res.status(500).json({ message: err.message || 'Server error' });
  res.status(500).send('Server error');
});
module.exports = app;
