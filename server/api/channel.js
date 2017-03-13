import channels from '../models/channel';
import express from 'express';

const router = express.Router();


// Initial Channel
router.get('/', function(req, res) {

  channels.find({name: 'public'}, function(err, channels) {
    if(err) {
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }

    res.json({channels});
  });
});

  // this route returns all channels including private channels for that user
router.get('/:userName', function(req, res) {

  channels.find({ participants: req.params.userName}, function(err, channels) {
    if(err) {
      console.log(err);
      return res.status(400).json({error: 'internal server error', code: 1});
    }
    res.json({channels});
  });
});

  // post a new user to channel list db
router.post('/new_channel', function(req, res) {
  var newChannel = new channels(req.body);
  newChannel.save(function (err, channel) {
    if(err) {
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }

    res.json({channel});
  });
});

  //post a user to channel TODO: find whether user is already exist or not.
router.put('/join/:userName', function(req,res){
  //multi Id to array
  var ids = [];
  for (var i=0; i<req.body.length; ++i) {
    ids.push(req.body[i].id);
  }
  channels.update({id:{$in : ids}},{$addToSet:{participants:req.params.userName}},{ multi: true }, function(err, updated){
    if(err){
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    res.json({updated});
  });
});

router.get('/search/:channelName', function(req, res){
  channels.find({name:{$regex : req.params.channelName, $options: 'i'}}, null, {sort: {name: 1}},function(err,channels){
    if(err){
      return res.status(400).json({error:'internal server error', code: 1});
    }
    res.json({channels});
  });
});

export default router;
