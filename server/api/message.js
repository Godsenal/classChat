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
router.get('/:channelID/:messageID', function(req, res) {
  if(req.params.messageID === '-1'){
    messages.find({$and: [{channelID: req.params.channelID},{id : {$gt: req.params.messageID}}]})
            .sort({id : -1})
            .limit(30)
            .exec((err, messages)=>{
              if(err) {
                console.log(err);
                return res.status(500).json({error: 'internal server error', code: 1});
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
                return res.status(500).json({error: 'internal server error', code: 1});
              }
              res.json({messages});
            });
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
