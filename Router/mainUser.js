const express = require("express");
const { auth } = require("../middleware/auth");
const { connectionrequestModel } = require("../models/connectionRequest");

const mainuserRouter = express.Router();


mainuserRouter.get("/user/requests/recieved",auth,async (req,res)=>{

    try{
          const connRequest = req.user;


          const connectionRequest = await connectionrequestModel.find({
            touserId : connRequest._id,
            status:"interested"
          }).populate("fromUserId",["firstName","lastName"])
          res.json({
            message:"fetched successfully",
            data: connectionRequest
          })
    }
    catch(e){
        res.status(401).send({
            message:e.message
        })
    }
})



mainuserRouter.get("/user/connections",auth,async (req,res)=>{

    try{
         const loggedinUser = req.user

         const data = await connectionrequestModel.find({
            $or : [
                {
                    touserId : loggedinUser._id,
                    status:"accepted"
                },
                {
                    fromUserId:loggedinUser._id,
                    status:"accepted"
                }
            ],
         }).populate(["fromUserId","touserId"],["firstName","lastName"])


         const finalData = data.map((res)=>res.fromUserId)



         res.send({
            message: "data fetched successfully",
            data:data
         })
    }
    catch(e){
        res.status(401).send({
            message:e.message
        })
    }
})

module.exports = mainuserRouter;