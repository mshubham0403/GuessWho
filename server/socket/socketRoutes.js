const sockets = (csock) => {
    console.log("The connection is established3.");
   
    

    csock.on("typing-started-client",({roomId})=>{
        console.log("here is the room id",roomId);
        let sk = csock.broadcast
        sk= (roomId) ? sk.to(roomId) : sk
        sk.emit("typing-started-server")
        // console.log("typing-started-serverzz");

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
        console.log("message sent back to client");
    })


    csock.on("join-room",({roomId})=>{
        
        console.log("Joining room",roomId);
        csock.join(roomId);
    })


    csock.on('disconnect',(csock)=>{
    
        console.log("user left");
    })
  
    

};
export default sockets;