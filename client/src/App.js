import "./App.css";
import { useEffect, useState } from "react";
// import React from 'react';
import { io } from "socket.io-client";
// import { Button, Checkbox, Form, Input ,Row} from 'antd';
// import 'antd/dist/reset.css';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button/index.js";
import TextField from "@mui/material/TextField";
import { Container } from "@mui/system";
import Typography from "@mui/material/Typography";

function App() {
  const [csock, setSock] = useState(null);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    setSock(io("http://localhost:7000"));
  }, []);
  useEffect(() => {
    if (!csock) {
      return;
    }
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
    <div className="App">
      <Container>
        <Box>
          {chat.map((messagei) => (
            <Typography key={messagei}>{messagei}</Typography>
          ))}
        </Box>
        <Box
          component="form"
          sx={{
            "& > :not(style)": { m: 1, width: "25ch" },
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleForm}
        >
          <TextField
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
            value={msg}
            onChange={(e) => {
              setMsg(e.target.value);
            }}
          />
          <Button variant="contained" type="submit">
            Send
          </Button>
        </Box>
      </Container>
     
    </div>
  );
}

export default App;
