let mongoose = require('mongoose')
let Schema = mongoose.Schema

let postSchema = new Schema({
  caption: {
    type: String,
    required:true
  },
  picture: String,
  likes: Number,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
},{timestamps:true})

module.exports = mongoose.model('Post', postSchema)