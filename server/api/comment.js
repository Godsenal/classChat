import posts from '../models/post';
import express from 'express';

const router = express.Router();


// add Comment
router.post('/:postId', (req, res)=> {

  posts.findById(req.params.postId, (err, post) =>{
    if(err) throw err;

    let comment = {
      author: req.body.author,
      authorNickname: req.body.authorNickname,
      comment: req.body.contents,
    };

    post.comments.push(comment);

    post.save((err, post) => {
      if(err) throw err;
      return res.json({post});
    });
  });
});


// list Comment
router.get('/:postId',(req, res) => {
  posts.findById(req.params.postId, (err, post) => {
    if(err) return res.status(500).send({error: 'database failure'});
    let comments = post.comments;
    return res.json({comments});
  });
});

// edit Comment
router.put('/:postId/:commentId',(req, res) =>{

  posts.findById(req.params.postId,(err, post) =>{
    if(err) return res.status(500).send({error: 'database failure'});

    post.comments.id(req.params.commentId).comment = req.body.contents;

    post.save((err,post) => {
      if(err) return res.status(500).send({error: 'database failure'});
      return res.json({post});
    });
  });
});
// delete Comment
router.delete('/:postId/:commentId',(req, res) => {
  posts.findById(req.params.postId,(err, post) => {
    if(err) return res.status(500).send({error: 'database failure'});
    post.comments.id(req.params.commentId).remove();

    post.save((err,post) => {
      if(err) return res.status(500).send({error: 'database failure'});
      return res.json({post});
    });
  });
});

export default router;
