'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/:type/:url/:name', function (req, res) {
  var path;
  var name = req.params.name;
  path = './public/files/' + req.params.url;
  res.download(path, name); // Set disposition and send it.
});

exports.default = router;