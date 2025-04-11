const express = require("express");
const { auth } = require("../middleware/auth");
const { connectionrequestModel } = require("../models/connectionRequest");
const { Usermodel } = require("../models/user");

const connRouter = express.Router();

connRouter.post("/request/send/:status/:userId", auth, async (req, res) => {
        console.log(req.user._id);
        console.log(req.params.userId)

    try {
        const fromuserId = req.user._id.toString();
        const touserId = req.params.userId;
        const status = req.params.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).send({
                message: "Invalid status type"
            });
        }

      
        const existingConnectionRequest = await connectionrequestModel.findOne({
            $or: [
                { fromUserId: fromuserId, touserId: touserId },
                { fromUserId: touserId, touserId: fromuserId }
            ]
        });


        const toexistingConnectionId = await Usermodel.findById(touserId)

        if(!toexistingConnectionId){
            return res.status(400).send({
                message:"user not found"
            })
        }

        if (existingConnectionRequest) {
            return res.status(400).send({
                message: "Connection request already exists between these users"
            });
        }


        if(fromuserId === touserId){
        return    res.status(400).send({
                message:"fromUserId and toUserID both cant be same"
            })
        }
        const connectionReq = new connectionrequestModel({
            fromUserId: fromuserId,
            touserId: touserId,
            status
        });

        const data = await connectionReq.save();
        res.send({
            message: "Connection sent successfully",
            data: data
        });

    } catch (e) {
        res.status(400).send(e.message);
    }
});


connRouter.post("/request/review/:status/:reqId", auth, async (req, res) => {
    const { status, reqId } = req.params;
    console.log('Requested reqId:', reqId);
    console.log('Logged-in User ID:', req.user._id.toString());

    try {
        const loggedinUser = req.user;
        const allowedStatus = ["accepted", "rejected"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Status not allowed"
            });
        }

    
        const connectRequest = await connectionrequestModel.findOne({
            _id: reqId,
            $or: [
                { fromUserId: loggedinUser._id.toString() },
                { touserId: loggedinUser._id.toString() }
            ],
            status: "interested"
        });

        console.log("Found connectRequest:", connectRequest);

        if (!connectRequest) {
            return res.status(404).json({ message: "Connection request not found" });
        }

        connectRequest.status = status;
        const data = await connectRequest.save();

        res.json({
            message: `Connection request ${status}`,
            data
        });

    } catch (e) {
        console.error("Error:", e);
        res.status(400).send(e.message);
    }
});


connRouter.get("/connectionrequests",auth,async (req,res)=>{


    try{
         const data = await connectionrequestModel.find({}).populate(["fromUserId","touserId"],["firstName","lastName"])
         res.send(data)
    }
    catch(e){
        res.status(400).send(e.message)
    }
})

module.exports = connRouter;
