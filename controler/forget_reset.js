const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../models/schema");
const sendmail = require("../utilits/sendmail")
const OTP = require("../models/otp")

const forgetPassword = async (req,res) => {
    try{
     const {email}=req.body
     
     //email check 
     if(!email){
        console.log("invalid email")
       return res.status(400).json({
           message:"invalid_email"
        })
     }

     //user check 
     const user = await auth.findOne({email})
         if(!user){
           return res.status(400).json({
                message:"invalid_user"

            })
         }

         //otp generete

         const generete_otp = Math.floor(
            1000000+Math.random()*9000000

         )
         console.log("genereted_otp is ",generete_otp)
         
         //otp expiry
         const expiry = new Date(
            Date.now()+2*60*1000
         )
         console.log("otp expires at 2 mins")


       //otp save 

       const otp_save = await OTP.create({
        email,
        otp:generete_otp.toString(),
        expiresAt:expiry

       })
        await sendmail(
            email,
            "reset passwords otp",
          `<p>your otp for reset password is</p>
          <br/>
          <h1><strong>${generete_otp}</strong></h1>
          `

        )
       return res.status(200).json("otp sent succesfully")


    }
    catch(error){
         console.log(error)
         return res.status(500).json({
            message:error.message
         })

    }

    }
    module.exports = 
    forgetPassword
