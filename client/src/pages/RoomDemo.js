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
import { useEffect, useState } from "react";

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

function Room() {
  const { SERVER_URL } = useOutletContext();
  const {csock } = useOutletContext();
  const [rooms, setRooms] = useState([{ id: "room1", name: "Room 1" }]);
  console.log(rooms);

  useEffect(() => {
   if(!csock) return;
    csock.on("rooms-is-updated", (roomList) => {
      setRooms((prevRoom) => roomList);

      console.log("csock the new rooms array", roomList);
    });

  
    axios
      .get(SERVER_URL + "/rooms")
      .then((res) => {
        setRooms((prevRoom) => res.data);
        console.log("rooms array axios", res.data);
      })

      .catch((err) => {
        console.error("Error fetching rooms:", err);
      });

  }, [csock]);

  async function postNewRoomToServer(newRoom) {
    try {
      await axios.post(SERVER_URL + "/rooms", newRoom).then((res) => {
        console.log("Rooms posted to server:", res.data);
      });
    } catch (error) {
      console.error("Error posting rooms to server:", error);
    }
  }

  function checkNewRoom(newRoom) {
    let ans = false;
    const chkRoomInd = rooms.findIndex((room) => room.name === newRoom.name);
    if (chkRoomInd !== -1) {
      ans = false;
    } else {
      ans = true;
    }
    return ans;
  }

  const nav = useNavigate();

  function HandleCreateRoom() {
    const RoomId = uid();
    const userThatCreated = Cookies.getItem("userName");
    const newRoom = { id: RoomId, name: userThatCreated };
    if (checkNewRoom(newRoom)) {
      const newRooms = [...rooms, { id: RoomId, name: userThatCreated }];
      setRooms((prevRoom) => newRooms);

      postNewRoomToServer(newRoom);
     
      csock.emit("updated-rooms",newRooms);

    } else {
      console.log("room already there");
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
            console.log("id of Rooms deleted from server:", res.data[0][0].id);
            console.log("Rooms deleted from server:", res.data);
            setRooms((prevRoom) => res.data[1]);
      csock.emit("updated-rooms",res.data[1]);

          });
      } catch (error) {
        console.error("Error deletinging rooms to server:", error);
      }
    } else {
      alert("You cannot delete other user's room.")
    }
  }
  const HandleBackButtonClick = () => {
    nav(`/choose`);
  };

  return (
    <>
      <CreateRoomButton variant="contained" onClick={HandleCreateRoom}>
        Create Room
      </CreateRoomButton>
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
export default Room;
