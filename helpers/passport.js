let User = require('../models/User')
let passport = require('passport')
let FacebookStrategy = require('passport-facebook')

// aqui va la 2da (facebook)
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/callback/facebook/",
  profileFields: ["picture", "displayName", "email"]
},
function(accessToken, refreshToken, profile, cb) {
  User.findOne({facebookId:profile._json.id})
  .then(user=>{
    if(!user) {
      let u = {
        username: profile._json.name,
        email: profile._json.email,
        photoURL: profile.photos[0].value,
        facebookId: profile.id
      }
      return User.create(u)
    }
    cb(null, user)
  })
  .then(newUser=>{
    cb(null, newUser) //lol
  })
  .catch(e=>cb(e))
}
));

//
passport.use(User.createStrategy()) //primer estrategia (local)


passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

module.exports = passport