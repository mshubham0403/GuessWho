import express from "express";
import { MongoClient, ServerApiVersion } from "mongodb";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import socketsFUN from "./socket/socketRoutes.js";
import bcrypt from "bcrypt";
// import router from "./api/routes.js";
import RoomDb from "./models/Room.js";
import UserDb from "./models/User.js";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import { userInfo } from "os";
import { log } from "console";

const uri = "mongodb+srv://mshubham:Atlass2023@cluster0.vtpm8td.mongodb.net/test?retryWrites=true&w=majority";

try{
  await mongoose.connect(uri); 
  ;
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
 }catch(e){
  console.log("could not connect mongodb because ",e);
 }
const app = express();
const httpserver = http.createServer(app);
const io = new Server(httpserver, { cors: ["*"] });
const PORT = process.env.PORT || 7000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", socketsFUN);

app.use(express.json());
app.use(cors());

const users = [{ name: "Shubham" }];
const Rooms = [{ id: "room1", name: "Room 1" }];

//GET---------------------------------------------------------------->>>>>>>>>=>>>>>>>>>

app.get("/users", async (req, res) => {
  const userArr = await UserDb.find();
  res.json( userArr );
});
app.get("/rooms", async (req, res) => {
  const roomArr = await RoomDb.find();

  res.json(roomArr);
});
//refresh room list---------------------------------------------------------------->>>>>>>>>=>>>>>>>>>

//POST---------------------------------------------------------------->>>>>>>>>=>>>>>>>>>

//get username--------------------------------------------------------------->>>>>>>>>=>>>>>>>>>

app.post("/users/myInfo", async (req, res) => {
  console.log("request reached");
  const getUserName =   await UserDb.find({ userId: req.body.userId });

  console.log("info request", getUserName[0].name);
  const userInfo = { nameSent: getUserName[0].name };
  res.json(userInfo);
});

//Signin=======================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

app.post("/users/login", async (req, res) => {
  console.log("request sign in");
  const userchk= await UserDb.find({ name: req.body.name }).count();
  const user= await UserDb.find({ name: req.body.name });
  // console.log(user[0]);

  if (userchk == 0) {
    res.status(400).send("Cannot find user");
  } 
  else {
    try {
      if (await bcrypt.compare(req.body.password,user[0].password )) {
        const sentDtaConfirm = {
          userIdSentServer: user[0].userId,
          userNameSentServer: user[0].name,
          status: "Success",
        };
        res.send(sentDtaConfirm);
      } else {
        res.send("User exists password incorrect");
      }
    } catch {
      res.status(500).send("error");
    }
  }
});
//Signup---------------------------------------------------------------->>>>>>>>>=>>>>>>>>>

app.post("/users", async (req, res) => {
  const chkUser = await UserDb.find({ name: req.body.name }).count();

  if (chkUser != 0) {
    res.status(201).send("user already added");
  } else {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const user = {
        name: req.body.name,
        password: hashedPassword,
        userId: req.body.userId,
      };

      const userDbObj = new UserDb(user);
      userDbObj.save();
      res.status(201).send("user added");
      console.log("user added", user);
    } catch {
      res.status(500).send("error occurred");
      console.log("user error");
    }
  }
});

//Add rooms=======================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

app.post("/rooms", async (req, res) => {
  console.log("reqest for room reachd the server");

  const chkRoom = await RoomDb.find({ name: req.body.name }).count();

  if (chkRoom != 0) {
    res.status(201).send("room already added");
    console.log("room already added");
  } else {
    try {
      const room = { id: req.body.id, name: req.body.name };
     console.log("room to be added",room)
      const RoomDbObj = new RoomDb(room);
     await  RoomDbObj.save();
      res.status(200).send("room added",room)
      console.log("room added", room);
    } catch {
      res.status(500).send("error occurred")
      console.log("room error");
    }
  }
});

// DeleteRoom=============================================================
app.post("/delrooms", async (req, res) => {
  console.log("reqest for del room reachd the server");

  // const chkRoom = Rooms.find(room => room.name === req.body.name)
  const chkRoomInd = await RoomDb.find({ name: req.body.name }).count();

  if (chkRoomInd != 0) {
    const delRoomN = await RoomDb.deleteOne({ name: req.body.name });
    console.log(delRoomN);
const roomListNow=await RoomDb.find();
    const delConfirmationSentToClient = [delRoomN, roomListNow];
    res.status(201).send(delConfirmationSentToClient);
    console.log("deleted");
  } else {
    res.status(201).send({ id: "room not there", name: " " });
    console.log("not there  for delete");
  }
});

//chkrooms=======================>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.post("/chkrooms", async (req, res) => {
  console.log("reqest for roomchk reachd the server");

  const chkRoom = await RoomDb.find({ name: req.body.name }).count();

  console.log("the room", chkRoom);
  if (chkRoom === 0) {
    try {
      res.status(201).send("0");
      console.log("room will be added", req.body);
    } catch (err) {
      res.status(500).send("-1");
      console.log("room error", err);
    }
  } else {
    try {
      res.status(201).send("1");
      console.log("room already added");
    } catch (err) {
      console.log("error", err);
    }
  }
});

httpserver.listen(PORT, function () {
  console.log("The server is up and running at", PORT, ":)");
});
