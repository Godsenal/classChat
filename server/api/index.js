import express from 'express';

import account from './account';
import post from './post';


const router = express.Router();

//data contests 배열에 첫값부터 차례로 실행. 결국 return값은 모든 값이 들어가 있는 배열이 될 것.
//reduce의 두 번째 값은 초기값. 즉, 초기값인 empty 객체에 저장.



router.use('/*', (req, res, next) => {
  next();
});



router.use('/account', account);
router.use('/post', post);


export default router;
