import mongoose from 'mongoose';
import express from 'express';

const router = express.Router();

var Schema = mongoose.Schema;

var postSchema = new Schema({
  type: String,
  title: String,
  contents: String,
  published_date: { type: Date, default: Date.now  }
});


var posts = mongoose.model('post', postSchema);

router.get('/home', (req, res)=> {
  posts.find({},null, {sort: {published_date: -1}},(err, post) => {
    if(err) return res.status(500).send({error: 'database failure'});
    res.json({post});
  });
});
router.get('/notices',(req, res) => {
  posts.find({'type': 'notice'},null, {sort: {published_date: -1}},(err, post) => {
    if(err) return res.status(500).send({error: 'database failure'});
    res.json({post});
  });
});
router.get('/:postId',(req, res) =>{
  posts.findOne({_id:req.params.postId},(err, post) =>{
    if(err) return res.status(500).send({error: 'database failure'});
    res.json({post});
  });
});
router.post('/:type',(req, res) => {
  let post = new posts({
    'type':req.params.type,
    'title':req.body.title,
    'contents':req.body.contents,
  });

  post.save( err => {
    if(err) throw err;
    return res.json({success: true});
  });

});
router.delete('/:postId',(req, res) => {
  posts.remove({_id:req.params.postId},(err) => {
    if(err) return res.status(500).send({error: 'database failure'});
    return res.json({success: true});
  });
});

export default router;
