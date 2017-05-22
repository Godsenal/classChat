import accounts from '../models/accounts';
import bcrypt from 'bcrypt';
const PassportLocalStrategy = require('passport-local').Strategy;


/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, (req, email, password, done) => {
  const userData = {
    email: email.trim(), // email. 로그인용
    id: req.body.username.trim(), // user name
    password: password.trim(),
  };
  accounts.findOne({$or: [{ email: userData.email },{id: userData.id }]}, (err, user) => {
    if (err) { return done(err); }
    if(user){
      let error = {error: '', code: 1};
      if(user.email == userData.email){
        error.error = 'EMAIL EXIST';
        error.code = 4;
        return done(error);
      }
      if(user.id == userData.id){
        error.error = 'USERNAME EXIST';
        error.code = 5;
        return done(error);
      }
    }else{
      let hash = bcrypt.hashSync(userData.password, 10);
      userData.password = hash;
      const newAccount = new accounts(userData);
      newAccount.save((err) => {
        if (err) {
          return done(err);
        }
        return done(null);
      });
    }
  });
});
