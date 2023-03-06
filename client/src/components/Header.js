import { Link } from "react-router-dom";

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import { makeStyles } from "@mui/styles";




let useStyles = makeStyles({
    parent: {
      display: 'flex',
    },
    child: {
      flexGrow: 1,
    //   width :'100%' ,
    },
    but: {
       
        width :'100%' ,
      },
  });

 function Header() {
    const classes = useStyles();
  return (
    <Card sx={{ marginTop: 5, backgroundColor: "#42b0f5" }}  className={classes.parent} raised>
      <Link to="/" className={classes.child}>
        <Button sx={{ color: "white", textDecoration: "none" }}  className={classes.but} variant="outlined">
          Home
        </Button>
      </Link>
      <Link to="/chats" className={classes.child}>
        <Button sx={{ color: "white", textDecoration: "none" }}  className={classes.but} variant="outlined">
          Chats
        </Button>
      </Link>
      <Link to="/" className={classes.child}>
        <Button sx={{ color: "white", textDecoration: "none" }}   className={classes.but} variant="outlined">
          Room1
        </Button>
      </Link>
    </Card>

  );
}
export default Header;