import config from './config';
import mongoose from 'mongoose';
import api from './api';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';



var db = mongoose.connection;
db.on('error', console.error);
db.once('open', function(){
  console.log('Connected to mongod server');
});

mongoose.Promise = require('bluebird');
mongoose.connect(config.dbUrl);

const server = express();
server.use(bodyParser.json());

server.use(session({
  secret: 'Godsenal!3737',
  resave: false,
  saveUninitialized: true
}));

server.use(sassMiddleware({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public'),
}));

server.use('/', express.static(path.join(__dirname, './../public'))); // 정적인 페이지 로드

server.use('/api',api);

server.get('*', (req,res)=>{
  //req.params.contestId에 따라 다른 페이지를 만들어야함. route일 땐 undefined
  res.sendFile(path.resolve(__dirname, './../public/index.html'));

});





server.listen(config.port, config.host, () => {
  console.info('Express listening on port', config.port);
});
