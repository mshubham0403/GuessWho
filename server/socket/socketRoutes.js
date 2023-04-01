import { promises as fs } from "fs";
const sockets = (csock) => {
    console.log("The connection is established3.");
   
    

    csock.on("typing-started-client",({roomId})=>{
        console.log("here is the room id",roomId);
        let sk = csock.broadcast
        sk= (roomId) ? sk.to(roomId) : sk
        sk.emit("typing-started-server")
        // console.log("typing-started-serverzz");

    })
    csock.on('updated-rooms',(roomList)=>{
        let sk = csock.broadcast
        // sk= (roomId) ? sk.to(roomId) : sk
       sk.emit("rooms-is-updated",roomList)
      console.log("roomList hasbeen sent");
      
      })
    csock.on('typing-stopped-client',({roomId})=>{
        let sk = csock.broadcast
        sk= (roomId) ? sk.to(roomId) : sk
       sk.emit("typing-stopped-server")
    // console.log("typing-stopped-server");

    })
    csock.on('send-message-from-client',(msgData)=>{
        let sk = csock.broadcast
   
        msgData.received=true
        
        
        sk= (msgData.ro) ? sk.to(msgData.ro) : sk
        sk.emit("send-message-server",(msgData))
        console.log("message sent back to client.ko");
    })


    csock.on("join-room",({roomId})=>{
        
        console.log("Joining room",roomId);
        csock.join(roomId);
    });

    csock.on("upload",  (dataRecieved) => {
        console.log("file reached")
      

        console.log("get",dataRecieved.socketId)
    
        csock.broadcast.to(dataRecieved.roomId).emit("uploaded", { buffer: dataRecieved.imgData });
      });

    csock.on('disconnect',(csock)=>{
    
        console.log("user left");
    })
  
    

};
export default sockets;