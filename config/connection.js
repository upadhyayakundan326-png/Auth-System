const mongoose = require ("mongoose")
const coonectDB = async (req,res) => {
    try{
        mongoose.connect("mongodb://127.0.0.1:27017/auth")
.then(()=>console.log("connected"))
    }



catch(error){
    console.log(error)

}

}
module.exports = coonectDB;