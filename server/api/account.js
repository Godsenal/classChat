import accounts from '../models/accounts';
import express from 'express';

const router = express.Router();


router.post('/signup', (req, res) => {
    // CHECK USERNAME FORMAT
  let idForm = /^[a-z0-9]+$/;
  if(!idForm.test(req.body.id)) {
    return res.status(400).json({
      err: 'BAD ID',
      code: 1
    });
  }
    // CHECK NICKNAME FORMAT
  if(!idForm.test(req.body.nickname)) {
    return res.status(400).json({
      err: 'BAD NICKNAME',
      code: 3
    });
  }

    // CHECK PASS LENGTH
  if(req.body.password.length < 4 || typeof req.body.password !== 'string') {
    return res.status(400).json({
      err: 'BAD PASSWORD',
      code: 2
    });
  }

    // CHECK USER EXISTANCE
  accounts.findOne({ id: req.body.id }, (err, find) => {
    if (err) throw err;
    if(find){
      return res.status(409).json({
        err: 'ID EXISTS',
        code: 4
      });
    }

        // CREATE ACCOUNT
    let account = new accounts({
      id: req.body.id,
      password: req.body.password,
      nickname: req.body.nickname
    });


        // SAVE IN THE DATABASE
    account.save( err => {
      if(err) throw err;
      return res.json({ success: true });
    });

  });
});

/*
    ACCOUNT SIGNIN: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/
router.post('/signin', (req, res) => {
  if(typeof req.body.password !== 'string') {
    return res.status(401).json({
      err: 'SIGNIN FAILED',
      code: 1
    });
  }

    // FIND THE USER BY USERNAME
  accounts.findOne({ id: req.body.id}, (err, account) => {
    if(err) throw err;

        // CHECK ACCOUNT EXISTANCY
    if(!account) {
      return res.status(401).json({
        err: 'SIGNIN FAILED',
        code: 1
      });
    }

        // CHECK WHETHER THE PASSWORD IS VALID
    if(account.password !== req.body.password) {
      return res.status(401).json({
        err: 'SIGNIN FAILED',
        code: 1
      });
    }

        // ALTER SESSION
    let session = req.session;
    session.loginInfo = {
      _id: account._id,
      id: account.id,
      nickname: account.nickname
    };

        // RETURN SUCCESS
    return res.json({
      success: true,
      nickname: account.nickname,
    });
  });
});

/*
    GET CURRENT USER INFO GET /api/account/getInfo
*/
router.get('/getinfo', (req, res) => {
  if(typeof req.session.loginInfo === 'undefined') {
    return res.status(401).json({
      err: 1
    });
  }

  res.json({ info: req.session.loginInfo });
});

/*
    LOGOUT: POST /api/account/logout
*/
router.post('/signout', (req, res) => {
  req.session.destroy(err => { if(err) throw err; });
  return res.json({ success: true });
});




export default router;
