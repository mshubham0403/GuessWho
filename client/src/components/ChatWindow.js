import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function ChatWindow() {
  const [csock, setSock] = useState(null);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    setSock(io("http://localhost:7000"));
  }, []);

  useEffect(() => {
    if (!csock) return;

    csock.on("send-message-server", (msgDataServ) => {
  
        setChat(chat=>[...chat, msgDataServ.msg]);
      
        console.log("message recieved from server", msgDataServ);
      });
    }, [csock]);

  function handleForm(e) {
    e.preventDefault();

    csock.emit("send-message-from-client", { msg });
    setChat([...chat, msg]);
    console.log("this is the sent message", msg);
    setMsg(" ");
  }

  return (
    <>
      <Box sx={{ marginBottom: 5 }}>
      {chat.map((messagei) => (
            <Typography key={messagei}>{messagei}</Typography>
          ))}
      </Box>
      <Box component="form" onSubmit={handleForm}>
        <OutlinedInput
          label="Write your message"
          size="small"
          value={msg}
          placeholder="Write your message"
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
    </>
  );
}