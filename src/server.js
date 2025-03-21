const express = require("express")

const server = express();

server.use("/document",(req,res)=>{
    res.send("Welcome to express document")
})


server.use("/",(req,res)=>{
    res.send("Welcome to express js")
})



server.listen("8000",()=>{
    console.log("server is up and running")
})