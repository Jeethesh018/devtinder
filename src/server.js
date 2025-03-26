const express = require("express")

const server = express();
const {database} = require("../database/database.js")

const {auth} = require("../middleware/auth")
const {Usermodel} = require("../models/user.js")
const {customerDetails} = require("../models/customerData.js")
server.use(express.json())



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



server.post("/signup",auth,async (req,res)=>{
    const userObj=req.body

    const user =  new Usermodel(userObj)
     await user.save();
     res.send("user added successfully")


})


server.post("/addCustomerData",auth,async (req,res)=>{
    const customerObj = {
        customerName:"akshay saini",
        phoneNumber:1000,
        customerAge:20
    }

    const customer = new customerDetails(customerObj)
    await customer.save();
    res.send("customer Data added Successfully")

})

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


