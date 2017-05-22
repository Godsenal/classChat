const jwt = require('jsonwebtoken');
import accounts from '../models/accounts';
import bcrypt from 'bcrypt';
const PassportLocalStrategy = require('passport-local').Strategy;
import config  from '../config.js';


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
    email: email.trim(),
    password: password.trim(),
  };
  // find a user by email address
  accounts.findOne({ email: userData.email }, (err, user) => {
    if (err) { return done(err); }

    if (!user) {
      let error = {};
      error.name = 'IncorrectCredentialsError';
      error.code = 2;

      return done(error);
    }


    /*/ check if a hashed user's password is equal to a value saved in the database
    if(userData.password !== user.password) {
      let error = {};
      error.name = 'IncorrectCredentialsError';
      error.code = 3;

      return done(error);
    }*/
    let hash = bcrypt.hashSync(userData.password, 10);

    if(!bcrypt.compareSync(password, hash)) {
      let error = {};
      error.name = 'IncorrectCredentialsError';
      error.code = 3;

      return done(error);
    }
    const payload = {
      email: user.email,
      //username: user.id,
      //nickname: user.nickname,
      isSignedIn : true,
    };
      // create a token string
    const token = jwt.sign(payload, config.jwtSecret);
    const data = {
      email: user.email,
      username: user.id,
    };
    return done(null, token, data);
  });
});
