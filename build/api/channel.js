'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _channel = require('../models/channel');

var _channel2 = _interopRequireDefault(_channel);

var _message = require('../models/message');

var _message2 = _interopRequireDefault(_message);

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
  _channel2.default.find({ participants: req.params.userName }, null, { sort: { id: 1 } }, function (err, channels) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'internal server error', code: 1 });
    }
    res.json({ channels: channels });
  });
});
router.get('/:userName/:listType', function (req, res) {
  _channel2.default.find({ type: req.params.listType }, null, { sort: { id: 1 } }, function (err, channels) {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'internal server error', code: 1 });
    }
    res.json({ channels: channels });
  });
});

// post a new user to channel list db
router.post('/new_channel', function (req, res) {
  if (req.body.type === 'DIRECT') {
    // direct type일 때는 이름 이미 있는지 검토.
    _channel2.default.findOne({ $and: [{ name: req.body.name }, { type: 'DIRECT' }] }, function (err, channel) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'internal server error', code: 1 });
      }
      if (channel !== null) {
        // channel이 이미 존재 할 때 1:1인 경우는 그냥 있는 곳에 들어감.
        channel.participants = req.body.participants;
        channel.save(function (err) {
          if (err) {
            return res.status(500).json({ error: ' internal server error', code: 1 });
          }
          return res.status(400).json({ error: ' already exist', code: 2, channel: channel });
        });
      } else {
        var newChannel = new _channel2.default(req.body);

        newChannel.save(function (err, channel) {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: 'internal server error', code: 1 });
          }

          res.json({ channel: channel });
        });
      }
    });
  } else {
    // 나머지일때는 이름 상관 없음.
    var newChannel = new _channel2.default(req.body);
    newChannel.save(function (err, channel) {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'internal server error', code: 1 });
      }

      res.json({ channel: channel });
    });
  }
});
router.put('/leave/:userName', function (req, res) {
  // 총 한명일때 나가면 채널 삭제!
  _channel2.default.findOne({ id: req.body.channelID }, function (err, channel) {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'internal server error', code: 1 });
    }
    if (channel.participants.length <= 1) {
      // remove channel and messages
      _channel2.default.remove({ id: req.body.channelID }, function (err) {
        if (err) {
          res.status(500).json({ error: 'internal server error', code: 1 });
        }
        _message2.default.remove({ channelID: req.body.channelID }, function (err) {
          if (err) {
            res.status(500).json({ error: 'internal server error', code: 1 });
            return res.json({ channel: channel, isRemoved: true });
          }
          return res.json({ channel: channel, isRemoved: true });
        });
      });
    } else {
      _channel2.default.findOneAndUpdate({ id: req.body.channelID }, { $pull: { participants: req.params.userName } }, { returnNewDocument: true }, function (err, updatedChannel) {
        if (err) {
          res.status(500).json({ error: 'internal server error', code: 1 });
        }
        return res.json({ channel: updatedChannel, isRemoved: false });
      });
    }
  });
});
//post a user to channel TODO: find whether user is already exist or not.
router.put('/join/:userName', function (req, res) {
  //multi Id to array
  _channel2.default.update({ id: { $in: req.body.channels } }, { $addToSet: { participants: req.params.userName } }, { multi: true }, function (err, channels) {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'internal server error', code: 1 });
    }
    return res.json({ channels: channels });
  });
});

router.get('/search/:channelName', function (req, res) {
  //Do i need this?
  if (req.params.channelName === '*') {
    _channel2.default.find({}, function (err, channels) {
      if (err) {
        return res.status(400).json({ error: 'internal server error', code: 1 });
      }
      res.json({ channels: channels });
    });
  } else {
    _channel2.default.find({ name: { $regex: req.params.channelName, $options: 'i' } }, null, { sort: { name: 1 } }, function (err, channels) {
      if (err) {
        return res.status(400).json({ error: 'internal server error', code: 1 });
      }
      res.json({ channels: channels });
    });
  }
});

exports.default = router;