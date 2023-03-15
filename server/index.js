import express from "express";
import http from "http";
import {Server} from 'socket.io';
import socketsFUN from "./socket/socketRoutes.js";


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



io.on("connection",socketsFUN);



httpserver.listen(PORT,function(){
    console.log("The server is up and running at",PORT ,":)");
});