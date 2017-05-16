'use strict';

var _accounts = require('../models/accounts');

var _accounts2 = _interopRequireDefault(_accounts);

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jwt = require('jsonwebtoken');

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
    username: username.trim(),
    password: password.trim()
  };
  // find a user by email address
  _accounts2.default.findOne({ id: userData.username }, function (err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      var error = {};
      error.name = 'IncorrectCredentialsError';
      error.code = 2;

      return done(error);
    }

    // check if a hashed user's password is equal to a value saved in the database
    if (userData.password !== user.password) {
      var _error = {};
      _error.name = 'IncorrectCredentialsError';
      _error.code = 3;

      return done(_error);
    }
    var payload = {
      username: user.id,
      nickname: user.nickname,
      isSignedIn: true
    };
    // create a token string
    var token = jwt.sign(payload, _config2.default.jwtSecret);
    var data = {
      username: user.id
    };
    return done(null, token, data);
  });
});