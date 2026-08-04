const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const connectDB = require("./config/connection")
const auth = require("./models/schema");
connectDB()
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
const admin = async(req,res)=>{
 const kundan = await auth.findOneAndUpdate({
    email:"kundan@gmail.com"//FIRST WE WRITE KISKO DHUNDHNA HAI 
 },
 {
    role:"admin"
 },
 { returnDocument: "after"},
)

}
admin()

app.use(express.json());
app.use(cookieParser());




// Home
app.get("/", (req, res) => {
    res.send("Home Page");
});


// Signup
app.post("/signup",async(req,res)=>{
  try{

    const {userName,email,passWord}=req.body
    const holomolo = await bcrypt.hash(passWord,10)
    const signUp= await auth.create({
        userName,
        email,
        passWord:holomolo
    })
    console.log(signUp)
   return res.status(200).send("Signup succesfully")
   
}
catch(error){
    console.log("error hai bhai ")
}

})
app.post("/login",async(req,res)=>{
    console.log("route hit ")
    const {email,passWord}=req.body
    if(!email||!passWord){
       return res.status(400).send("email and password is required")
    }
    const login = await auth.findOne({
        email
    })
    if(!login){
        return res.status(404).send("invalid email")
    }
    const match = await bcrypt.compare(
        passWord,
        login.passWord
    )
    console.log(match)
    if(!match){
       return res.status(404).send("invalid password")
    }
    /*res.cookie("token","abcd1234",{
        httpOnly:true,
    })
     console.log("login succesfull")
    res.send("login succesfull")
   */ 
  const token =jwt.sign(

    {id:login._id,
        role:login.role
    },


"mysecretkey"
)
res.cookie("jwtToken",token,{
       httpOnly: true
})
 return res.status(200).json({
    message: "Login Successful"
 })
})

const authMiddlewear= async(req,res,next)=>{
    const token= req.cookies.jwtToken
    if(!token){
        return res.status(401).send("please login first")
    }
    const verify=jwt.verify(token,"mysecretkey")
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



app.get ("/profile",authMiddlewear,async(req,res)=>{
     res.json(req.user)
})



app.get("/user",authMiddlewear,authorization,async(req,res)=>{
    const get= await auth.find()
    res.json(get)
})
app.delete("/delete/:id",authMiddlewear,authorization,async(req,res)=>{
    //res.json(req.user)
    const deleted_user= await auth.findByIdAndDelete(req.params.id)
      if(!deleted_user){
       return res.status(400).json("user is not deleted")
      }
      res.json(`deleted user ${deleted_user}`)
    })


 
app.listen(8000, () => {
    console.log("Server Running At 8000");
});