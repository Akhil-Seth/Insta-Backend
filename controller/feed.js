const { validationResult } = require('express-validator');

const fs = require('fs');
const path = require('path');
const socket = require('../socket');

const Auth = require('../models/auth');
const Post = require('../models/post');



exports.getPost = (req , res , next) => {
    const currentPage = req.query.page;
    const perPage = 10;
    let totalItems;
    Post.find()
    .sort( { createdAt : -1 })
    .countDocuments()
    .then(count => {
        totalItems = count;
        return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then(posts => {
        res.status(200).json({
            message : "Get successFull",
            posts : posts,
            totalItems : totalItems
        });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.getPostId = (req , res , next) => {
    const postId = req.params.postID;
    Post.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error("Post Not Found");
            error.statusCode = 422;
             throw error;
        }
        res.status(200).json({
            message : "Get single post successFull",
            post : post
        });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.createPost = (req , res , next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty){
        const error = new Error("Input Error");
        error.statusCode = 422;
        throw error;
    }
    if(!req.file) { 
        const error = new Error("No Images");
        error.statusCode = 422;
        throw error;
    }
    let ccc ;
    Auth.findById(req.userId)
        .then(user => {
            ccc = user.name.toString();
        })
        .catch(err => {
            console.log(`err = ${err}`);
        })
    const title = req.body.title;
    const desc = req.body.content;
    const imageUrl = req.file.path;
    let creator;
    const userId = req.userId;
    let imageUu = imageUrl.replace(`\\` , '/');
    const post  = new Post( {
        title : title ,
        content : desc ,
        imageUrl : imageUu ,
        creator : req.userId,
        name : 'Anonymous User'
    });
    post.save()
    .then(result => {
        return Auth.findById(userId);
    })
    .then(user => {
        creator = user ;
        user.posts.push(post);
        return user.save();
    })
    .then(result => {
        socket.getIO().emit('sendPost' , { actionName : 'sendingPostByUser' , post : { ...post._doc, creator: { _id: req.userId, name: creator.name }}});
        res.status(200).json({
            message : "Post successFull",
            post : post ,
            creator : {
                _id : creator._id ,
                name : ccc
            }
        });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

exports.updatePost = (req , res , next) => {
    const postId = req.params.postID;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.imageUrl;
    let creator;
    Auth.findById(req.userId)
        .then(user => {
            creator = user ;
        })
    Post.findById(postId)
        .then(post => {
            if(post.creator.toString() !== req.userId) {
                const error = new Error("Not allowed to update");
                error.statusCode = 403;
                throw error;
            }
        }).catch(error => {
            if(!error){
                error.statusCode = 500;
            }
            next(error);
        });

    if(req.file){
        imageUrl = req.file.path;
    }
    if(!imageUrl){
        const error = new Error("No Images for update");
        error.statusCode = 422;
        throw error;
    }
    let postsEdit ;
    Post.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error("No post for update");
            error.statusCode = 422;
            throw error;
        }
        if(imageUrl !== post.imageUrl){
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        post.save()
        postsEdit = post;
    })
    .then(result => {
        socket.getIO().emit('sendPost' , { actionName : 'editingPostByUser' , post : postsEdit
        });
        res.status(200).json({ post : result});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}

const clearImage = filePath => {
    filePath = path.join(__dirname , '..' , filePath);
    fs.unlink(filePath , err => {console.log(err)})
}

exports.deletePost = (req , res , next) => {
    const postId = req.params.postID;

    Post.findById(postId)
        .then(post => {
            if(post.creator.toString() !== req.userId) {
                const error = new Error("Not allowed to delete");
                error.statusCode = 403;
                throw error;
            }
        }).catch(error => {
            if(!error){
                error.statusCode = 500;
            }
            next(error);
        });

    Post.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error("No post for delete");
            error.statusCode = 422;
            throw error;
        }
        socket.getIO().emit('sendPost' , { actionName : 'deletePostByUser' , post : postId
        });
        clearImage(post.imageUrl);
        return Post.findByIdAndDelete(post._id);
    })
    .then(result => {
        res.status(200).json({message : 'Deleted Post', post : result});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    });
}