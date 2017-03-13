'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _post = require('../models/post');

var _post2 = _interopRequireDefault(_post);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/home', function (req, res) {
  _post2.default.find({}, null, { sort: { published_date: -1 } }, function (err, post) {
    if (err) return res.status(500).json({
      error: 'DATABASE FAILURE',
      code: 1
    });
    res.json({ post: post });
  });
});
router.get('/notice', function (req, res) {
  _post2.default.find({ 'type': 'notice' }, null, { sort: { published_date: -1 } }, function (err, post) {
    if (err) return res.status(500).json({
      error: 'DATABASE FAILURE',
      code: 1
    });

    res.json({ post: post });
  });
});
router.get('/:postId', function (req, res) {
  _post2.default.findOne({ _id: req.params.postId }, function (err, post) {
    if (err) return res.status(500).json({
      error: 'DATABASE FAILURE',
      code: 1
    });
    res.json({ post: post });
  });
});

/* Edit 부분.. 충격적인 사실 - Mongoose 쓰는 거랑 그냥 mongo랑 속도차이가 남. Mongoose가 빠름*/
router.put('/:postId', function (req, res) {
  _post2.default.findById(req.params.postId, function (err, post) {
    if (req.session.loginInfo === undefined) {
      return res.status(403).json({ error: 'No Authorization!' });
    }

    post.title = req.body.title;
    post.contents = req.body.contents;

    post.save(function (err, post) {
      if (err) throw err;
      return res.json({ post: post, success: true });
    });
  });
});

router.delete('/:postId', function (req, res) {
  _post2.default.remove({ _id: req.params.postId }, function (err) {
    if (err) return res.status(500).json({
      error: 'DATABASE FAILURE',
      code: 1
    });
    return res.json({ success: true });
  });
});

router.post('/:type', function (req, res) {
  var post = new _post2.default({
    'type': req.params.type,
    'author': req.body.author,
    'authorNickname': req.body.authorNickname,
    'title': req.body.title,
    'contents': req.body.contents
  });

  post.save(function (err) {
    if (err) throw err;
    return res.json({ post: post });
  });
});

router.get('/search/:searchWord', function (req, res) {
  _post2.default.find({ $or: [{ 'title': { $regex: req.params.searchWord, $options: 'i' } }, { 'contents': { $regex: req.params.searchWord, $options: 'i' } }] }, null, { sort: { published_date: -1 } }, function (err, posts) {
    if (err) throw err;

    if (!posts) return res.status(404).json({
      error: 'NO RESOURCE',
      code: 1
    });
    return res.json({ posts: posts });
  });
});

exports.default = router;