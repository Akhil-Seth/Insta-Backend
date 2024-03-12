const { validationResult } = require('express-validator');

const fs = require('fs');
const path = require('path');
const socket = require('../socket');

const Register = require('../models/auth');
const Token = require('jsonwebtoken');











exports.getAuth = (req , res , next) => {
    Auth.find()
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

exports.getInfo = (req , res , next) => {
  const userId = req.params.userId;
  Register.findById(userId)
  .then(user =>{
      res.status(200).json({
          message : "get succesfull",
          user : user ,
          email : "sagar963seth@gmail.com" ,
          password : "Akhil",
          status : "200",
          name : "Akhil" 
      })
  })
}

// exports.getRegister = (req , res , next) => {
//   Register.find()
//           .then(result => {
//             console.log(result);
//             res.status(200).json({
//               message : "get succesfull",
//               result : result ,
//               status : "200"
//           })
//           })
// }


exports.getDeleteReg = (req , res , next) => {
  const id = req.params.id;
  console.log(id);
      Register.findById(id.toString())
  .then(register => {
      return Register.findByIdAndDelete(register._id);
  })
  .then(result => {
      res.status(200).json({message : 'Deleted Register'});
  })
  .catch(err => {
      if(!err.statusCode){ 
          err.statusCode = 500;
      }
      next(err);
  });
}


exports.postLogIn = (req , res , next) => {
    const email = req.body.email;
    const password = req.body.password;
    let constUser;
    console.log(email);
    Register.findOne({email : email})
    .then(result => {
      console.log(result);
        constUser = result;
        if( password === result.password) {
          return true ;
        } else {
          return false;
        }
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
      res.status(200).json({ token : token ,userId : constUser._id.toString()});
    })
    .catch(errors =>{
        if(!errors){
                err.statusCode = 500;
            }
            next(errors);
    });
}

exports.postRegister = (req , res , next) => {
  const name = req.body.name;
  const password = req.body.password;
  const email = req.body.email;
  const image = req.body.image;
  let savedUser;
  console.log(`${name } = name`);
  const newRegister = new Register( {
    name : name ,
    password : password , 
    email : email ,
    image : image
});
newRegister.save().then(result => {res.status(201).json({ message: 'User created'});});
}



