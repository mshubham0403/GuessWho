import express from "express";
import http from "http";
import {Server} from 'socket.io';


const app=express();
const httpserver=http.createServer(app);
const io=new Server(httpserver,{cors:["*"]});
const PORT= process.env.PORT||7000;

import path from "path";
import { fileURLToPath } from "url";
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

io.on("connection",function(csock){
    console.log("The connection is established.");
    csock.on('send-message-from-client',(msgData)=>{
        
        csock.broadcast.emit("send-message-server",msgData)
        console.log("message sent back to client");
    })
    csock.on('disconnect',(csock)=>{
    
        console.log("user left");
    })

});

httpserver.listen(PORT,function(){
    console.log("The server is up and running at 7000:)");
});