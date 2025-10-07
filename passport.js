const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User');
passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email }).lean(false);
      if (!user) return done(null, false, { message: 'Користувача не знайдено' });
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return done(null, false, { message: 'Невірний пароль' });
      return done(null, { id: user._id.toString(), email: user.email });
    } catch (e) { done(e); }
  }
));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const u = await User.findById(id).lean();
    if (!u) return done(null, false);
    done(null, { id: u._id.toString(), email: u.email });
  } catch (e) { done(e); }
});
module.exports = passport;
