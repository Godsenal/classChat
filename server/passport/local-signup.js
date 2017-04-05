import accounts from '../models/accounts';
const PassportLocalStrategy = require('passport-local').Strategy;


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, username, password, done) => {
  const userData = {
    id: username.trim(),
    password: password.trim(),
    nickname: req.body.nickname.trim(),
  };
  const newAccount = new accounts(userData);
  newAccount.save((err) => {
    if (err) {
      return done(err);
    }
    return done(null);
  });
});
