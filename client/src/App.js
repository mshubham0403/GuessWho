import "./App.css";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";


function App() {
  const [csock, setSock] = useState(null);

  const SERVER_URL =
  process.env.NODE_ENV === "production"
    ? "https://guesswhoserver.onrender.com"
    : "http://localhost:7000";

  useEffect(() => {
    // let envi = process.env.NODE_ENV
    // console.log(envi);
    // setSock(io("http://localhost:7000"));
    setSock(io(SERVER_URL));
  }, []);
  return (
    <div>
      <Container>
        <Header />
        <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Outlet context={{ csock }} />
        </Box>
      </Container>
    </div>
  );
}

export default App;