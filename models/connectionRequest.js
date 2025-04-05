const {mongoose} = require("mongoose")

const connrequest = new mongoose.Schema({
    fromUserId : {
        type:mongoose.Schema.Types.ObjectId,
       
    },
    touserId : {
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:["ignore","interested","accepted","rejected"],
    message: `{VALUE} is inccorect statustype`
        
    },
},{timestamps:true})

connrequest.index({fromUserId : 1,touserId:1})


const connectionrequestModel = mongoose.model("connectionRequest",connrequest)
module.exports = {connectionrequestModel};