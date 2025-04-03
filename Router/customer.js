const express = require("express")
const {auth} = require("../middleware/auth")
const customerRouter = express.Router();
const {customerDetails} = require("../models/customerData.js")

customerRouter.put("/updateCustomerData", auth, async (req, res) => {
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
 
 
 
 customerRouter.delete("/deleteCustomer/:userId",auth,async (req,res)=>{
 
 
     const customerData = await customerDetails.findByIdAndDelete({_id  : req.params.userId})
     res.send("deleted successfully")
 })
 
 
 customerRouter.post("/addCustomerData",auth,async (req,res)=>{
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


 customerRouter.get("/customerData/:userID",auth, async (req,res)=>{
 
     const customerData = await customerDetails.find({ _id : req.params.userID})
     res.send(customerData)
 
 })
 
 customerRouter.get("/customerData",auth,async (req,res)=>{
      const customerData = await customerDetails.find({})
      res.send(customerData)
 })

 module.exports = customerRouter;