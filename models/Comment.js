let mongoose = require('mongoose')
let Schema = mongoose.Schema

let commentSchema = new Schema({
  post:{
    type: Schema.Types.ObjectId,
    ref: "Post"
  },
  body: String,
  photoURL: String,
  username: String
},{timestamps:true})

module.exports = mongoose.model('Comment', commentSchema)