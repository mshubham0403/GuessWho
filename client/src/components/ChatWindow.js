import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";

import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";

import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

import { useOutletContext, useParams } from "react-router-dom";


// import { circularProgressClasses } from "@mui/material";

export default function ChatWindow() {
  const { csock } = useOutletContext();
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  let d=new Date();
  const [time,setTime]=useState(d.getTime())
  const [typing, setTyping] = useState(false);
  const [typingTimeout, settypingTimeout] = useState(null);

  const { roomId } = useParams();
  console.log(roomId);

  useEffect(() => {
    //checing if tere is socket and not null
    if (!csock) return;


//checking if there is a message from server
    csock.on("send-message-server", (msgDataServ) => {
  
        setTime(prevTime=>String(d.getTime()));
        setChat(chat=>[...chat, msgDataServ]);
      
        console.log("message recieved from server", msgDataServ);
      });

//listening for typing changes
      csock.on("typing-started-server", () => {setTyping(true);
      // console.log('typing started server');
    });
      csock.on("typing-stopped-server", () => setTyping(false));


    }, [csock]);

  function handleForm(e) {
    e.preventDefault();
let msgDataSntCli = {message: msg , received:false,t:time,ro:roomId}
    csock.emit("send-message-from-client",msgDataSntCli );
    setTime(prevTime=>String(d.getTime()));

    setChat((prevChat)=>[...prevChat, msgDataSntCli]);
    // console.log("this is the sent message", msg);
    setMsg(" ");
  }
  function handleInput(e) {
    setMsg(e.target.value);
    csock.emit("typing-started-client",{roomId});
    console.log("here is the cli ro",{roomId});
    // console.log("typing-started-client");

    if (typingTimeout) clearTimeout(typingTimeout);

    settypingTimeout(
      setTimeout(() => {
        csock.emit("typing-stopped-client",{roomId});
    // console.log("typing-stopped-client");

      }, 1000)
    );
  }
  return (
    // <div sx={{ width:"100%" }} >
          /* <Box sx={{ display: "flex", justifyContent: "center" }}> */
          
      <Card
        sx={{
          padding: 2,
          marginTop: 10,
          width: "60%",
          backgroundColor: "#42b0f5",
          color: "white",
        
          paddingLeft:"30px",paddingRight:"30px"
        }}
      >
         { roomId &&   
            <Typography>Room Id : {roomId}</Typography>
          }
     
        <Box sx={{ marginBottom: 5 , width:"100%"}}>
          {/* {chat.forEach((currChat)=>console.log("ji",currChat))}{ */}{
          chat.map((chatMessagei) => (
          
           <Typography
              sx={{ textAlign: chatMessagei.received ? "right" : "left" }}
              key={chatMessagei.message+chatMessagei.t}
            >
             {chatMessagei.message}
            
            </Typography>
           
          ))}
        </Box>

        {/* input and mssage part */}

        <Box component="form" onSubmit={handleForm}>
        { typing 
            &&
        (
            <InputLabel sx={{ color: "white" }} shrink htmlFor="message-input">
              Typing...
            </InputLabel>
          )
          }
          
          <OutlinedInput
            sx={{ backgroundColor: "white" }}
            size="small"
            id="message-input"
            fullWidth
            value={msg}
            placeholder="Write your message"
            inputProps={{ "aria-label": "search google maps" }}
            onChange={handleInput}
            endAdornment={
              <InputAdornment position="end">
                <IconButton type="submit" edge="end">
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </Box>
      </Card>
    
    
    // </div>
  );
}














// import SendIcon from "@mui/icons-material/Send";
// import Box from "@mui/material/Box";
// import IconButton from "@mui/material/IconButton";
// import Card from "@mui/material/Card";

// import InputAdornment from "@mui/material/InputAdornment";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import InputLabel from "@mui/material/InputLabel";

// import Typography from "@mui/material/Typography";
// import { useEffect, useState } from "react";
// import { io } from "socket.io-client";
// import { circularProgressClasses } from "@mui/material";

// import React, {  useRef } from "react";


// // initialize the socket and set the endpoint
// const ENDPOINT = process.env.NODE_ENV === "production"
//   ? "https://guesswhoserver.onrender.com"
//     : "http://localhost:7000";;
  
    
// function Chat() {
//   // define state variables
//   const [chat, setChat] = useState([]);
//   const [msg, setMsg] = useState("");
//   const [typing, setTyping] = useState(false);
//   const [typingTimeout, settypingTimeout] = useState(null);
//   const [time, setTime] = useState("");
//   const [csock, setSock] = useState(null);

//   // a reference to the last chat message so we can scroll to it when a new message arrives
//   const messagesEndRef = useRef(null);
//   useEffect(() => {
//     // let envi = process.env.NODE_ENV
//     // console.log(envi);
//     // setSock(io("http://localhost:7000"));
//     setSock(io(ENDPOINT));
//   }, []);
//   // effect hook that listens for incoming messages from the server
//   useEffect(() => {
//     // listen for incoming messages from the server
//     csock.on("send-message-from-server", (data) => {
//       // update the chat state variable with the received message
//       setChat((prevChat) => [
//         ...prevChat,
//         { message: data.message, received: true, t: data.t },
//       ]);
//     });

//     // listen for other clients typing
//     csock.on("typing-started-server", () => {
//       setTyping(true);
//     });

//     csock.on("typing-stopped-server", () => {
//       setTyping(false);
//     });

//     // scroll to the last message whenever chat state variable is updated
//     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });

//     // cleanup function to remove event listeners when the component is unmounted
//     return () => {
//       csock.off("send-message-from-server");
//       csock.off("typing-started-server");
//       csock.off("typing-stopped-server");
//     };
//   }, [chat]);

//   // function that handles form submission (when the user sends a message)
//   function handleForm(e) {
//     e.preventDefault();

//     // emit a "send-message-from-client" event with the message
//     csock.emit("send-message-from-client", { msg });

//     // update the time state variable to be the current time (used for unique message keys)
//     setTime((prevTime) => String(new Date().getTime()));

//     // update the chat state variable with the new message
//     setChat((prevChat) => [
//       ...prevChat,
//       { message: msg, received: false, t: time },
//     ]);

//     // clear the message input field
//     setMsg("");
//   }

//   // function that handles changes to the message input field
//   function handleInput(e) {
//     // update the message state variable
//     setMsg(e.target.value);

//     // emit a "typing-started-client" event to let the server know the client is typing
//     csock.emit("typing-started-client");

//     // set a timeout to emit a "typing-stopped-client" event after 1 second of inactivity
//     if (typingTimeout) clearTimeout(typingTimeout);

//     settypingTimeout(
//       setTimeout(() => {
//         csock.emit("typing-stopped-client");
//       }, 1000)
//     );
//   }

//   return (
//     <div >
//           <Box sx={{ display: "flex", justifyContent: "center" }}>
//       <Card
//         sx={{
//           padding: 2,
//           marginTop: 10,
//           width: "60%",
//           backgroundColor: "#42b0f5",
//           color: "white",
//         }}
//       >
//         <Box sx={{ marginBottom: 5 }}>
//           {/* {chat.forEach((currChat)=>console.log("ji",currChat))}{ */}{
//           chat.map((chatMessagei) => (
          
//            <Typography
//               sx={{ textAlign: chatMessagei.received ? "left" : "right" }}
//               key={chatMessagei.message+chatMessagei.t}
//             >
//              {chatMessagei.message}
            
//             </Typography>
           
//           ))}
//         </Box>

//         {/* input and mssage part */}

//         <Box component="form" onSubmit={handleForm}>
//         { typing 
//             &&
//         (
//             <InputLabel sx={{ color: "white" }} shrink htmlFor="message-input">
//               Typing...
//             </InputLabel>
//           )
//           }
          
//           <OutlinedInput
//             sx={{ backgroundColor: "white" }}
//             size="small"
//             id="message-input"
//             fullWidth
//             value={msg}
//             placeholder="Write your message"
//             inputProps={{ "aria-label": "search google maps" }}
//             onChange={handleInput}
//             endAdornment={
//               <InputAdornment position="end">
//                 <IconButton type="submit" edge="end">
//                   <SendIcon />
//                 </IconButton>
//               </InputAdornment>
//             }
//           />
//         </Box>
//       </Card>
//     </Box>
    
//     </div>
//   );
// }


// export default Chat;
























//new code tryout with a side panel

// import React, { useState, useEffect } from "react";
// import io from "socket.io-client";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Divider from "@mui/material/Divider";
// import Button from "@mui/material/Button";
// import Card from "@mui/material/Card";
// import OutlinedInput from "@mui/material/OutlinedInput";
// import InputAdornment from "@mui/material/InputAdornment";
// import IconButton from "@mui/material/IconButton";
// import SendIcon from "@mui/icons-material/Send";
// import InputLabel from "@mui/material/InputLabel";




// export default function ChatWindow() {
//   const [csock, setSock] = useState(null);
//   const [msg, setMsg] = useState("");
//   const [chat, setChat] = useState([]);
//   const [time, setTime] = useState("");
//   const [typing, setTyping] = useState(false);
//   const [typingTimeout, settypingTimeout] = useState(null);
//   const [room, setRoom] = useState("default");

//   const SERVER_URL =
//     process.env.NODE_ENV === "production"
//       ? "https://guesswhoserver.onrender.com"
//       : "http://localhost:7000";

//   useEffect(() => {
//     setSock(io(SERVER_URL));
//   }, []);

//   useEffect(() => {
//     if (!csock) return;

//     csock.on("send-message-server", (msgDataServ) => {
//       setTime(String(new Date().getTime()));
//       setChat((prevChat) => [
//         ...prevChat,
//         { message: msgDataServ.msg, received: true, t: time },
//       ]);
//     });

//     csock.on("typing-started-server", () => {
//       setTyping(true);
//     });

//     csock.on("typing-stopped-server", () => setTyping(false));
//   }, [csock, time]);

//   function handleForm(e) {
//     e.preventDefault();
//     csock.emit("send-message-from-client", { msg, room });
//     setTime(String(new Date().getTime()));
//     setChat((prevChat) => [
//       ...prevChat,
//       { message: msg, received: true, t: time },
//     ]);
//     setMsg("");
//   }

//   function handleInput(e) {
//     setMsg(e.target.value);
//     csock.emit("typing-started-client");

//     if (typingTimeout) clearTimeout(typingTimeout);

//     settypingTimeout(
//       setTimeout(() => {
//         csock.emit("typing-stopped-client");
//       }, 1000)
//     );
//   }

//   function handleRoomChange(roomName) {
//     setRoom(roomName);
//     setChat([]);
//   }

//   const chatRooms = [    { name: "General", value: "general" },    { name: "Movies", value: "movies" },    { name: "Sports", value: "sports" },  ];

//   return (
//     <div style={{ display: "flex" }}>
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           width: "20%",
//           height: "100vh",
//           backgroundColor: "#f2f2f2",
//         }}
//       >
//         <Typography variant="h6" sx={{ marginTop: 2, marginLeft: 2 }}>
//           Chat Rooms
//         </Typography>

//         <Divider sx={{ marginTop: 1, marginBottom: 1 }} />

//         {chatRooms.map((room) => (
//           <Button
//             key={room.value}
//             sx={{
//               textTransform: "none",
//               justifyContent: "flex-start",
//               paddingLeft: 2,
//             }}
//             onClick={() => handleRoomChange(room.value)}
//           >
//             {room.name}
//           </Button>
//         ))}
//       </Box>

//       <Box sx={{ width: "80%", padding: 2 }}>
//         <Card
//           sx={{
//             padding: 2,
//             marginTop: 2,
//             width: "100%",
//             backgroundColor: "#42b0f5",
//             color: "white",
//           }}
//         >
//           <Box sx={{ marginBottom: 5 }}>
            
           
       
           
           
           
//             {chat.map((chatMessagei) => (
//               <Typography
//                 sx={{ textAlign: chatMessagei.received ? "left" : "right" }}
//                 key={chatMessagei.message + chatMessagei.t}
//                 >
//                   {chatMessagei.message}
//                 </Typography>
//               ))}
            


//             </Box>
  
//             {/* input and mssage part */}
  
//             <Box component="form" onSubmit={handleForm}>
//               {typing && (
//                 <InputLabel
//                   sx={{ color: "white" }}
//                   shrink
//                   htmlFor="message-input"
//                 >
//                   Typing...
//                 </InputLabel>
//               )}
  
//               <OutlinedInput
//                 sx={{ backgroundColor: "white" }}
//                 size="small"
//                 id="message-input"
//                 fullWidth
//                 value={msg}
//                 placeholder="Write your message"
//                 inputProps={{ "aria-label": "search google maps" }}
//                 onChange={handleInput}
//                 endAdornment={
//                   <InputAdornment position="end">
//                     <IconButton type="submit" edge="end">
//                       <SendIcon />
//                     </IconButton>
//                   </InputAdornment>
//                 }
//               />
//             </Box>
//           </Card>
//         </Box>
//       </div>
//     );
//   }
               
