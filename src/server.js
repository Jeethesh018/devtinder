const express = require("express")

const server = express();

const {auth} = require("../middleware/auth")




server.use("/user",auth,(req,res)=>{
    // throw new error("hello")
    res.send("details fetch successfully")
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


server.listen("8000",()=>{
    console.log("server is up and running")
})