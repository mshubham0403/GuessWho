import { Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";

export default function Room() {
  const params = useParams();
  const { csock } = useOutletContext();

  useEffect(() => {
    console.log(params);
    if (!csock) return;
    csock.emit("join-room", { roomId: params.roomId });
  }, [csock]);

  return( <div> 
      <ChatWindow/>
  </div>
  );
}
