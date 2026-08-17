const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../models/schema");
const sendmail = require("../utilits/sendmail")
const OTP = require("../models/otp")


const signup = async (req, res) => {

    console.log("signup hit");

    try {

        const { userName, email, passWord } = req.body;

        const usernameRegex = /^[a-zA-Z]+$/;


        // ================= VALIDATION =================

        if (!userName || !email || !passWord) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        else if (!usernameRegex.test(userName)) {

            return res.status(400).json({
                message: "Username should contain only characters"
            });

        }

        else if (userName.length < 3 || userName.length > 20) {

            return res.status(400).json({
                message: "Username length should be between 3 and 20 characters"
            });

        }


        // ================= OTP GENERATE =================

        const otp = Math.floor(
            100000 + Math.random() * 900000
        );

        console.log("6 digit OTP is:", otp);


        // ================= OTP SAVE =================
const expiry = new Date(Date.now() + 3 * 60 * 1000);
console.log(expiry)

        await OTP.create({
            email: email,
            otp: otp.toString(),
            expiresAt: expiry
        });


        // ================= SEND OTP EMAIL =================

        await sendmail(
            email,
            "Your OTP",
            `
                <h2>Hey ${userName}</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP is valid for 3 minutes.</p>
            `
        );


        // ================= RESPONSE =================

        return res.status(200).json({
            message: "OTP sent successfully"
        });


    } catch (error) {

        console.log(error);

        return res.status(500).json({
            message: error.message
        });

    }
};
  //verify otp 
  const verifyOtp = async (req, res) => {

    try {

        const { userName, email, passWord, otp } = req.body;

        console.log("VERIFY BODY:", req.body);

        const otpdata = await OTP.findOne({
            email,
            otp
        });

        if (!otpdata) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (otpdata.expiresAt < new Date()) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        // OTP correct ✅
        console.log("OTP VERIFIED");

        // password hash
        const hashpassWord = await bcrypt.hash(passWord, 10);

        // user create in auth database
        const user = await auth.create({
            email,
            userName,
            passWord: hashpassWord
        });console.log("USER CREATED:", user);

        console.log("USER CREATED:", user);

        // OTP delete
        await OTP.deleteOne({
            _id: otpdata._id
        });

        return res.status(200).json({
            message: "OTP verified and signup successful"
        });

    } catch (error) {

        console.log("VERIFY ERROR:", error);

        return res.status(500).json({
            message: error.message
        });
    }
};






//app.post("/login",async(req,res)=>{
   // console.log("route hit ")
   const login = async(req,res) => {
    const {email,passWord}=req.body
     console.log("LOGIN EMAIL:", email);
    if(!email||!passWord){
       return res.status(400).send("email and password is required")
    }
    const login = await auth.findOne({
        email
    })
        console.log("FOUND USER:", login);
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
        profile,
        verifyOtp
    
    }


 




