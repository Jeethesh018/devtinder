 const validator =  require("validator")
 
 
 const validateSignupData = (req) =>{
     const {firstName,lastName,emailId,password} = req.body


     if(!firstName || !lastName){
        throw new Error("please Enter valid Full Name")
     }
     else if(firstName.length<4 || firstName>25){
        throw new Error("Names should be 4 to 25 characters")
     }
     else if(!validator.isEmail(emailId)){
        throw new Error("please Enter a valid email")
     }
     else if(!validator.isStrongPassword(password)){
        throw new Error("please Enter a strong password")
     }



 }

 module.exports = {validateSignupData}