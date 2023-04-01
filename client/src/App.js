import "./App.css";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import Cookies from "js-cookies";



function App() {
  const [csock, setSock] = useState(null);
  const [userIdS, setUserIdS] = useState(false);


  const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? "https://guesswhoserver.onrender.com"
    : "http://localhost:7000";

  useEffect(() => {
   
    setSock(prev=>(io(SERVER_URL)));

    const _userId = Cookies.getItem("userId");
    console.log("User Id",_userId);

    if (_userId){ setUserIdS(prevId=>true);
    }
    
  }, []);
  return (
    <div>
     
      <Container>
        {
          console.log(userIdS)
        }
        <Header SocketObject={csock} userIdState={userIdS} setUserIdState={setUserIdS} />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Outlet context={{csock,SERVER_URL,userIdS}} />
        </Box>
      </Container>
    </div>
  );
}

export default App;