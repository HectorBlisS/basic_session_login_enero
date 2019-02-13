exports.isRole = function(role){
  return (req,res,next)=>{
    if(req.user.role === role) next()
    else res.send("Tu no eres " + role)
  }
}
