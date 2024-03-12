// const Register = require('../models/register');

const { body } = require('express-validator');

const authController = require('../controller/feed');
const express = require('express');
const isAuth = require('../middleWare/isAuth')

const Auth = require('../models/auth');
const Token = require('jsonwebtoken');









const router = express.Router();

router.post('/myProfile'  , authController.postProfile);
router.post('/search'  , authController.postSearch);
router.post('/addPost'  , authController.postPost);
router.post('/followReq'  , authController.postFlw);


module.exports = router;