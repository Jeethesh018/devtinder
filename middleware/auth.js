const auth = (req,res,next) =>{
    let auth = "xyz"
    if(auth === "xyz"){
     next();
    }
    else{
        res.status(401).send("Authorization Failed")
    }
}

module.exports = {auth}