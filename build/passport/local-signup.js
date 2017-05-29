'use strict';

var _accounts = require('../models/accounts');

var _accounts2 = _interopRequireDefault(_accounts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PassportLocalStrategy = require('passport-local').Strategy;

/**
 * Return the Passport Local Strategy object.
 */
module.exports = new PassportLocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
  passReqToCallback: true
}, function (req, username, password, done) {
  var userData = {
    id: username.trim(),
    password: password.trim(),
    nickname: req.body.nickname.trim()
  };
  var newAccount = new _accounts2.default(userData);
  newAccount.save(function (err) {
    if (err) {
      return done(err);
    }
    return done(null);
  });
});