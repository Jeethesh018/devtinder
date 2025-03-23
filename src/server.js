const express = require("express")

const server = express();

// server.use("/document",(req,res)=>{
//     res.send("Welcome to express document")
// })


// server.use("/",(req,res)=>{
//     res.send("Welcome to express js")
// })


// server.post("/user/save/:userID", (req, res) => {
//     console.log("Route Params:", req.params); // Correct way to access userID
//     console.log("Query Params:", req.query);  // If query parameters are passed
//     console.log("Request Body:", req.body);   // If body is sent with the request
//     res.send("Added to DB successfully");
// });
// server.get("/user",(req,res)=>{
//     res.send({
//         userid:"1",
//         name:"ABHI"
//     })
// })



server.get("/user",[(req,res,next)=>{
   
    // res.send("response 1 sent successfully")
    next();
},
(req,res,next)=>{
   
    // res.send("response 2 sent successfully")
    next();
}],[(req,res,next)=>{
   
    // res.send("response 1 sent successfully")
    next();
},
(req,res,next)=>{
   
    res.send("response 5 sent successfully")
    next();
}])



server.listen("8000",()=>{
    console.log("server is up and running")
})