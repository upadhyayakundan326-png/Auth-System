require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require("./routes/route")


const connectDB = require("./config/connection")
const auth = require("./models/schema");

connectDB()
const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}));
const admin = async(req,res)=>{
 const kundan = await auth.findOneAndUpdate({
    email:"kundan@gmail.com"//FIRST WE WRITE KISKO DHUNDHNA HAI 
 },
 {
    role:"admin"
 },
 { returnDocument: "after"},
)

}
admin()

app.use(express.json());
app.use(cookieParser());

app.use("/",router)




 
app.listen(process.env.PORT, () => {
    console.log("Server running at ",process.env.PORT);
});
