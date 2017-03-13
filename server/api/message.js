import messages from '../models/message';
import express from 'express';

const router = express.Router();

router.get('/', function(req, res) {
  messages.find({}, {id: 1, channelID: 1, text: 1, user: 1, time: 1, _id: 0}, function(err, messages) {
    if(err) {
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    res.json({messages});
  });
});

// query DB for messages for a specific channel
router.get('/:channelID', function(req, res) {
  messages.find({channelID: req.params.channelID}, function(err, messages) {
    if(err) {
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    res.json({messages});
  });
});

  //post a new message to db
router.post('/new_message', function(req, res) {
  var newMessage = new messages(req.body);
  newMessage.save(function (err, message) {
    if(err) {
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    res.json({message});
  });
});

export default router;
