const {mongoose} = require("mongoose")

const customerData = new mongoose.Schema(
    {
        customerName: {
            type: String,
            required: true,
            maxLength: 10,
            minLength:4,
            unique: true,
            lowercase:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            lowercase:true,
            minLength:5,
            trim:true,
            validate:{
                validator: (value) => {
                    return value.includes("@");
                  },
                  message: "Enter a valid email",
            }
        },
        phoneNumber: {
            type: String,
            required: true,
            minLength:10,
            maxLength:10
        },
        customerAge: {
            type: Number,
            required: true,
            min:18
        },
        customerSkills: {
            type: [String], 
            default: [],   
            required: true 
        },
        gender : {
            type:String,
            required:true,
             enum: ["male", "female", "others"], 
            message: "Valid Gender required (male, female, others)"
        }
    },
    { timestamps: true }
);

const customerDetails = mongoose.model("customerData", customerData);
module.exports = { customerDetails };
