import posts from '../models/post';
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();


// add Comment
router.post('/:postId', (req, res)=> {
  if(typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: "NOT SIGNED IN",
      code: 1
    });
  }
  if(typeof req.body.comment !== 'string') {
    return res.status(400).json({
      error: "CONTENTS TYPE ERROR",
      code: 2
    });
  }

  if(req.body.comment === "") {
    return res.status(400).json({
      error: "EMPTY CONTENTS",
      code: 3
    });
  }

  posts.findById(req.params.postId, (err, post) =>{
    if(err) throw err;

    let comment = {
      author: req.body.author,
      authorNickname: req.body.authorNickname,
      comment: req.body.comment,
    };

    post.comments.push(comment);

    post.save((err, post) => {
      if(err) throw err;
      return res.json({post});
    });
  });
});


// edit Comment
router.put('/:postId/:commentId',(req, res) =>{

  // CHECK SIGNIN STATUS
  if(typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: "NOT SIGNED IN",
      code: 1
    });
  }
  if(!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 2
    });
  }
  if(req.body.comment === "") {
    return res.status(400).json({
      error: "EMPTY CONTENTS",
      code: 3
    });
  }

  posts.findById(req.params.postId,(err, post) =>{
    if(err) return res.status(500).json({
      error: 'DATABASE FAILURE',
      code: 4
    });

    if(!post){
      return res.status(404).json({
        error: "NO RESOURCE",
        code: 5
      });
    }
    if(!req.session.loginInfo.isAdmin){
      if(post.comments.id(req.params.commentId).author != req.session.loginInfo.id){
        return res.status(403).json({
          error: 'AUTHORIZATION ERROR',
          code: 6
        })
      }
    }

    post.comments.id(req.params.commentId).comment = req.body.comment;

    post.save((err,post) => {
      if(err) return res.status(500).json({
        error: 'SAVE FAILURE',
        code: 7
      });
      return res.json({post});
    });
  });
});
// delete Comment
router.delete('/:postId/:commentId',(req, res) => {

  if(typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: "NOT SIGNED IN",
      code: 1
    });
  }
  if(!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 2
    });
  }
  posts.findById(req.params.postId,(err, post) => {
    if(err) return res.status(500).json({
      error: 'DATABASE FAILURE',
      code: 3
    });

    if(!post){
      return res.status(404).json({
        error: "NO RESOURCE",
        code: 4
      });
    }

    if(!req.session.loginInfo.isAdmin){
      if(post.comments.id(req.params.commentId).author != req.session.loginInfo.id){
        return res.status(403).json({
          error: 'AUTHORIZATION ERROR',
          code: 5
        })
      }
    }


    post.comments.id(req.params.commentId).remove();

    post.save((err,post) => {
      if(err) return res.status(500).json({
        error: 'SAVE FAILURE',
        code: 6
      });
      return res.json({post});
    });
  });
});

export default router;
