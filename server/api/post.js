import posts from '../models/post';
import express from 'express';

const router = express.Router();



router.get('/home', (req, res)=> {
  posts.find({},null, {sort: {published_date: -1}},(err, post) => {
    if(err) return res.status(500).json({
      error: 'DATABASE FAILURE',
      code: 1
    });
    res.json({post});
  });
});
router.get('/notice',(req, res) => {
  posts.find({'type': 'notice'},null, {sort: {published_date: -1}},(err, post) => {
    if(err) return res.status(500).json({
      error: 'DATABASE FAILURE',
      code: 1
    });

    res.json({post});
  });
});
router.get('/:postId',(req, res) =>{
  posts.findOne({_id:req.params.postId},(err, post) =>{
    if(err) return res.status(500).json({
      error: 'DATABASE FAILURE',
      code: 1
    });
    res.json({post});
  });
});

/* Edit 부분.. 충격적인 사실 - Mongoose 쓰는 거랑 그냥 mongo랑 속도차이가 남. Mongoose가 빠름*/
router.put('/:postId',(req, res) =>{
  posts.findById(req.params.postId, (err, post) => {
    if(req.session.loginInfo === undefined){
      return res.status(403).json({error : 'No Authorization!',});
    }

    post.title = req.body.title;
    post.contents = req.body.contents;

    post.save((err, post) => {
      if(err) throw err;
      return res.json({post, success: true});
    });
  });
});

router.delete('/:postId',(req, res) => {
  posts.remove({_id:req.params.postId},(err) => {
    if(err) return res.status(500).json({
      error: 'DATABASE FAILURE',
      code: 1
    });
    return res.json({success: true});
  });
});

router.post('/:type',(req, res) => {
  var post = new posts({
    'type':req.params.type,
    'author':req.body.author,
    'authorNickname':req.body.authorNickname,
    'title':req.body.title,
    'contents':req.body.contents,
  });

  post.save( err => {
    if(err) throw err;
    return res.json({post});
  });

});

router.get('/search/:searchWord',(req, res) => {
  posts.find({$or:[{'title': {$regex : req.params.searchWord, $options: 'i'}},
     {'contents': {$regex : req.params.searchWord, $options : 'i'}}]},
      null,
      {sort: {published_date: -1}},
      (err, posts) => {
        if(err) throw err;

        if(!posts)
          return res.status(404).json({
            error: 'NO RESOURCE',
            code: 1
          });
        return res.json({posts});
      }
  );
});


export default router;
