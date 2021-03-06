'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var messageSchema = new Schema({
  id: String,
  channelID: String,
  contents: String,
  types: { type: String, default: 'message' },
  url: { type: String, default: '' },
  userName: Object,
  created: { type: Date, default: Date.now }
});

exports.default = _mongoose2.default.model('message', messageSchema);