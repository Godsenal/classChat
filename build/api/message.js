'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _message = require('../models/message');

var _message2 = _interopRequireDefault(_message);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var storage = _multer2.default.diskStorage({
  destination: './public/files',
  filename: function filename(req, file, cb) {
    cb(null, new Date() + '-' + file.originalname);
  }
});

var upload = (0, _multer2.default)({ storage: storage });

router.get('/', function (req, res) {
  _message2.default.find({}, { id: 1, channelID: 1, text: 1, user: 1, time: 1, _id: 0 }, function (err, messages) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    res.json({ messages: messages });
  });
});

// query DB for messages for a specific channel
router.get('/list/:channelID/:messageID', function (req, res) {
  if (req.params.messageID === '-1') {
    _message2.default.find({ $and: [{ channelID: req.params.channelID }, { id: { $gt: req.params.messageID } }] }) // just find all?
    .sort({ id: -1 }).limit(30).exec(function (err, messages) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'cannot get initial message from db', code: 1 });
      }
      res.json({ messages: messages });
    });
  } else {
    _message2.default.find({ $and: [{ channelID: req.params.channelID }, { id: { $lt: req.params.messageID } }] }).sort({ id: -1 }).limit(30).exec(function (err, messages) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'cannot get old message from db', code: 2 });
      }
      res.json({ messages: messages });
    });
  }
});
//get message list by date
router.get('/listdate/:channelID/:lastdate', function (req, res) {
  _message2.default.find({ $and: [{ channelID: req.params.channelID }, { created: { $gte: req.params.lastdate } }] }).sort({ id: -1 }).exec(function (err, dateMessages) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'cannot get lastdate message from db', code: 3 });
    }
    var lastDate = dateMessages.slice(-1)[0]; // if messages is empty, lastDate's value is 'undefined'
    var lastDateID = '';
    if (typeof lastDate !== 'undefined') {
      lastDateID = lastDate.id;
    }
    if (dateMessages.length < 30) {
      _message2.default.find({ channelID: req.params.channelID }).sort({ id: -1 }).limit(30).exec(function (err, normalMesssages) {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: 'cannot get lastdate message from db', code: 3 });
        }
        return res.json({ messages: normalMesssages, lastDateID: lastDateID });
      });
    } else {
      return res.json({ messages: dateMessages, lastDateID: lastDateID });
    }
  });
});
//get filtered message
router.get('/filter/:channelID/:messageID/:types', function (req, res) {
  if (req.params.messageID === '-1') {
    _message2.default.find({ $and: [{ channelID: req.params.channelID }, { types: req.params.types }, { id: { $gt: req.params.messageID } }] }).sort({ id: -1 }).limit(15).exec(function (err, messages) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'internal server error', code: 1 });
      }
      return res.json({ messages: messages });
    });
  } else {
    _message2.default.find({ $and: [{ channelID: req.params.channelID }, { types: req.params.types }, { id: { $lt: req.params.messageID } }] }).sort({ id: -1 }).limit(15).exec(function (err, messages) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'internal server error', code: 1 });
      }
      return res.json({ messages: messages });
    });
  }
});
//post a new message to db
router.post('/new_message', function (req, res) {
  var newMessage = new _message2.default(req.body);
  newMessage.save(function (err, message) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    res.json({ message: message });
  });
});

router.post('/new_message/:types', upload.single('files'), function (req, res) {
  var message = _extends({}, req.body, {
    url: new Date() + '-' + req.file.originalname,
    types: req.params.types
  });
  var newMessage = new _message2.default(message);
  newMessage.save(function (err, message) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    res.json({ message: message });
  });
});

exports.default = router;