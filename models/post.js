const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type : Schema.Types.ObjectId,
    ref : 'UserInsta',
    required : true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('postInsta', userSchema);
