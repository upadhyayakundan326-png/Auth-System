const jwt = require("jsonwebtoken");
const auth = require("../models/schema");

const authMiddlewear= async(req,res,next)=>{
    const token= req.cookies.jwtToken
    if(!token){
        return res.status(401).send("please login first")
    }
    const verify=jwt.verify(token,process.env.SECRET_KEY)
    const user = await auth.findById(verify.id)
    if(!user){
       return res.status(404).json("user not found")
    }
    req.user = user
    next()
    
 }
 const authorization = async(req,res,next)=>{
     if(req.user.role!=="admin"){
        console.log("access denied")
        return res.status(404).send("aceess denied")
        
     }
     console.log("access granted")
     next()
 }
 module.exports = {
    authMiddlewear,
    authorization
 }
