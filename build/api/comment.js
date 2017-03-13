'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _post = require('../models/post');

var _post2 = _interopRequireDefault(_post);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// add Comment
router.post('/:postId', function (req, res) {
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: "NOT SIGNED IN",
      code: 1
    });
  }
  if (typeof req.body.comment !== 'string') {
    return res.status(400).json({
      error: "CONTENTS TYPE ERROR",
      code: 2
    });
  }

  if (req.body.comment === "") {
    return res.status(400).json({
      error: "EMPTY CONTENTS",
      code: 3
    });
  }

  _post2.default.findById(req.params.postId, function (err, post) {
    if (err) throw err;

    var comment = {
      author: req.body.author,
      authorNickname: req.body.authorNickname,
      comment: req.body.comment
    };

    post.comments.push(comment);

    post.save(function (err, post) {
      if (err) throw err;
      return res.json({ post: post });
    });
  });
});

// edit Comment
router.put('/:postId/:commentId', function (req, res) {

  // CHECK SIGNIN STATUS
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: "NOT SIGNED IN",
      code: 1
    });
  }
  if (!_mongoose2.default.Types.ObjectId.isValid(req.params.commentId)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 2
    });
  }
  if (req.body.comment === "") {
    return res.status(400).json({
      error: "EMPTY CONTENTS",
      code: 3
    });
  }

  _post2.default.findById(req.params.postId, function (err, post) {
    if (err) return res.status(500).json({
      error: 'DATABASE FAILURE',
      code: 4
    });

    if (!post) {
      return res.status(404).json({
        error: "NO RESOURCE",
        code: 5
      });
    }
    if (!req.session.loginInfo.isAdmin) {
      if (post.comments.id(req.params.commentId).author != req.session.loginInfo.id) {
        return res.status(403).json({
          error: 'AUTHORIZATION ERROR',
          code: 6
        });
      }
    }

    post.comments.id(req.params.commentId).comment = req.body.comment;

    post.save(function (err, post) {
      if (err) return res.status(500).json({
        error: 'SAVE FAILURE',
        code: 7
      });
      return res.json({ post: post });
    });
  });
});
// delete Comment
router.delete('/:postId/:commentId', function (req, res) {

  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: "NOT SIGNED IN",
      code: 1
    });
  }
  if (!_mongoose2.default.Types.ObjectId.isValid(req.params.commentId)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 2
    });
  }
  _post2.default.findById(req.params.postId, function (err, post) {
    if (err) return res.status(500).json({
      error: 'DATABASE FAILURE',
      code: 3
    });

    if (!post) {
      return res.status(404).json({
        error: "NO RESOURCE",
        code: 4
      });
    }

    if (!req.session.loginInfo.isAdmin) {
      if (post.comments.id(req.params.commentId).author != req.session.loginInfo.id) {
        return res.status(403).json({
          error: 'AUTHORIZATION ERROR',
          code: 5
        });
      }
    }

    post.comments.id(req.params.commentId).remove();

    post.save(function (err, post) {
      if (err) return res.status(500).json({
        error: 'SAVE FAILURE',
        code: 6
      });
      return res.json({ post: post });
    });
  });
});

exports.default = router;