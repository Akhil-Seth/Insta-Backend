const { validationResult } = require('express-validator');

const fs = require('fs');
const path = require('path');
const socket = require('../socket');

const Post = require('../models/post');
const Register = require('../models/auth');






























exports.postProfile = (req , res , next) => {
    const id = req.body.id ;
    // console.log(id);
    // console.log('id');
    Register.findById(id)
    .then(result =>{
        // console.log(result);
        // console.log(result.posts.post);
        res.status(200).json({ 
            name : result.name ,
            image  : result.image ,
            bio : result.bio ,
            same : true ,
            postNo : result.posts.post.length ,
            following : result.followings.following.length ,
            posts : result.posts.post ,
            follow :result.followers.follower.length
        })
    }).
    catch(err => {
             console.log(err);
             res.status(422).json({ 
                message : err 
            })
        });
}

exports.postSearch = (req , res , next) => {
    const email = req.body.email ;
    // console.log(email);
    Register.findOne( { email : email})
    .then(result =>{
        // console.log(result);
        // console.log(result.posts.post);
        res.status(200).json({ 
            name : result.name ,
            image  : result.image ,
            bio : result.bio ,
            id : result._id ,
            same : false ,
            postNo : result.posts.post.length ,
            following : result.followings.following.length ,
            posts : result.posts.post ,
            follow :result.followers.follower.length
        })
    }).
    catch(err => {
             console.log(err);
             res.status(422).json({ 
                message : err 
            })
        });
}

exports.postPost = (req , res , next) => {
    const title = req.body.title;
    const image = req.body.image;
    const id = req.body.id;
    const post = new Post( { 
      title : title ,
      id : id , 
      image : image
  });
  let user ;
  let postId ;
  
//   post.save()
//   .then(result => {
//     postId = result._id ;
//     return Register.findById(id).then(resul => {

//     })
//   }).then(result => {res.status(201).json({ message: 'Post Added'});});
post.save()
  .then(result => {
    postId = result._id;
    return Register.findById(id);
  })
  .then(user => {
    if (!user) {
      throw new Error('User not found');
    }
    if (!Array.isArray(user.posts.post)) {
        user.posts.post = [];
      }
    user.posts.post.push({ postId: postId, title: title , image : image });
    return user.save();
  })
  .then(result => {
    res.status(201).json({ message: 'Post Added' });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ message: 'Failed to add post' });
  });
  }


//   exports.postFlw = (req , res , next) => {
//     const id = req.body.id;
//     const send = req.body.send;

//     try {
//         const [userId, sendId] = await Promise.all([
//           Register.findById(id),
//           Register.findById(send)
//         ]);

//         Register.findById(id).then(result => {
//             userId.followings.following.push({ id: send, name: sendId.name })
//             return userId.save();
//         }).then( result => {
//             Register.findById(send).then(result => {
//                 sendId.followers.followers.push({ id: id, name: userId.name })
//                 return userId.save();
//             })
//         })

        
//         res.status(200).json({ message: 'Users followed each other successfully' });
//       } catch (error) {

//         console.error(error);
//         res.status(500).json({ error: 'Failed to follow users' });
//       }
//   }

// exports.postFlw = async (req, res, next) => {
//     const id = req.body.id;
//     const send = req.body.send;
//     console.log(id);
//     console.log(send);
//     try {
//       const [userId, sendId] = await Promise.all([
//         Register.findById(id),
//         Register.findById(send)
//       ]);
//       console.log(userId);
//       console.log(sendId);
//       userId.followings.following.push({  name: sendId.name });
//       await userId.save();
//       sendId.followers.follower.push({  name: userId.name });
//       await sendId.save();
  
//       res.status(200).json({ message: 'Users followed each other successfully' });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Failed to follow users' });
//     }
//   };

exports.postFlw = async (req, res, next) => {
    const id = req.body.id;
    const send = req.body.send;

    try {
      const [userId, sendId] = await Promise.all([
        Register.findById(id),
        Register.findById(send)
      ]);

      if (!userId || !sendId) {
        return res.status(404).json({ error: 'User not found' });
      }

      await Register.findByIdAndUpdate(id, { $push: { 'followings.following': { name: sendId.name } } });
      await Register.findByIdAndUpdate(send, { $push: { 'followers.follower': { name: userId.name } } });

      res.status(200).json({ message: 'Users followed each other successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to follow users' });
    }
};
  