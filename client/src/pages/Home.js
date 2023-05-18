import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Outlet } from "react-router-dom";

import Cookies from "js-cookies";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        KnowWhere
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();


export default function SignIn() {
  const [userName, setUN] = useState("");
  const [pass, setPass] = useState("");
  const [logSuccess, setLogSuccess] = useState(false);
  const [userIdCon, setUserId] = useState("");
  const { SERVER_URL } = useOutletContext();


  useEffect(() => {
 
   

  setUserId(prevId => Cookies.getItem("userId"))
}, [userIdCon]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("submit called");
    
    const logData = {
      name: userName,
      password: pass,
      userId: userIdCon,
    };
    try {
      console.log("try called");
      await axios.post(SERVER_URL + "/users/login", logData).then((res) => {
        let resData = res.data;
        console.log(resData);
        setUN((prevun) => "success");
        setLogSuccess((prevLog) => true);
         Cookies.setItem("userId",resData.userIdSentServer)
         Cookies.setItem("userName",resData.userNameSentServer)
         setUserId(prevId => Cookies.getItem("userId"))

       
      });
      console.log("emitted logdata");
    } catch (error) {
      console.log(error);
      setUN((prevun) => "error");
    }
    setPass((prevpass) => "");
  };
  function handleInputE(event) {
    setUN(event.currentTarget.value);
  }
  function handleInputP(event) {
    setPass(event.currentTarget.value);
  }

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              // autoComplete="email"
              autoFocus
              value={userName}
              onChange={handleInputE}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              // autoComplete="current-password"
              value={pass}
              onChange={handleInputP}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {!logSuccess &&
              <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            }

            {logSuccess && (
              <Link href="/choose" variant="body2">
                <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                  proceed
                </Button>
              </Link>
            )}
            <Grid container>
              <Grid item xs>
                <Link href="/chats" variant="body2">
                  continue without login
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
