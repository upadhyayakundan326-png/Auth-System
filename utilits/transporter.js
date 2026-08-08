const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
       user:process.env.EMAIL,
       pass:process.env.APP_PASSWORD,
    }
    
})
console.log(process.env.EMAIL)
module.exports = transporter