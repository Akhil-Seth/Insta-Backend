// const Register = require('../models/register');

const { body } = require('express-validator');

const authController = require('../controller/auth');
const express = require('express');
const isAuth = require('../middleWare/isAuth')

const Auth = require('../models/auth');
const Token = require('jsonwebtoken');








const router = express.Router();

router.get('/'  , authController.getAuth);
router.post('/login' , authController.postLogIn);
router.post('/register'  , authController.postRegister);

// router.get('/searchInfo/:userId'  , authController.getInfo);
// router.get('/registerFetch'  , authController.getRegister);
// router.post('/registerFetchOne'  , authController.postRegisterOne);
// router.get('/deleteReg/:id'  , authController.getDeleteReg);


module.exports = router;