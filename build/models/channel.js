'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;

var channelSchema = new Schema({
  name: String,
  id: String,
  private: Boolean,
  participants: Array,
  type: { type: String, default: 'CHANNEL' },
  channelID: String
});

exports.default = _mongoose2.default.model('channel', channelSchema);