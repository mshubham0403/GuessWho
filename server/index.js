import express from "express";
import mongoose from "mongoose";
import http from "http";
import {Server} from 'socket.io';
import socketsFUN from "./socket/socketRoutes.js";
import bcrypt from "bcrypt"
// import router from "./api/routes.js";
import RoomDb from "./models/Room.js"
import UserDb from "./models/User.js"
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors"
import { userInfo } from "os";



await mongoose.connect(
  "mongodb+srv://mshubham:allinmask@cluster0.vtpm8td.mongodb.net/?retryWrites=true&w=majority"
);

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
const Rooms = [
  { id: "room1", name: "Room 1" },
  
]


//GET---------------------------------------------------------------->>>>>>>>>=>>>>>>>>>

app.get('/users', (req, res) => {
  res.json(users)
})
app.get('/rooms', (req, res) => {
  res.json(Rooms)
})
//refresh room list---------------------------------------------------------------->>>>>>>>>=>>>>>>>>>





//POST---------------------------------------------------------------->>>>>>>>>=>>>>>>>>>



//get username--------------------------------------------------------------->>>>>>>>>=>>>>>>>>>

app.post('/users/myInfo',async (req, res) => {

  console.log("request reached");
  const getUserName = users.find(user => user.userId === req.body.userId)
  console.log("info request",getUserName);
  const userInfo = {nameSent: getUserName.name }
  res.json(userInfo)
})

//Signin=======================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

app.post('/users/login', async (req, res) => {
  console.log("request sign in");
  const user = users.find(user => user.name === req.body.name)
  if (user == null) {
    return res.status(400).send('Cannot find user')
  }
  try {
    if(await bcrypt.compare(req.body.password, user.password)) {
      const sentDtaConfirm = {userIdSentServer:user.userId,userNameSentServer:user.name,status:"Success"}
      res.send(sentDtaConfirm)
    } else {
      res.send('User exists password incorrect')
    }
  } catch {
    res.status(500).send("error")
  }
})
//Signup---------------------------------------------------------------->>>>>>>>>=>>>>>>>>>

app.post('/users', async (req, res) => {
  const chkUser = users.find(user => user.name === req.body.name)
  if(chkUser!=null){
    res.status(201).send("user already added")
  }
else{
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
 
    const user = { name: req.body.name, password: hashedPassword ,userId:req.body.userId}
    users.push(user)
    const userDbObj = new UserDb(user);
    userDbObj.save();
    res.status(201).send("user added")
    console.log("user added",user);
  } catch {
    res.status(500).send("error occurred")
    console.log("user error");
    
  }
}
})

//Add rooms=======================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

app.post('/rooms', async (req, res) => {
  console.log("reqest for room reachd the server");
  
  const chkRoom = Rooms.find(room => room.name === req.body.name)
  if(chkRoom!=null){
    res.status(201).send("room already added")
    console.log("room already added");

  }
else{
  try {
    
    const room = { id: req.body.id,name:req.body.name }
    Rooms.push(room)
    const RoomDbObj = new RoomDb(room);
    RoomDbObj.save();
    // res.status(201).send("room added",room)
    console.log("room added",room);
  } catch {
    // res.status(500).send("error occurred")
    console.log("room error");
    
  }
}
})

// DeleteRoom=============================================================
app.post('/delrooms', async (req, res) => {
  console.log("reqest for del room reachd the server");
  
  // const chkRoom = Rooms.find(room => room.name === req.body.name)
  const chkRoomInd = Rooms.findIndex(room => room.name === req.body.name)
  if(chkRoomInd!=-1){
      const delRoomN = Rooms.splice(chkRoomInd,1)
    const delConfirmationSentToClient = [delRoomN,Rooms]
    res.status(201).send(delConfirmationSentToClient)
    console.log("deleted");
    
    
  }
else{
 
    
    res.status(201).send({id:"room not there",name:" "})
    console.log("not there  for delete");
    

}
    })


//chkrooms=======================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.post('/chkrooms', async (req, res) => {
  console.log("reqest for roomchk reachd the server");
  
  const chkRoom = Rooms.find(room => room.name === req.body.name)
  console.log("the room",chkRoom);
  if(!chkRoom){
   

  try {
   
   
    res.status(201).send(false)
    console.log("room will be added",req.body);
  } catch (err){
    res.status(500).send("error occurred")
    console.log("room error",err);
    
  }

}
else{
  try{
    res.status(201).send(true)
   console.log("room already added");
 }
 catch(err){
   console.log("error",err);

  }
}
})






httpserver.listen(PORT,function(){
    console.log("The server is up and running at",PORT ,":)");
});