const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
       user:"upadhyayakundan326@gmail.com",
       pass:"osnh hsho pvhm bgvt"
    }
})
module.exports = transporter