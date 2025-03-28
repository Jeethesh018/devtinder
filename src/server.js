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

server.get("/customerData",auth,async (req,res)=>{
     const customerData = await customerDetails.find({})
     res.send(customerData)
})



server.get("/customerData/:userID",auth, async (req,res)=>{

    const customerData = await customerDetails.find({ _id : req.params.userID})
    res.send(customerData)

})


server.put("/updateCustomerData",auth,async (req,res)=>{
    console.log(req.body)

    const customerData = await customerDetails.findByIdAndUpdate(req.body.userId,req.body)
    res.send(customerData)
})


server.delete("/deleteCustomer/:userId",auth,async (req,res)=>{


    const customerData = await customerDetails.findByIdAndDelete({_id  : req.params.userId})
    res.send("deleted successfully")
})


server.post("/addCustomerData",auth,async (req,res)=>{
    try{
        const customerObj = req.body
        console.log(req.body)
    
        const customer = new customerDetails(customerObj)
        await customer.save();
        res.send("customer Data added Successfully")
    }catch(e){
        res.status(400).send({message :e.message,data:[] } )
    }
   

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


