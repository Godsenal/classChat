const jwt = require('jsonwebtoken');
const FacebookStrategy = require('passport-facebook').Strategy;
import accounts from '../models/accounts';
import config  from '../config.js';

module.exports = new FacebookStrategy({
  clientID: '102212780353117',
  clientSecret: 'b4af484c90070f8e6d01f2b69aa868d6',
  callbackURL: `http://${config.domain}:${config.port}/api/account/facebook/callback`,
  passReqToCallback: true,
  profileFields: ['id', 'emails', 'name']
},function(req, accessToken, refreshToken, profile, cb) {
  accounts.findOne({ email: profile.emails[0].value  }, function(err, user) {
    if (err) { return cb(err); }

    const payload = {
      email: profile.emails[0].value,
      //username: user.id,
      //nickname: user.nickname,
      isSignedIn : true,
    };
    //create Token
    let data={
      type:'token'
    };
    if(user){
      if(user.email == profile.emails[0].value){
        const token = jwt.sign(payload, config.jwtSecret);
        data.data = token;
        return cb(null,data);
      }
    }
    else{
      data.type = 'email';
      data.data = profile.emails[0].value;
      return cb(null,data); // 새로운 회원 생성 후 로그인
    }

  });
});
