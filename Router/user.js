const express = require("express")
const {auth} = require("../middleware/auth")
const userRouter = express.Router();
const jwt = require("jsonwebtoken")
const {Usermodel} = require("../models/user.js")
const bcrypt = require("bcrypt")

userRouter.get("/userData",auth,async (req,res)=>{

    const {token}= req.cookies
    const verifyToken = await jwt.verify(token,"admin")
    console.log(verifyToken)
    const userData = await Usermodel.find({})
    res.send(userData)
    })


    userRouter.put("/updateUser",auth,async(req,res)=>{

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
 
 
 userRouter.delete("/deleteUser/:UserId",auth,async (req,res)=>{
 
     await Usermodel.findByIdAndDelete({_id  : req.params.UserId})
     res.send("deleted Successfully")
 })
 
 
 

 
 
 
 

 


 userRouter.post("/addUser",auth,async (req,res)=>{
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


userRouter.patch("/user/forgotpassword", auth, async (req, res) => {
    try {

        const passwordHash = await bcrypt.hash(req.body.newpassword, 10);

       
        if (req.user.emailId === req.body.emailId) {
    const updatedUser = await Usermodel.findByIdAndUpdate(
                { _id: req.body.userId },     
                { password: passwordHash },    
                { new: true }                 
            );

            if (!updatedUser) {
                return res.status(404).send("User not found");
            }

            console.log(updatedUser);
            res.status(200).send("Password updated successfully");
        } else {
            return res.status(400).send("Email mismatch");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error updating password");
    }
});


module.exports = userRouter;