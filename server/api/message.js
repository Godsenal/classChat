import messages from '../models/message';
import express from 'express';
import multer from 'multer';
const router = express.Router();

const storage = multer.diskStorage({
  destination: './public/files',
  filename(req, file, cb) {
    cb(null, `${new Date()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

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
router.get('/list/:channelID/:messageID', function(req, res) {
  if(req.params.messageID === '-1'){
    messages.find({$and: [{channelID: req.params.channelID},{id : {$gt: req.params.messageID}}]}) // just find all?
            .sort({id : -1})
            .limit(30)
            .exec((err, messages)=>{
              if(err) {
                console.log(err);
                return res.status(500).json({error: 'cannot get initial message from db', code: 1});
              }
              res.json({messages});
            });
  }
  else{
    messages.find({$and: [{channelID: req.params.channelID},{id : {$lt: req.params.messageID}}]})
            .sort({id : -1})
            .limit(30)
            .exec((err, messages)=>{
              if(err) {
                console.log(err);
                return res.status(500).json({error: 'cannot get old message from db', code: 2});
              }
              res.json({messages});
            });
  }
});
//get message list by date
router.get('/listdate/:channelID/:lastdate', function(req, res){
  messages.find({$and: [{channelID: req.params.channelID},{created : {$gte: req.params.lastdate}}]})
          .sort({id : -1})
          .exec((err,dateMessages)=>{
            if(err) {
              console.log(err);
              return res.status(500).json({error: 'cannot get lastdate message from db', code: 3});
            }
            let lastDate = dateMessages.slice(-1)[0]; // if messages is empty, lastDate's value is 'undefined'
            let lastDateID = '';
            if(typeof lastDate !== 'undefined'){
              lastDateID = lastDate.id;
            }
            if(dateMessages.length < 30){
              messages.find({channelID: req.params.channelID})
                      .sort({id : -1})
                      .limit(30)
                      .exec((err,normalMesssages)=>{
                        if(err) {
                          console.log(err);
                          return res.status(500).json({error: 'cannot get lastdate message from db', code: 3});
                        }
                        return res.json({messages: normalMesssages, lastDateID});
                      });
            }else{
              return res.json({messages: dateMessages, lastDateID});
            }
          });
});
// get list of messages to jump to targetID
router.get('/jump/:channelID/:messageID/:types/:targetID', function(req,res){
  messages.find({$and: [{channelID: req.params.channelID},{id: {$gte: req.params.targetID}},{id: {$lt: req.params.messageID}}]})
    .sort({id: -1})
    .exec((err,messages)=>{
      if(err) {
        console.log(err);
        return res.status(500).json({error: 'internal server error', code:1});
      }
      return res.json({messages});
    });
});
  //get filtered message
router.get('/filter/:channelID/:messageID/:types/:searchWord', function(req, res){
  let searchReg = '.*'+req.params.searchWord+'.*';
  if(req.params.messageID === '-1'){
    switch (req.params.types) {
    case 'userName':
      messages.find({$and: [{channelID: req.params.channelID},{userName: req.params.searchWord},{id : {$gt: req.params.messageID}}]})
        .sort({id: -1})
        .limit(15)
        .exec((err, messages)=>{
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }
          return res.json({messages});
        });
      break;
    case 'date':
      messages.find({$and: [{channelID: req.params.channelID},{created: {$gt:req.params.searchWord}},{id : {$gt: req.params.messageID}}]})
        .sort({id: -1})
        .exec((err, messages)=>{
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }
          return res.json({messages});
        });
      break;
    case 'message':
      messages.find({$and: [{channelID: req.params.channelID},{contents: {$regex: searchReg, $options : 'i' }},{id : {$gt: req.params.messageID}}]})
        .sort({id: -1})
        .limit(15)
        .exec((err, messages)=>{
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }
          return res.json({messages});
        });
      break;
    default:
      console.log(req.params.types);
      messages.find({$and: [{channelID: req.params.channelID},{types: req.params.types},{contents: {$regex: searchReg, $options : 'i' }},{id : {$gt: req.params.messageID}}]})
        .sort({id: -1})
        .limit(15)
        .exec((err, messages)=>{
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }
          return res.json({messages});
        });
      break;

    }
  }
  else{
    switch (req.params.types) {
    case 'userName':
      messages.find({$and: [{channelID: req.params.channelID},{userName: req.params.searchWord},{id : {$lt: req.params.messageID}}]})
        .sort({id: -1})
        .limit(15)
        .exec((err, messages)=>{
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }
          return res.json({messages});
        });
      break;
    case 'date':
      messages.find({$and: [{channelID: req.params.channelID},{created: {$gt:req.params.searchWord}},{id : {$lt: req.params.messageID}}]})
        .sort({id: -1})
        .exec((err, messages)=>{
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }
          return res.json({messages});
        });
      break;
    case 'contents':
      messages.find({$and: [{channelID: req.params.channelID},{contents: {$regex: req.params.searchWord, $options : 'i' }},{id : {$gt: req.params.messageID}}]})
        .sort({id: -1})
        .limit(15)
        .exec((err, messages)=>{
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }
          return res.json({messages});
        });
      break;
    default:
      messages.find({$and: [{channelID: req.params.channelID},{types: req.params.types},{contents: {$in:[req.params.searchWord]}},{id : {$lt: req.params.messageID}}]})
        .sort({id: -1})
        .limit(15)
        .exec((err, messages)=>{
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }
          return res.json({messages});
        });
      break;

    }
  }
});
router.get('/search/:channelID/:messageID/:types/:searchWord', function(req, res){
  if(req.params.messageID === '-1'){
    switch (req.params.types) {
    case 'userName':
      messages.find({$and: [{channelID: req.params.channelID},{userName: req.params.searchWord},{id : {$gt: req.params.messageID}}]})
        .sort({id: -1})
        .limit(15)
        .exec((err, messages)=>{
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }
          return res.json({messages});
        });
      break;
    case 'contents':
      messages.find({$and: [{channelID: req.params.channelID},{contents: {$in: [req.params.searchWord]}},{id : {$gt: req.params.messageID}}]})
        .sort({id: -1})
        .limit(15)
        .exec((err, messages)=>{
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }
          return res.json({messages});
        });
      break;
    case 'date':
      messages.find({$and: [{channelID: req.params.channelID},{created: {$gt:req.params.searchWord}},{id : {$gt: req.params.messageID}}]})
        .sort({id: -1})
        .exec((err, messages)=>{
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }
          return res.json({messages});
        });
      break;
    default:

    }
  }
  else{
    switch (req.params.types) {
    case 'userName':
      messages.find({$and: [{channelID: req.params.channelID},{userName: req.params.searchWord},{id : {$lt: req.params.messageID}}]})
        .sort({id: -1})
        .limit(15)
        .exec((err, messages)=>{
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }
          return res.json({messages});
        });
      break;
    case 'contents':
      messages.find({$and: [{channelID: req.params.channelID},{contents: {$in: [req.params.searchWord]}},{id : {$lt: req.params.messageID}}]})
        .sort({id: -1})
        .limit(15)
        .exec((err, messages)=>{
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }
          return res.json({messages});
        });
      break;
    case 'date':
      messages.find({$and: [{channelID: req.params.channelID},{created: {$gt:req.params.searchWord}},{id : {$lt: req.params.messageID}}]})
        .sort({id: -1})
        .exec((err, messages)=>{
          if(err) {
            console.log(err);
            return res.status(500).json({error: 'internal server error', code: 1});
          }
          return res.json({messages});
        });
      break;
    default:
    }
  }
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

router.post('/new_message/:types', upload.single('files') , function(req, res) {
  console.log(req.body.contents);
  let message = {
    ...req.body,
    url: `${new Date()}-${req.file.originalname}`,
    types: req.params.types,
  };
  var newMessage = new messages(message);
  newMessage.save(function (err, message){
    if(err){
      console.log(err);
      return res.status(500).json({error: 'internal server error', code: 1});
    }
    res.json({message});
  });
});


export default router;
