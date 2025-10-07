import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ensurePassport, ensureJWT } from '../middlewares/ensure.js';

const router = Router();

router.get('/login', (req,res)=>{
  res.send('<p>Use the form on the home page to login.</p>');
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send('User exists');
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });
    // Auto-login via passport
    req.login(user, (err) => {
      if (err) return res.status(500).send('Login failed');
      return res.redirect('/');
    });
  } catch (e) {
    res.status(500).send('Registration error');
  }
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/?reason=login_failed',
  successRedirect: '/'
}));

router.post('/login-jwt', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ message: 'Wrong credentials' });
  const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev_jwt', { expiresIn: '1d' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax', secure: !!process.env.VERCEL });
  res.json({ ok: true });
});

router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session = null;
    res.clearCookie('token');
    res.redirect('/');
  });
});

// Protected examples
router.get('/protected_passport', ensurePassport, (req, res) => {
  res.send(`<h2>Вітаю, ${req.user.name || req.user.email}! Це захищений маршрут (Passport).</h2>`);
});

router.get('/protected', ensureJWT, (req, res) => {
  res.json({ message: 'JWT OK', user: req.jwtUser });
});

export default router;
