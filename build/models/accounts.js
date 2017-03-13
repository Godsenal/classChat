'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var accountSchema = new Schema({
  id: String,
  password: String,
  nickname: String,
  created: { type: Date, default: Date.now },
  isAdmin: { type: Boolean, default: false }
});

exports.default = _mongoose2.default.model('account', accountSchema);