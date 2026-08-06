const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../models/schema");
const sendmail = require("../utilits/sendmail")


const signup = async (req,res) => {
    console.log("signup hit ")

        try{
      

    const {userName,email,passWord}=req.body
     if (!userName || !email || !passWord) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

    const holomolo = await bcrypt.hash(passWord,10)
    const signUp= await auth.create({
        userName,
        email,
        passWord:holomolo
    })
       await sendmail(
        "upadhyayakundan326@gmail.com",
    "Testing",
       `<h1>hello </h1>
       <hr/>
       <h2>${signUp.userName} thankyou for joining<h2>
       `
      
       )
    console.log("signUp succesfully")
   return res.status(200).send("Signup succesfully")

   
}
catch(error){
    console.log(error
    )
    res.json({
        message:error.message
    })
}

}
//app.post("/login",async(req,res)=>{
   // console.log("route hit ")
   const login = async(req,res) => {
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
    process.env.SECRET_KEY
)
res.cookie("jwtToken",token,{
       httpOnly: true
})
 return res.status(200).json({
    message: "Login Successful"
 })
}

 



//app.get ("/profile",authMiddlewear,async(req,res)=>{
    const profile =(req,res)=>{
    res.json(req.user)
}



//app.get("/user",authMiddlewear,authorization,async(req,res)=>{
    
    const getUser=async(req,res)=>{
    const get= await auth.find()
    res.json(get)
}
//app.delete("/delete/:id",authMiddlewear,authorization,async(req,res)=>{
    //res.json(req.user)
   const deletedUser=async(req,res)=>{ const deleted_user= await auth.findByIdAndDelete(req.params.id)
      if(!deleted_user){
       return res.status(400).json("user is not deleted")
      }
      res.json(`deleted user ${deleted_user}`)
    }
    module.exports={
        signup,
        login,
        getUser,
        deletedUser,
        profile
    
    }


 




