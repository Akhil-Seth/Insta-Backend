const { body } = require('express-validator');

const express = require('express');
const feedController = require('../controller/feed');
const isAuth = require('../middleWare/isAuth');

const router = express.Router();

router.get('/post' , isAuth , feedController.getPost);
router.get('/post/:postID' , isAuth , feedController.getPostId);
router.put('/post/:postID' , isAuth , feedController.updatePost);
router.delete('/post/:postID' , isAuth , feedController.deletePost);
router.post('/post' , isAuth , [
    body('title').trim().isLength({min : 5}) ,
    body('content').trim().isLength({min : 5}) ,
    ] ,  feedController.createPost);

module.exports = router;