import accounts from '../models/accounts';
import express from 'express';

const router = express.Router();


router.post('/signup', (req, res) => {
    // CHECK USERNAME FORMAT
  let idForm = /^[a-zA-Z0-9]+$/;
  if(!idForm.test(req.body.id) || req.body.id < 4) {
    return res.status(400).json({
      error: 'BAD ID',
      code: 1
    });
  }
    // CHECK NICKNAME FORMAT
  if(!idForm.test(req.body.nickname)) {
    return res.status(400).json({
      error: 'BAD NICKNAME',
      code: 3
    });
  }

    // CHECK PASS LENGTH
  if(req.body.password.length < 4 || typeof req.body.password !== 'string') {
    return res.status(400).json({
      error: 'BAD PASSWORD',
      code: 2
    });
  }

    // CHECK USER EXISTANCE. if findOne finished, router finished too. <- Need to put save function inside the findOne function.
  accounts.findOne({ id: req.body.id }, (err, find) => {
    if (err) throw err;
    if(find){
      return res.status(409).json({
        error: 'ID EXISTS',
        code: 4
      });
    }
    accounts.findOne({ nickname : req.body.nickname}, (err, find) => {
      if(err) throw err;
      if(find){
        return res.status(409).json({
          error: 'NICKNAME EXISTS',
          code: 5
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
      error: 'SIGNIN FAILED',
      code: 1
    });
  }

    // FIND THE USER BY USERNAME
  accounts.findOne({ id: req.body.id}, (err, account) => {
    if(err) throw err;

        // CHECK ACCOUNT EXISTANCY
    if(!account) {
      return res.status(401).json({
        error: 'SIGNIN FAILED',
        code: 1
      });
    }

        // CHECK WHETHER THE PASSWORD IS VALID
    if(account.password !== req.body.password) {
      return res.status(401).json({
        error: 'SIGNIN FAILED',
        code: 1
      });
    }
    var isAdmin = false;

    if(account.isAdmin === true)
      isAdmin = true;
        // ALTER SESSION
    let session = req.session;
    session.loginInfo = {
      _id: account._id,
      id: account.id,
      nickname: account.nickname,
      isAdmin: isAdmin
    };

        // RETURN SUCCESS
    return res.json({
      success: true,
      nickname: account.nickname,
      isAdmin: isAdmin,
    });
  });
});

/*
    GET CURRENT USER INFO GET /api/account/getInfo
*/
router.get('/getinfo', (req, res) => {
  if(typeof req.session.loginInfo === 'undefined') {
    return res.status(401).json({
      error: 'INVALID STATUS',
      code: 1
    });
  }
  return res.json({ info: req.session.loginInfo });
});

/*
    LOGOUT: POST /api/account/logout
*/
router.post('/signout', (req, res) => {
  req.session.destroy();
  return res.json({ success: true });
});




export default router;
