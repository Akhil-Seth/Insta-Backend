const { body } = require('express-validator');

const authController = require('../controller/auth');
const express = require('express');
const isAuth = require('../middleWare/isAuth')

const Auth = require('../models/auth');


const router = express.Router();

router.get('/' , isAuth , authController.getAuth);
router.put('/signUp' , isAuth , [
    body('email')
    .isEmail()
    .withMessage('Enter Correct EMail')
    .custom((value , { req } ) => {
        return Auth.find({ 'email ' : value})
               .then(user => {
                if(user) {
                    return Promise.reject('Email exist');
                }
               })
    }).normalizeEmail() ,
    body('password').trim().isLength({ min : 5}),
    body('name').trim().isLength({ min : 5})
] , authController.putSignUp);
router.post('/login' , isAuth , authController.postLogIn);
router.get('/status', isAuth, authController.getUserStatus);
router.patch(
  '/status',
  isAuth,
  [
    body('status')
      .trim()
      .not()
      .isEmpty()
  ],
  authController.updateUserStatus
);

module.exports = router;