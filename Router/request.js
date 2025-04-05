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

module.exports = connRouter;
