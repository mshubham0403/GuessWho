
import React, { useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";




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

  useEffect(() => {
   
    if (!csock) return;
    csock.emit("join-room", { roomId: params.roomId });
  }, [csock]);

  const nav = useNavigate();

  const HandleBackButtonClick = () => {


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
