const express = require("express")

const server = express();
const {database} = require("../database/database.js")
const validator = require("validator")
const cookiePaser = require("cookie-parser")

const {auth} = require("../middleware/auth")
const {Usermodel} = require("../models/user.js")

const jwt = require("jsonwebtoken")
server.use(express.json())
server.use(cookiePaser())
const {validateSignupData} = require("../utils/validator.js")
const bcrypt = require("bcrypt")
const userRouter = require("../Router/user.js")
const customerRouter = require("../Router/customer.js");
const connRouter = require("../Router/request.js");
const mainuserRouter = require("../Router/mainUser.js");






database.then(
    ()=>{
        console.log("DB connection is successfull")
        server.listen("8000",()=>{
            console.log("server is up and running on 8000 port")
        })
    }
).catch((e)=>{
    console.log(e)
})





server.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        const user = await Usermodel.findOne({ emailId });

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid password" });
        }


        const token = jwt.sign({ _id: user._id }, "admin");
        res.cookie("token", token, { httpOnly: true });

        res.status(200).send({ message: "Login successful" });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

server.post("/logout",auth,(req,res)=>{
    res.cookie("token",null,{
        expires :  new Date(Date.now())
    })
    res.send({message:"logout successfull"})
})



server.use("/",userRouter,customerRouter,connRouter,mainuserRouter)


server.get("/",(req,res)=>{
    res.send("welcome to dev tinder")
})


server.use("/",auth,(err,req,res,next)=>{
    console.log(err)
    if(err){
        res.status(500).send("something went wrong")
    }
    else{
        
        next();
    }
   
})



