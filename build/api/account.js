'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _accounts = require('../models/accounts');

var _accounts2 = _interopRequireDefault(_accounts);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _config = require('../config.js');

var _config2 = _interopRequireDefault(_config);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();


router.post('/signup', function (req, res, next) {
  // CHECK USERNAME FORMAT
  var usernameForm = /^[a-zA-Z0-9]+$/;
  if (!usernameForm.test(req.body.username) || req.body.username < 4) {
    return res.status(400).json({
      error: 'BAD ID',
      code: 1
    });
  }
  // CHECK NICKNAME FORMAT
  if (!usernameForm.test(req.body.nickname)) {
    return res.status(400).json({
      error: 'BAD NICKNAME',
      code: 3
    });
  }

  // CHECK PASS LENGTH
  if (req.body.password.length < 4 || typeof req.body.password !== 'string') {
    return res.status(400).json({
      error: 'BAD PASSWORD',
      code: 2
    });
  }
  _passport2.default.authenticate('local-signup', function (err) {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // the 11000 Mongo code is for a duplication email error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          error: 'This username is already taken.',
          code: 4
        });
      }
      console.log(err);
      return res.status(400).json({
        success: false,
        error: 'Could not process the form.',
        code: 5
      });
    }

    return res.json({
      success: true
    });
  })(req, res, next);
});

/*
    ACCOUNT SIGNIN: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/
router.post('/signin', function (req, res, next) {
  if (typeof req.body.password !== 'string') {
    return res.status(401).json({
      error: 'SIGNIN FAILED',
      code: 1
    });
  }

  _passport2.default.authenticate('local-signin', function (err, token, data) {
    if (err) {
      return res.status(401).json({
        error: 'SIGNIN FAILED',
        code: 2
      });
    }
    if (!data) {
      return res.status(401).json({
        error: 'CAN NOT FIND USER',
        code: 3
      });
    }
    //user has authenticated correctly thus we create a JWT token
    return res.json({
      token: token,
      username: data.username,
      nickname: data.nickname
    });
  })(req, res, next);
  /*
    // FIND THE USER BY USERNAME
  accounts.findOne({ id: req.body.id}, (err, account) => {
    if(err) throw err;
         // CHECK ACCOUNT EXISTANCY
    if(!account) {
      return res.status(401).json({
        error: 'SIGNIN FAILED',
        code: 1
      });
    }
         // CHECK WHETHER THE PASSWORD IS VALID
    if(account.password !== req.body.password) {
      return res.status(401).json({
        error: 'SIGNIN FAILED',
        code: 1
      });
    }
    var isAdmin = false;
     if(account.isAdmin === true)
      isAdmin = true;
     var payload = {id: account.id};
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({message: "ok", token: token});
    /*
        // ALTER SESSION
    let session = req.session;
    session.loginInfo = {
      _id: account._id,
      id: account.id,
      nickname: account.nickname,
      isAdmin: isAdmin
    };
         // RETURN SUCCESS
    return res.json({
      success: true,
      nickname: account.nickname,
      isAdmin: isAdmin,
    });
   });
  */
});

/*
    GET CURRENT USER INFO GET /api/account/getInfo
*/
router.get('/getinfo', function (req, res) {
  if (!req.headers.authorization) {
    return res.status(401).json({
      error: 'INVALID STATUS',
      code: 1
    });
  }

  var token = req.headers.authorization.split(' ')[1];
  _jsonwebtoken2.default.verify(token, _config2.default.jwtSecret, function (err, decoded) {

    if (err) {
      return res.status(401).json({
        error: 'CANNOT DECODED TOKEN',
        code: 2
      });
    }
    return res.json({ info: decoded });
  });
});

/*
    LOGOUT: POST /api/account/logout     ///지워도됨 JWT에서는 필요가 없다.
*/
router.post('/signout', function (req, res) {
  req.session.destroy();
  return res.json({ success: true });
});

exports.default = router;