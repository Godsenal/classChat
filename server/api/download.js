import express from 'express';

const router = express.Router();


router.get('/:type/:url/:name', function(req, res){
  var path;
  var name = req.params.name;
  path = `./public/files/${req.params.url}`;
  res.download(path,name); // Set disposition and send it.
});

export default router;
