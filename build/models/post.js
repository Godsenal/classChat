'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var commentSchema = new Schema({
  author: String,
  authorNickname: String,
  comment: String,
  published_date: { type: Date, default: Date.now }
});

var postSchema = new Schema({
  type: String,
  author: String,
  authorNickname: String,
  title: String,
  contents: String,
  comments: [commentSchema],
  published_date: { type: Date, default: Date.now }
});

exports.default = _mongoose2.default.model('post', postSchema);