const {mongoose} = require("mongoose")


const userschema = new mongoose.Schema({
    firstName :{
        type:String,
        minlength:5,
        maxlength:25,
        required : true,
        unique:true,
        trim:true,
    },
    lastName :{
        type:String,
        minlength:5,
        maxlength:25,
        required : true,
        unique:true,
        trim:true,
    },
    emailId :{
        type:String,
        required:true,
        validate : {
            validator: (value) => {
                return value.includes("@");
              },
              message: "Enter a valid email",
        }
    },
    password :{
        type:String,
        required:true,
        trim:true,
        validate : {
            validator : (value) =>{
                return value.length > 7
            },
            message: "Password must be atleast 8 characters"
        }
    },
    age :{
        type:Number,
        min:18,
        required:true
    },
    gender :{
        type:String,
        enum:["male","female","others"],
        required:true,
        message:"Enter a Valid Gender required (male, female, others)"
    }
})


const Usermodel = mongoose.model("profile",userschema)
module.exports = {Usermodel}

