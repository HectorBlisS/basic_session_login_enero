let router = require('express').Router()
let User = require('../models/User')
let bcrypt = require('bcrypt')
let passport = require('passport')
let {isRole} = require('../helpers/middlewares')
let {sendWelcomeMail} = require('../helpers/mailer')
//config multer
//let multer = require('multer')
//let upload = multer({dest: './public/uploads'})
let uploadCloud = require('../helpers/cloudinary')

//smart middleware
// function isRole(role){
//   return (req,res,next)=>{
//     if(req.user.role === role) next()
//     else res.send("Tu no eres " + role)
//   }
// }

//esta logueado?
function isLoggedIn(req,res,next){
  //if(req.session.currentUser){
  if(req.isAuthenticated()){
    next()
  }else{
    res.redirect('/login?next=' + req.path)
  }
}

// es admin?
function isAdmin(req,res,next){
  if(req.user.role === "ADMIN"){
    next()
  }else{
    res.send("Tu no tienes permiso, ¡ushkale!")
  }
}

// mi primer middleware! =3 🥰
function isAuth(req,res,next){
  //if(req.session.currentUser){
  if(req.isAuthenticated()){
    res.redirect('/')
  }else{
    next()
  }
}


//profile 
router.post('/profile',  
  isLoggedIn, 
  uploadCloud.fields([{name:"cover", maxCount:1}, {name:"photoURL", maxCount:1}]),
  (req,res)=>{
    if(req.files.photoURL) {
      //req.body.photoURL = "/uploads/" + req.files.photoURL[0].filename
      req.body.photoURL = req.files.photoURL[0].url
    }
    if(req.files.cover) {
      req.body.cover = req.files.cover[0].url
    }
    User.findByIdAndUpdate(req.user._id, req.body)
    .then(()=>{
      res.redirect('/profile')
    })
})

router.get('/profile', isLoggedIn, (req,res)=>{
  console.log(req.user)
  res.render('auth/profile', req.user)
})

router.get('/private', isLoggedIn, isRole('ADMIN'), (req,res)=>{
  res.render("index", {admin:true})
})

router.get('/logout', (req,res)=>{
  req.logOut()
  res.redirect('/login')
})

//las rutas para facebook login

router.get('/auth/callback/facebook/', 
  passport.authenticate('facebook',  { failureRedirect: '/login' }), 
  (req,res)=>{
    if(req.query.next) res.redirect(req.query.next)
    else res.redirect('/')
})
router.get('/facebook/login', 
  passport.authenticate('facebook',{scope: ['email'] }))

router.post('/login', passport.authenticate('local'), (req,res,next)=>{
  console.log(req.query)
  if(req.query.next) res.redirect(req.query.next)
  else res.redirect('/')
  //res.redirect('/profile')


  // let {email, password} = req.body
  // User.findOne({email})
  // .then(user=>{
  //   if(!user) return res.render('auth/login', {error:"Tu ni existes"})
  //   if(bcrypt.compareSync(password, user.password)){
  //     req.session.currentUser = user
  //     res.redirect('/')
  //     return
  //   }
  //   res.render('auth/login', {error:"Tu contraseña está mal"})
    
  // })
  // .catch(e=>next(e))


})

router.get('/login', isAuth, (req,res,next)=>{
  let ctx = {}
  if(req.query.next) ctx.next = req.query.next
  res.render('auth/login', ctx)
})

router.post('/signup', (req,res,next)=>{
  if(req.body.password !== req.body.password2){
     res.render('auth/signup', {...req.body, errors:{password:"escribe bien tu contraseña sonso!"}})
     return
    }

  User.register(req.body, req.body.password)
  .then(user=>{
    sendWelcomeMail(user.username, user.email)
    res.redirect('/login')
  })
  .catch(e=>next(e))

  //encriptar el password
  // let salt = bcrypt.genSaltSync(10)
  // let hash = bcrypt.hashSync(req.body.password, salt)
  // req.body.password = hash
  // //
  // User.create(req.body)
  // .then(()=>res.redirect('/login'))
  // .catch(e=>next(e))
})

router.get('/signup', (req,res,next)=>{
  res.render('auth/signup')
})

module.exports = router