import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";

import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";

import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { circularProgressClasses } from "@mui/material";

export default function ChatWindow() {
  const [csock, setSock] = useState(null);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  let d=new Date();
  const [time,setTime]=useState(d.getTime())
  const [typing, setTyping] = useState(false);
  const [typingTimeout, settypingTimeout] = useState(null);



  useEffect(() => {
    setSock(io("http://localhost:7000"));
    // setSock(io("https://guesswhoserver.onrender.com"));
  }, []);

  useEffect(() => {
    //checing if tere is socket and not null
    if (!csock) return;


//checking if there is a message from server
    csock.on("send-message-server", (msgDataServ) => {
  
        setTime(prevTime=>String(d.getTime()));
        setChat(chat=>[...chat, {message:msgDataServ.msg, recieved:true,t:time}]);
      
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

    csock.emit("send-message-from-client", { msg });
    setTime(prevTime=>String(d.getTime()));

    setChat((prevChat)=>[...prevChat, {message:msg,received:true,t:time}]);
    console.log("this is the sent message", msg);
    setMsg(" ");
  }
  function handleInput(e) {
    setMsg(e.target.value);
    csock.emit("typing-started-client");
    console.log("typing-started-client");

    if (typingTimeout) clearTimeout(typingTimeout);

    settypingTimeout(
      setTimeout(() => {
        csock.emit("typing-stopped-client");
    console.log("typing-stopped-client");

      }, 1000)
    );
  }
  return (
    <div >
          <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Card
        sx={{
          padding: 2,
          marginTop: 10,
          width: "60%",
          backgroundColor: "#42b0f5",
          color: "white",
        }}
      >
        <Box sx={{ marginBottom: 5 }}>
          {/* {chat.forEach((currChat)=>console.log("ji",currChat))}{ */}{
          chat.map((chatMessagei) => (
          
           <Typography
              sx={{ textAlign: chatMessagei.received ? "left" : "right" }}
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
    </Box>
    
    </div>
  );
}