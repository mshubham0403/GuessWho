
import React, { useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import jsCookies from "js-cookies";




const BackButton = styled(Button)({
  marginTop: "16px",
  position:"relative",
  top:"1px",
  height:"50px",
  left:"-20px",
  width:"100px",
});
export default function Room() {
  const params = useParams();
  const { csock } = useOutletContext();
  const { roomJoinS } = useOutletContext();

  useEffect(() => {
   
    if (!csock) return;
    csock.emit("join-room", { roomId: params.roomId });
    jsCookies.setItem("JoinedRoom",true);
    console.log("joined room is set to",jsCookies.getItem("JoinedRoom"))
    
  }, [csock]);

  const nav = useNavigate();

  const HandleBackButtonClick = () => {

    jsCookies.setItem("JoinedRoom","false");
    console.log("joined room is set to",jsCookies.getItem("JoinedRoom"))

    nav(`/newRoom`);
  };
 
  


  return( <div style={{width:"100%", display:"flex",justifyContent:"center"}}> 
      <>
      <ChatWindow/>
      <BackButton variant="contained" onClick={HandleBackButtonClick}>
        Leave game
      </BackButton>
    
      </>
  </div>
  );
}
