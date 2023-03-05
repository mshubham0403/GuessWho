import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";

import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
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

  useEffect(() => {
    // setSock(io("http://localhost:7000"));
    setSock(io("https://guesswhoserver.onrender.com"));
  }, []);

  useEffect(() => {
    if (!csock) return;

    csock.on("send-message-server", (msgDataServ) => {
  
        setTime(prevTime=>String(d.getTime()));
        setChat(chat=>[...chat, {message:msgDataServ.msg, recieved:true,t:time}]);
      
        console.log("message recieved from server", msgDataServ);
      });
    }, [csock]);

  function handleForm(e) {
    e.preventDefault();

    csock.emit("send-message-from-client", { msg });
    setTime(prevTime=>String(d.getTime()));

    setChat((prevChat)=>[...prevChat, {message:msg,received:true,t:time}]);
    console.log("this is the sent message", msg);
    setMsg(" ");
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
        <Box component="form" onSubmit={handleForm}>
          <OutlinedInput
            sx={{ backgroundColor: "white" }}
            size="small"
            fullWidth
            value={msg}
            placeholder="Write your message"
            inputProps={{ "aria-label": "search google maps" }}
            onChange={(e) => setMsg(e.target.value)}
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