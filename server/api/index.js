import express from 'express';
import config from '../config';

const router = express.Router();



//data contests 배열에 첫값부터 차례로 실행. 결국 return값은 모든 값이 들어가 있는 배열이 될 것.
//reduce의 두 번째 값은 초기값. 즉, 초기값인 empty 객체에 저장.

router.get('/', (req, res) => {
  res.send({'id':'hello'});
});

router.get('/home', (req, res)=> {
  res.send('home');
});
router.get('/notices',(req, res) => {
  res.send('Hello');
});
router.get('/news',(req, res) => {
  res.send('home');
});
router.get(':postId',(req, res) =>{
  res.send({'id':'hello'});
});
router.post('/:postId',(req, res) => {
  res.send('home');
});





export default router;
