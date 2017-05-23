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
router.get('/:userName/:listType', function(req, res) {
  channels.find({ type: req.params.listType},null,{sort: {id : 1}}, function(err, channels) {
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
        channel.save(function(err){
          if(err){
            return res.status(500).json({error: ' internal server error', code: 1});
          }
          return res.status(400).json({error: ' already exist', code: 2, channel});
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
      channels.remove({id: req.body.channelID},(err)=>{
        if(err){
          res.status(500).json({error: 'internal server error', code: 1});
        }
        messages.remove({channelID : req.body.channelID},(err)=>{
          if(err){
            res.status(500).json({error: 'internal server error', code: 1});
            return res.json({channel,isRemoved: true});
          }
          return res.json({channel,isRemoved: true});
        });
      } );
    }
    else{
      channels.findOneAndUpdate({id: req.body.channelID},{$pull: {participants: req.params.userName}},{returnNewDocument: true},
        function(err,updatedChannel){
          if(err){
            res.status(500).json({error: 'internal server error', code: 1});
          }
          return res.json({channel: updatedChannel, isRemoved: false});
        });
    }
  });
});
/* INVITE USER */
router.put('/invite', function(req,res){
  channels.findOneAndUpdate({id: req.body.channelID},{$push: {participants: {$each: req.body.usernames}}},{new: true}, (err, channel) => {
    if(err) {
      console.log(err);
      res.status(500).json({error: 'internal server error', code: 1});
    }
    return res.json({channel});
  });
});
  //post a user to channel TODO: find whether user is already exist or not.
router.put('/join/:userName', function(req,res){
  //multi Id to array
  channels.update({id:{$in : req.body.channels}},{$addToSet:{participants:req.params.userName}},{ multi: true }, function(err, channels){
    if(err){
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    return res.json({channels});
  });
});

router.get('/search/:searchWord/:type', function(req, res){
  //Do i need this?
  if(req.params.searchWord === '*'){
    channels.find({type: req.params.type},function(err,channels){
      if(err){
        return res.status(400).json({error:'internal server error', code: 1});
      }
      res.json({channels});
    });
  }
  else{
    channels.find({$and:[{name:{$regex : req.params.searchWord, $options: 'i'}},{type:req.params.type}]},function(err,channels){
      if(err){
        return res.status(400).json({error:'internal server error', code: 1});
      }
      res.json({channels});
    });
  }
});

export default router;
