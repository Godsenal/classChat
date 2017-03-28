import config from './config';
import mongoose from 'mongoose';
import api from './api';
//import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import socketEvents from './socketEvents';
const MongoStore = require('connect-mongo')(session);


var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  console.log('Connected to mongod server');
});

mongoose.Promise = require('bluebird');
mongoose.connect(config.dbUrl);

const app = express();


app.use(bodyParser.json());

app.use(session({
  secret: 'Godsenal!3737',
  saveUninitialized: false,
  resave: false,
  store: new MongoStore({
    url: config.dbUrl,
    ttl: 60*60  // 1 days (default: 14days)
  })
}));
/*
app.use(sassMiddleware({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public'),
}));
*/




app.use('/', express.static(path.join(__dirname, './../public'))); // 정적인 페이지 로드

app.use('/api',api);

app.get('*', (req,res)=>{
  //req.params.contestId에 따라 다른 페이지를 만들어야함. route일 땐 undefined
  res.sendFile(path.resolve(__dirname, './../public/index.html'));

});





var server = app.listen(config.port, () => {
  console.info('Express listening on port', config.port);
});

var io = require('socket.io').listen(server);
socketEvents(io);


//const io = require('socket.io')(server) ?
