import express from "express";
import http from "http";
import {Server} from 'socket.io';


const app=express();
const httpserver=http.createServer(app);
const io=new Server(httpserver,{cors:["*"]});

import path from "path";
import { fileURLToPath } from "url";
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

io.on("connection",function(csock){
    // console.log("The connection is established.");
    csock.on('send-message-client',(msg)=>{
        console.log("message recieved",msg);
    })
});

httpserver.listen(7000,function(){
    console.log("The server is up and running at 7000:)");
});