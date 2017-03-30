'use strict';

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _socketEvents = require('./socketEvents');

var _socketEvents2 = _interopRequireDefault(_socketEvents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MongoStore = require('connect-mongo')(_expressSession2.default);
//import sassMiddleware from 'node-sass-middleware';


var db = _mongoose2.default.connection;
db.on('error', console.error);
db.once('open', function () {
  console.log('Connected to mongod server');
});

_mongoose2.default.Promise = require('bluebird');
_mongoose2.default.connect(_config2.default.dbUrl);

var app = (0, _express2.default)();

app.use(_bodyParser2.default.json());

app.use((0, _expressSession2.default)({
  secret: 'Godsenal!3737',
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({
    url: _config2.default.dbUrl,
    ttl: 60 * 60 // 1 days (default: 14days)
  })
}));
/*
app.use(sassMiddleware({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public'),
}));
*/

app.use('/', _express2.default.static(_path2.default.join(__dirname, './../public'))); // 정적인 페이지 로드

app.use('/api', _api2.default);

app.get('*', function (req, res) {
  //req.params.contestId에 따라 다른 페이지를 만들어야함. route일 땐 undefined
  res.sendFile(_path2.default.resolve(__dirname, './../public/index.html'));
});

var server = app.listen(_config2.default.port, function () {
  console.info('Express listening on port', _config2.default.port);
});

var io = require('socket.io').listen(server);
(0, _socketEvents2.default)(io);

//const io = require('socket.io')(server) ?