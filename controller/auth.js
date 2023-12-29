const { validationResult } = require('express-validator');

const bcypt = require('bcryptjs');

const Auth = require('../models/auth');
const Post = require('../models/post');
const Token = require('jsonwebtoken');








exports.getAuth = (req , res , next) => {
    Post.find()
    .then(posts =>{
        res.status(200).json({
            message : "get succesfull",
            email : "sagar963seth@gmail.com" ,
            password : "Akhil",
            status : "200",
            name : "Akhil" ,
            posts : posts
        })
    }).
    catch(err => {
             const error = new Error("Kuch to error hai");
             error.statusCode = 422;
             throw error;
        });
}

exports.putSignUp = (req , res , next) => {
    const errors = validationResult(req);
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    if(!errors.isEmpty){
        const error = new Error("Input Error");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    bcypt.hash(password , 12)
         .then(result => {
            const newUser = new Auth( {
                email : email ,
                password : result ,
                name : name
            });
            return newUser.save();
         }).then(result => {
            res.status(201).json({message : 'User created' , userId : result._id });
         })
         .catch(err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
         });

    // Post.find()
    // .then(posts =>{
    //     res.status(200).json({
    //         message : "get succesfull",
    //         email : "sagar963seth@gmail.com" ,
    //         password : "Akhil",
    //         status : "200",
    //         name : "Akhil" ,
    //         posts : posts
    //     })
    // }).
    // catch(err => {
    //          console.log(err);
    //          const error = new Error("Kuch to error hai");
    //          error.statusCode = 422;
    //          throw error;
    //     });
}

exports.postLogIn = (req , res , next) => {
    const email = req.body.email;
    const password = req.body.password;
    let constUser;
    Auth.findOne({email : email})
    .then(result => {
        if(!result){
                const error = new Error("AkhilGreat");
                error.statusCode = 401;
                throw error;
        }
        constUser = result;
        return bcypt.compare(password, result.password);
    }).then(isEqual => {
        if(!isEqual){
            const error = new Error("Wrong Password");
            error.statusCode = 401;
            throw error;
        }
        const token = Token.sign({
            email : constUser.email,
            id : constUser._id.toString()
        } , 'AkhilGreat' , {
            expiresIn : '1h'
        });
        res.status(200).json({ token : constUser._id.toString() ,userId : constUser._id.toString()});
    })
    .catch(errors =>{
        if(!errors){
                err.statusCode = 500;
            }
            next(errors);
    });
}

exports.getUserStatus = async (req, res, next) => {
    try {
      const user = await Auth.findById(req.userId);
      if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
      }
      res.status(200).json({ status: user.status });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  
  exports.updateUserStatus = async (req, res, next) => {
    const newStatus = req.body.status;
    try {
      const user = await Auth.findById(req.userId);
      if (!user) {
        const error = new Error('User not found.');
        error.statusCode = 404;
        throw error;
      }
      user.status = newStatus;
      await user.save();
      res.status(200).json({ message: 'User updated.' });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };