import channels from '../models/channel';
import messages from '../models/message';
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
  channels.find({ participants: req.params.userName},null,{sort: {id : 1}}, function(err, channels) {
    if(err) {
      console.log(err);
      return res.status(400).json({error: 'internal server error', code: 1});
    }
    res.json({channels});
  });
});

  // post a new user to channel list db
router.post('/new_channel', function(req, res) {
  if(req.body.type ==='DIRECT'){ // direct type일 때는 이름 이미 있는지 검토.
    channels.findOne({$and: [{name: req.body.name}, {type: 'DIRECT'}]}, function(err, channel){
      if(err) {
        console.log(err);
        return res.status(500).json({error: 'internal server error', code: 1});
      }
      if(channel !== null){ // channel이 이미 존재 할 때 1:1인 경우는 그냥 있는 곳에 들어감.
        channel.participants = req.body.participants;
        channel.save(function(err, channels){
          if(err){
            return res.status(500).json({error: ' internal server error', code: 1});
          }
          return res.json({channel});
        });
      }
      else{
        var newChannel = new channels(req.body);

        newChannel.save(function (err, channel) {
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }

          res.json({channel});
        });
      }
    });
  }
  else{ // 나머지일때는 이름 상관 없음.
    var newChannel = new channels(req.body);
    newChannel.save(function (err, channel) {
      if(err) {
        console.log(err);
        return res.status(500).json({error: 'internal server error', code: 1});
      }

      res.json({channel});
    });
  }
});
router.put('/leave/:userName', function(req,res){ // 총 한명일때 나가면 채널 삭제!
  channels.findOne({id: req.body.channelID}, (err, channel) => {
    if(err) {
      console.log(err);
      res.status(500).json({error: 'internal server error', code: 1});
    }
    if(channel.participants.length <= 1){ // remove channel and messages
      channels.deleteOne({id: req.body.channelID});
      messages.remove({channelID : req.body.channelID});
      res.json({channel,isRemoved: true});
    }
    else{
      channels.findOneAndUpdate({id: req.body.channelID},{$pull: {participants: req.params.userName}},{returnNewDocument: true},
        function(err,updatedChannel){
          res.json({channel: updatedChannel, isRemoved: false});
        });
    }
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
  if(req.params.channelName === '*'){
    channels.find({},function(err,channels){
      if(err){
        return res.status(400).json({error:'internal server error', code: 1});
      }
      res.json({channels});
    });
  }
  else{
    channels.find({name:{$regex : req.params.channelName, $options: 'i'}}, null, {sort: {name: 1}},function(err,channels){
      if(err){
        return res.status(400).json({error:'internal server error', code: 1});
      }
      res.json({channels});
    });
  }
});

export default router;
