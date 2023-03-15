import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";

import { v4 as uuidv4 } from "uuid";
// check 






 function Header() {
  const roomId = uuidv4();
  return (
<>
<Card sx={{ marginTop: 5, backgroundColor: '#42b0f5', display: 'flex' }}>
      <Link to="/" sx={{ flexGrow: 1 }}>
        <Button sx={{ color: 'white', textDecoration: 'none', width: '100%' }} variant="outlined">
          Home
        </Button>
      </Link>
      <Link to="/chats" sx={{ flexGrow: 1 }}>
        <Button sx={{ color: 'white', textDecoration: 'none', width: '100%' }} variant="outlined">
          Chats
        </Button>
      </Link>
      <Link to={`/room/${roomId}`} sx={{ flexGrow: 1 }}>
        <Button sx={{ color: 'white', textDecoration: 'none', width: '100%' }} variant="outlined">
          Room1
        </Button>
      </Link>
    </Card>

</>
  );
}
export default Header;