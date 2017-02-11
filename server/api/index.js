import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

var Schema = mongoose.Schema;

var postSchema = new Schema({
  type: String,
  title: String,
  contents: String,
  published_date: { type: Date, default: Date.now  }
});

var posts = mongoose.model('post', postSchema);
//data contests 배열에 첫값부터 차례로 실행. 결국 return값은 모든 값이 들어가 있는 배열이 될 것.
//reduce의 두 번째 값은 초기값. 즉, 초기값인 empty 객체에 저장.

router.get('/', (req, res) => {
  res.send({'id':'hello'});
});

router.get('/home', (req, res)=> {
  res.send('home');
});
router.get('/notices',(req, res) => {
  posts.find({'type': 'notice'},(err, post) => {
    if(err) return res.status(500).send({error: 'database failure'});
    res.json({post});
  });
});
router.get('/news',(req, res) => {
  res.send('home');
});
router.get(':postId',(req, res) =>{
  res.send({'id':'hello'});
});
router.post('/notices',(req, res) => {
  let post = new posts({
    'type':'notice',
    'title':req.body.title,
    'contents':req.body.contents,
  });

  post.save( err => {
    if(err) throw err;
    return res.json({success: true});
  });

});





export default router;
