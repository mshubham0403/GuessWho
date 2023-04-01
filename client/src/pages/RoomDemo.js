import React from "react";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { v4 as uid } from "uuid";
import Cookies from "js-cookies";
import axios from "axios";
import { useOutletContext, useParams } from "react-router-dom";
import { useEffect, useState,useRef } from "react";
import excludeVariablesFromRoot from "@mui/material/styles/excludeVariablesFromRoot";

const RoomList = styled(List)({
  width: "100%",
  backgroundColor: (props) => props.theme.palette.background.paper,
});

const RoomListItem = styled(ListItem)({
  display: "flex",
  justifyContent: "space-between",
});

const RoomListItemText = styled(ListItemText)({
  flex: "1",
});

const BackButton = styled(Button)({
  marginTop: "16px",
  float: "right",
  width: "40px",
});

const CreateRoomButton = styled(Button)({
  marginTop: "16px",
  float: "left",
  width: "40px",
});

function Roomss() {
  const { SERVER_URL } = useOutletContext();
  const { csock } = useOutletContext();
  const [rooms, setRooms] = useState([{ id: "room1", name: "Room 1" }]);
  const roomPerm = useRef(3);
  const roleStatus = useRef();

  

 


  useEffect(() => {
    console.log(Cookies.getItem("role"));
    if(Cookies.getItem("role")==="question"){
      roleStatus.current=true;
      console.log("true")
    }
    else if(Cookies.getItem("role")==="answer"){
      roleStatus.current=false;
      console.log("false")
    }
    if (!csock) return;
    csock.on("rooms-is-updated", (roomList) => {
      setRooms((prevRoom) => roomList);

      console.log("csock the new rooms array", roomList);
    });
   
   
   
  }, [csock]);
  
  useEffect(() => {
    async function getroomlist(){
      await   axios
      .get(SERVER_URL + "/rooms")
      .then((res) => {
      
       
        
  
        
        setRooms((prevRoom) => res.data);
        console.log("rooms array axios", res.data);
        
      })
  
      .catch((err) => {
        console.error("Error fetching rooms:", err);
      });
    }
    getroomlist();
   
   
  }, []);
  
  async function postNewRoomToServer(newRoom) {
    try {
      await axios.post(SERVER_URL + "/rooms", newRoom).then((res) => {
        console.log("Rooms posted to server:", res.data);
      });
    } catch (error) {
      console.error("Error posting rooms to server:", error);
    }
  }

   

 async function checkNewRoom(newRoom) {
    
   let chkRoomInd = "";
    try {
     await axios.post(SERVER_URL + "/chkrooms", newRoom).then((res) => {
        chkRoomInd = res.data;
        console.log("Rooms check from server:", res.data,chkRoomInd == "0");
      
    });
    }
    catch (error) {
      console.error("Error chk rooms from server:", error);
     
        roomPerm.current = -1;
        console.log("ctestat", roomPerm);
       
    
          
      
     

    }
    if (chkRoomInd == "0") {
      roomPerm.current = 0;


      console.log("is set ",roomPerm);

    console.log("room add allowed");

    } 
    else {
    
      roomPerm.current = 1;



    console.log("room is there  added to server");

    }
  
  }

  const nav = useNavigate();

  async function HandleCreateRoom() {
    
    const RoomId = uid();
    const userThatCreated = Cookies.getItem("userName");
    const newRoom = { id: RoomId, name: userThatCreated };
    console.log("add room initiated");
     await checkNewRoom(newRoom);
  

      console.log(roomPerm.current == 0, "perm",roomPerm)
      if (roomPerm.current == 0) {
        console.log("add room allowed setting");
        
        const newRooms = [...rooms, { id: RoomId, name: userThatCreated }];
        setRooms((prevRoom) => newRooms);
        
        postNewRoomToServer(newRoom);
        
        csock.emit("updated-rooms", newRooms);
      } else if (checkNewRoom(newRoom) === -1) {
        console.log("room chk error");
      } else {
        console.log("room add not initiated");
      }
 
    }
    
  function HandleJoinRoomClick(roomId) {
    nav(`/room/${roomId}`);
  }
  async function HandleDeleteRoomClick(roomName) {
    if (Cookies.getItem("userName") === roomName) {
      try {
        await axios
          .post(SERVER_URL + "/delrooms", { name: roomName })
          .then((res) => {
            console.log("id of Rooms deleted from server:");
            console.log("Rooms deleted from server:", res.data);
            setRooms((prevRoom) => res.data[1]);
            csock.emit("updated-rooms", res.data[1]);
          });
      } catch (error) {
        console.error("Error deletinging rooms to server:", error);
      }
    } else {
      alert("You cannot delete other user's room.");
    }
  }
  const HandleBackButtonClick = () => {
    nav(`/choose`);
  };

  return (
    <>
     { roleStatus.current && 
     <CreateRoomButton variant="contained" onClick={HandleCreateRoom}>
        Create Room
      </CreateRoomButton>}
      <RoomList>
        {rooms.map((room) => (
          <RoomListItem key={room.id}>
            <RoomListItemText primary={room.name} secondary={room.id} />
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={() => HandleJoinRoomClick(room.id)}
              >
                Join Room
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => HandleDeleteRoomClick(room.name)}
              >
                Delete Room
              </Button>
            </>
          </RoomListItem>
        ))}
      </RoomList>
      <BackButton variant="contained" onClick={HandleBackButtonClick}>
        Back
      </BackButton>
    </>
  );
}
export default Roomss;
