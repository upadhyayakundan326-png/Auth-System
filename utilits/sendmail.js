
const  transporter = require("./transporter")
const sendmail = async (to , subject , html) => {
    try{
       const info = await transporter.sendMail({
        from:"upadhyayakundan326@gmail.com",
        to,
        subject,
        html,

       })
       console.log("email sent ")
       console.log(info.response)
    }
    catch(error){
        console.log(error)

    }
    
}
module.exports = sendmail;