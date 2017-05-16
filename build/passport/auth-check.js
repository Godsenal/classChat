'use strict';

var _accounts = require('../models/accounts');

var _accounts2 = _interopRequireDefault(_accounts);

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jwt = require('jsonwebtoken');


/**
 *  The Auth Checker middleware function.
 */
module.exports = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).end();
  }

  // get the last part from a authorization header string like "bearer token-value"
  var token = req.headers.authorization.split(' ')[1];

  // decode the token using a secret key-phrase
  return jwt.verify(token, _config2.default.jwtSecret, function (err, decoded) {
    // the 401 code is for unauthorized status
    if (err) {
      return res.status(401).end();
    }

    var userId = decoded.sub;

    // check if a user exists
    return _accounts2.default.findById(userId, function (userErr, user) {
      if (userErr || !user) {
        return res.status(401).end();
      }

      return next();
    });
  });
};