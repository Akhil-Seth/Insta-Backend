const mongoose = require('mongoose');
const schema = mongoose.Schema;

const postSchema = new schema({
    title : {
        type : String ,
        required : true
    },
    content : {
        type : String ,
        required : true
    },
    creator : {
        type : schema.Types.ObjectId ,
        ref : 'userApi',
        required : true
    },
    imageUrl : {
        type : String ,
        required : true
    },
    name : {
        type : String ,
        required : true
    }
} , {timestamps : true});

module.exports = mongoose.model('post' , postSchema);