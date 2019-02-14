let mongoose = require('mongoose')
let Schema = mongoose.Schema
//plugin "vimis instilir il pligin"
let passportLocalMongoose = require('passport-local-mongoose')

let userSchema = new Schema({
  role:{
    type: String,
    enum:["ADMIN", "GUEST", "EDITOR"],
    default: "GUEST"
  },
  username: {
    required:true,
    type:String
  },
  email: String,
  facebookId:String,
  photoURL: String,
  cover: String,
  //password: String
},{timestamps:true})

userSchema.plugin(passportLocalMongoose, {usernameField:"email"})

module.exports = mongoose.model('User', userSchema)