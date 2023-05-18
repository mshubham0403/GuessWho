import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { useEffect } from "react";
import Cookies from "js-cookies";

// check

function Header({ userIdState,setUserIdState }) {
 

  // const roomId = uuidv4();
  function Logout(){
    setUserIdState(prevState => null);
    Cookies.removeItem("userId");
    Cookies.removeItem("JoinedRoom");
    Cookies.removeItem("role");
    console.log("logout");
}

  return (
    <>
      <Card sx={{ marginTop: 5, backgroundColor: "#42b0f5", display: "flex" }}>
       { !userIdState &&
       <Link to="/" sx={{ flexGrow: 1 }}>
          <Button
            sx={{ color: "white", textDecoration: "none", width: "100%" }}
            variant="outlined"
          >
            Home
          </Button>
        </Link>}
        <Link to="/chats" sx={{ flexGrow: 1 }}>
          <Button
            sx={{ color: "white", textDecoration: "none", width: "100%" }}
            variant="outlined"
          >
            Chats
          </Button>
        </Link>
        { userIdState &&
        <Link to={`/newRoom`} sx={{ flexGrow: 1 }}>
          <Button
            sx={{ color: "white", textDecoration: "none", width: "100%" }}
            variant="outlined"
          >
            RoomList
          </Button>
        </Link>
}
        {
        userIdState && (
          <Link to="/profile" sx={{ flexGrow: 1 }}>
            <Button
              sx={{ color: "white", textDecoration: "none", width: "100%" }}
              variant="outlined"
            >
              My Profile
            </Button>
          </Link>
          
        )
        }
        {
 userIdState && (
  <Link to="/" sx={{ flexGrow: 1 }}>
    <Button onClick={Logout}
      sx={{ color: "white", textDecoration: "none", width: "100%" }}
      variant="outlined"
    >
      Logout
    </Button>
  </Link>
  
)

}
        
      </Card>
    </>
  );
}
export default Header;
