const express = require("express")

const server = express();
const {database} = require("../database/database.js")

const {auth} = require("../middleware/auth")
const {Usermodel} = require("../models/user.js")
const {customerDetails} = require("../models/customerData.js")



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
    const userObj={
        firstName:"mahendra",
        lastName:"dhoni",
        emailId:"Akshay@saini.com",
        password:"pass@123"
    }

    const user =  new Usermodel(userObj)
     await user.save();
     res.send("user added successfully")


})


server.post("/addCustomerData",auth,async (req,res)=>{
    const customerObj = {
        CustomerName:"akshay",
        phoneNumber:900000000,
        customerAge:10
    }

    const customer = new customerDetails(customerObj)
    await customer.save();
    res.send("customer Data added Successfully")

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


