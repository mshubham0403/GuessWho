import express from "express";
import http from "http";
import {Server} from 'socket.io';
import socketsFUN from "./socket/socketRoutes.js";
import bcrypt from "bcrypt"


import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"

const app=express();
const httpserver=http.createServer(app);
const io=new Server(httpserver,{cors:["*"]});
const PORT= process.env.PORT||7000;

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});



io.on("connection",socketsFUN);







app.use(express.json())
app.use(cors())


const users = [{name:"Shubham"}]

app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/users', async (req, res) => {
  const chkUser = users.find(user => user.name === req.body.name)
  if(chkUser!=null){
    res.status(201).send("user already added")
  }
else{
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    
    const user = { name: req.body.name, password: hashedPassword }
    users.push(user)
    res.status(201).send("user added")
    console.log("user added",user);
  } catch {
    res.status(500).send("error occurred")
    console.log("user error");

  }
}
})

app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name === req.body.name)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('User exists password incorrect')
    }
  } catch {
    res.status(500).send("error")
  }
})





httpserver.listen(PORT,function(){
    console.log("The server is up and running at",PORT ,":)");
});