const mongoose = require ("mongoose")
const userSchema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
    },
    email:{
      type:String,
      required:true,
      //unique:true,
    },
    passWord:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user"
    }
})
module.exports = mongoose.model("auth", userSchema);