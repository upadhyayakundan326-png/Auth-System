const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../models/schema");
const sendmail = require("../utilits/sendmail")
const OTP = require("../models/otp")
  
const verify = async (req,res) => {
    
try{
  const {email,otp}=req.body
  if(!email||!otp){
    console.log("fields are required to verify your reset pasaword otp")
    res.status(400).json({
        message:"fields are required to verify your reset password otp"
    })
  }

}
catch(error){
    console.log(error)
    res.status(500).json({
        message:error.message
    })
}
}
