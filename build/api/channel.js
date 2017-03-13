'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _channel = require('../models/channel');

var _channel2 = _interopRequireDefault(_channel);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// Initial Channel
router.get('/', function (req, res) {

  _channel2.default.find({ name: 'public' }, function (err, channels) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }

    res.json({ channels: channels });
  });
});

// this route returns all channels including private channels for that user
router.get('/:userName', function (req, res) {

  _channel2.default.find({ participants: req.params.userName }, function (err, channels) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'internal server error', code: 1 });
    }
    res.json({ channels: channels });
  });
});

// post a new user to channel list db
router.post('/new_channel', function (req, res) {
  var newChannel = new _channel2.default(req.body);
  newChannel.save(function (err, channel) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }

    res.json({ channel: channel });
  });
});

//post a user to channel TODO: find whether user is already exist or not.
router.put('/join/:userName', function (req, res) {
  //multi Id to array
  var ids = [];
  for (var i = 0; i < req.body.length; ++i) {
    ids.push(req.body[i].id);
  }
  _channel2.default.update({ id: { $in: ids } }, { $addToSet: { participants: req.params.userName } }, { multi: true }, function (err, updated) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    res.json({ updated: updated });
  });
});

router.get('/search/:channelName', function (req, res) {
  _channel2.default.find({ name: { $regex: req.params.channelName, $options: 'i' } }, null, { sort: { name: 1 } }, function (err, channels) {
    if (err) {
      return res.status(400).json({ error: 'internal server error', code: 1 });
    }
    res.json({ channels: channels });
  });
});

exports.default = router;