const {mongoose} = require("mongoose")

const customerData = new mongoose.Schema({
    customerName:{
        type:String
    },
    phoneNumber:{
        type:Number
    },
    customerAge:{
        type:Number
    }
})

const customerDetails =  mongoose.model("customerData",customerData)
module.exports = {customerDetails}