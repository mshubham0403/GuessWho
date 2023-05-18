import "./App.css";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { io } from "socket.io-client";
import { useEffect, useState,useRef } from "react";
import Cookies from "js-cookies";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import { useNavigate } from "react-router-dom";


function App() {
  function Copyright(props) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link color="inherit" href="">
          KnowWhere
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }
  const [csock, setSock] = useState(null);
  const [userIdS, setUserIdS] = useState(false);
  


  const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? "https://guesswhoserver.onrender.com"
    : "http://localhost:7000";

  const nav =useNavigate();
  useEffect(() => {
   
    setSock(prev=>(io(SERVER_URL)));

    const _userId = Cookies.getItem("userId");
    console.log("User Id app",_userId);

    if (_userId){ 
      setUserIdS(prevId=>true);
      console.log("join room app check",Cookies.getItem("JoinedRoom"))
      if(Cookies.getItem("JoinedRoom")==null){
    console.log("room join status not set");

       nav("/choose");
      }
      else if(Cookies.getItem("JoinedRoom")==="false"){
        console.log("room join status false joined not");
    
           nav("/newRoom");
          }
    }
    
  }, []);
  

  
  return (
    <div>
     
      <Container>
        {
          console.log(userIdS)
        }
        <Header SocketObject={csock} userIdState={userIdS} setUserIdState={setUserIdS}   />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Outlet context={{csock,SERVER_URL,userIdS}} />
        </Box>
           {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
      </Container>
    </div>
  );
}

export default App;