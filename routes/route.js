const express = require ("express")
const router = express.Router();
const forgetPassword = require("../controler/forget_reset")

const {
        signup,
        login,
        getUser,
        deletedUser,
        profile,
    verifyOtp}= require("../controler/controler")
    
   

const {
    authMiddlewear,authorization}= require("../middlewear/middlewear")
    
    router.post("/signup",signup)
     router.post("/verify",verifyOtp)
     router.post("/login",login)
      router.get("/profile",authMiddlewear,profile)
       router.get("/getuser",authMiddlewear,authorization,getUser)
        router.delete("/delete/:id",authMiddlewear,authorization,deletedUser)
       router.post("/forgetpassword",forgetPassword)

    module.exports= router