import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import passport from 'passport';
import './config/passport.js';
import { connectDB } from './config/db.js';
import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import articlesRouter from './routes/articles.js';
import authRouter from './routes/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy when on Vercel for secure cookies
app.set('trust proxy', 1);

// View engines
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // default for PUG routes; EJS will render explicitly

// Log & parsers
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Static
app.use(express.static(path.join(__dirname, '../public')));

// Sessions for Passport (cookie-session for serverless safety)
const isProd = !!process.env.VERCEL;

app.use(cookieSession({
  name: 'sid',
  secret: process.env.SESSION_SECRET || 'dev_secret',
  httpOnly: true,
  secure: isProd,      // true на Vercel, false локально
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000,
}));

// Шим совместимости cookie-session ↔ Passport
app.use((req, res, next) => {
  if (req.session && typeof req.session.regenerate !== 'function') {
    req.session.regenerate = (cb) => cb();
  }
  if (req.session && typeof req.session.save !== 'function') {
    req.session.save = (cb) => cb();
  }
  next();
});

app.use(passport.initialize());
app.use(passport.session());


// Theme from cookies middleware
app.use((req, res, next) => {
  res.locals.theme = req.cookies.theme || 'light';
  res.locals.user = req.user || null;
  next();
});

// Mongo connection
connectDB().catch(err => {
  console.error('Mongo connection failed:', err.message);
});

// Routers
app.use('/', indexRouter);
app.use('/', authRouter);       // /login, /register, /logout
app.use('/users', usersRouter); // PUG
app.use('/articles', articlesRouter); // EJS + MongoDB

// 404
app.use((req, res) => {
  res.status(404).render('error/404.pug', { title: '404' });
});

// 500
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error/500.pug', { title: '500' });
});

export default app;
