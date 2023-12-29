const mongoose = require('mongoose');
const schema = mongoose.Schema;

const postSchema = new schema({
    email : {
        type : String ,
        required : true
    },
    password : {
        type : String ,
        required : true
    },
    posts : [{
        type : schema.Types.ObjectId ,
        ref : 'post'
    }],
    name : {
        type : String ,
        required : true
    },
    status : {
        type : String ,
        default : 'I am new into this site'
    }
});

module.exports = mongoose.model('userApi' , postSchema);