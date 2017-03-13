'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _message = require('../models/message');

var _message2 = _interopRequireDefault(_message);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

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
router.get('/:channelID', function (req, res) {
  _message2.default.find({ channelID: req.params.channelID }, function (err, messages) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    res.json({ messages: messages });
  });
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

exports.default = router;