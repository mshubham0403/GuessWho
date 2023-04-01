import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";

import Typography from "@mui/material/Typography";
import { useEffect, useState, useRef } from "react";

import { useOutletContext, useParams } from "react-router-dom";

// import { circularProgressClasses } from "@mui/material";

export default function ChatWindow() {
  const { csock } = useOutletContext();
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [imgFile, setImgFile] = useState(null);

  let d = new Date();
  const [time, setTime] = useState(d.getTime());
  const [typing, setTyping] = useState(false);
  const [isSocket, setIsSocket] = useState("");
  const [typingTimeout, settypingTimeout] = useState(null);
  const fileRef = useRef();
  const fileSelectionStatus = useRef();
  const timesRun = useRef();
  const { roomId } = useParams();
  timesRun.current=0;
  
  

  useEffect(() => {
    console.log("tims run useEffect",timesRun.current);
    timesRun.current=timesRun.current+1;
    console.log("tims run useEffect",timesRun.current);
    //checing if tere is socket and not null
    if (!csock) {
     setIsSocket(prev=>("no")) 
     setTimeout(() => {
       console.log("waiting fr socket")
     }, 200);
      return;
    }
      console.log("now socket is available")
    //checking if there is a message from server
    csock.on("send-message-server", (msgDataServ) => {
      setTime((prevTime) => String(d.getTime()));
      setChat((chat) => [...chat, msgDataServ]);

      console.log("message recieved from server", msgDataServ);
    });

    //listening for typing changes
    csock.on("typing-started-server", () => {
      setTyping(true);
      // console.log('typing started server');
    });
    csock.on("typing-stopped-server", () => setTyping(false));
//check login status
    csock.on("log-confirmation-from-server", (msgDataServ) => {
      console.log("logdata recieved from server", msgDataServ);
    });
//checking for img file
    csock.on("uploaded", (data) => {
      // console.log("this is recieved from other user", data.buffer);
      setTime((prevTime) => String(d.getTime()));

      setChat((prev) => [
        ...prev,
        { message: data.buffer, received: true, type: "image" },
      ]);
    });
  }, [isSocket]);

  function sendImgFile() {
    const dataSentToserver = {
      imgData: imgFile,
      roomId: roomId,
    
      received: true,
      type: "Image",
    };
    csock.emit("upload", dataSentToserver);
    console.log("image sent to server.");
    setChat((prev) => [
      ...prev,
      { message: imgFile, received: false, type: "image" },
    ]);
  }

  function handleForm(e) {
    
   
    timesRun.current=timesRun.current+1;
    console.log("tims run submit",timesRun.current);

    
    e.preventDefault();
    if (fileSelectionStatus.current === "yes") {
      
      console.log("status of file selection", fileSelectionStatus);
      sendImgFile();
      setMsg((prev) => "Image sent");
      fileSelectionStatus.current = "No";
    } else {
      let msgDataSntCli = {
        message: msg,
        received: false,
        t: time,
        ro: roomId,
      };
      csock.emit("send-message-from-client", msgDataSntCli);
      setTime((prevTime) => String(d.getTime()));

      setChat((prevChat) => [...prevChat, msgDataSntCli]);
      console.log("this is the sent message", msg);
      setMsg(" ");
    }
  }
  function handleInput(e) {
    setMsg(e.target.value);
    csock.emit("typing-started-client", { roomId });
    
 

    if (typingTimeout) clearTimeout(typingTimeout);

    settypingTimeout(
      setTimeout(() => {
        csock.emit("typing-stopped-client", { roomId });
     
      }, 1000)
    );
  }

  function selectFile() {
    fileRef.current.click();
  }

  function fileSelected(e) {
    const file = e.target.files[0];
    const imgFileName = file.name;
    // console.log("File....", file);
    fileSelectionStatus.current = "yes";
    setTime((prevTime) => String(d.getTime()));

    console.log(file);
    if (!file) {
      console.log("no file got");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const imgSelectedData = reader.result;

      setImgFile((prev) => imgSelectedData);
      setMsg((prev) => `Selected image:${imgFileName}`);
    };
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

        paddingLeft: "30px",
        paddingRight: "30px",
      }}
    >
      {roomId && <Typography>Room Id : {roomId}</Typography>}

      <Box sx={{ marginBottom: 5, width: "100%" }}>
        {/* {chat.forEach((currChat)=>console.log("ji",currChat))}{ */}
        {chat.map((data) =>
          data.type === "image" ? (
            <img
              style={{ float: data.received ? "right" : "left" }}
              src={data.message}
              alt="sent-file"
              width="100"
              key={time}
              sx={{display:"inlineBlock"}}
            />
          ) : (
            <Typography
              sx={{ textAlign: data.received ? "right" : "left" }}
              key={data.message + data.t}
            >
              {data.message}
            </Typography>
          )
        )}
     
      </Box>

      {/* input and mssage part */}

      <Box component="form" onSubmit={handleForm}>
        {typing && (
          <InputLabel sx={{ color: "white" }} shrink htmlFor="message-input">
            Typing...
          </InputLabel>
        )}

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
              <input
                onChange={fileSelected}
                ref={fileRef}
                type="file"
                style={{ display: "none" }}
              />
              <IconButton
                type="button"
                edge="end"
                sx={{ marginRight: 1 }}
                onClick={selectFile}
              >
                <AttachFileIcon />
              </IconButton>
              <IconButton type="submit" edge="end">
                <SendIcon />
              </IconButton>
            </InputAdornment>
          }
        />
      </Box>
    </Card>

    
  );
}
