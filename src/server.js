const express = require("express")

const server = express();
const {database} = require("../database/database.js")
const validator = require("validator")

const {auth} = require("../middleware/auth")
const {Usermodel} = require("../models/user.js")
const {customerDetails} = require("../models/customerData.js")
server.use(express.json())
const {validateSignupData} = require("../utils/validator.js")
const bcrypt = require("bcrypt")



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



server.post("/addUser",auth,async (req,res)=>{
    const userObj=req.body

    try{
        validateSignupData(req)
        
        const passwordHash = await bcrypt.hash(req.body.password,10)
        console.log(passwordHash)

        const {password, ...newobj} = req.body

        const finalObj = {
            ...newobj,
            password: passwordHash
        }


        const user =  new Usermodel(finalObj)
         await user.save();
         res.send({message :"user added successfully" })
    
    }catch(e){
       res.status(401).send({error : e.message})
    }

    

})


server.post("/login",auth,async (req,res)=>{
    try{
        const {emailId,password} = req.body

        const user =await Usermodel.findOne({emailId : emailId})
        console.log(user.password)

        const isPasswordValid = await bcrypt.compare(password,user.password)

        if(!isPasswordValid){
            res.status(401).send("password is not valid")
        }
        if(isPasswordValid){
            res.send("login successfull")
        }
    }catch(e){
        res.status(401).send("enter valid login details")
    }
})

server.get("/userData",auth,async (req,res)=>{


const userData = await Usermodel.find({})
res.send(userData)
})

server.put("/updateUser",auth,async(req,res)=>{

   const data =  req.body
    const {emailId,...newData} = data


    try{
        await Usermodel.findByIdAndUpdate({_id : newData.userId},newData)
        res.send("User Updated Successfully")
    }
    catch(e){
       res.status(401).send("enter valid details")  
    }

   
})


server.delete("/deleteUser/:UserId",auth,async (req,res)=>{

    await Usermodel.findByIdAndDelete({_id  : req.params.UserId})
    res.send("deleted Successfully")
})



server.get("/customerData",auth,async (req,res)=>{
     const customerData = await customerDetails.find({})
     res.send(customerData)
})




server.get("/customerData/:userID",auth, async (req,res)=>{

    const customerData = await customerDetails.find({ _id : req.params.userID})
    res.send(customerData)

})


server.put("/updateCustomerData", auth, async (req, res) => {
    try {
        console.log(req.body);

        const data = req.body;
        const { email, ...newData } = data;

       

        // Prevent email change
        if (data.email !== email) {
            return res.status(400).json({ error: "Email can't be changed" });
        }

        await customerDetails.findByIdAndUpdate(newData.userId, newData);
        res.send("Saved successfully");

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



server.delete("/deleteCustomer/:userId",auth,async (req,res)=>{


    const customerData = await customerDetails.findByIdAndDelete({_id  : req.params.userId})
    res.send("deleted successfully")
})


server.post("/addCustomerData",auth,async (req,res)=>{
    try{
        const customerObj = req.body
        console.log(req.body)

         if (validator.isEmail(req.body.email)) {
            return res.status(400).json({ error: "Enter a valid email" });
        }
    
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


