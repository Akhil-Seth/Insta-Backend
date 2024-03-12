const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type : Schema.Types.ObjectId,
    ref : 'UserInsta',
    required : true
  },
  Followers: {
    Follower: [
      {
        postId: { type: Schema.Types.ObjectId, ref: 'UserInsta', required: false },
        title : { type: String, ref: 'UserInsta', required: false },
        image : { type: String, ref: 'UserInsta', required: false }
      }
    ]
  },
  Follows: {
    Follow: [
      {
        postId: { type: Schema.Types.ObjectId, ref: 'UserInsta', required: false },
        title : { type: String, ref: 'UserInsta', required: false },
        image : { type: String, ref: 'UserInsta', required: false }
      }
    ]
  }
});

module.exports = mongoose.model('followInsta', userSchema);
