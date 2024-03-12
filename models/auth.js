const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default : true
  },
  followers: {
    follower: [
      {
        // id: { type: Schema.Types.ObjectId, ref: 'UserInsta', required: false },
        name : { type: String, ref: 'UserInsta', required: false }
      }
    ]
  },
  followings: {
    following: [
      {
        // id: { type: Schema.Types.ObjectId, ref: 'UserInsta', required: false },
        name : { type: String, ref: 'UserInsta', required: false }
      }
    ]
  },
  posts: {
    post: [
      {
        postId: { type: Schema.Types.ObjectId, ref: 'postInsta', required: false },
        title : { type: String, ref: 'postInsta', required: false },
        image : { type: String, ref: 'postInsta', required: false }
      }
    ]
  }
});

module.exports = mongoose.model('UserInsta', userSchema);