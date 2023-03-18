

import * as React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import axios from "axios";
import { useOutletContext, useParams } from "react-router-dom";
import Cookies from "js-cookies";

import { useEffect, useState } from "react";



const ChoiceContainer = styled(Grid)({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const ChoiceCard = styled(Card)({
  minWidth: 275,
  textAlign: "center",
  backgroundColor:""
});

const ChoiceCardContent = styled(CardContent)({
  padding: "2rem",
});

export default function Profile() {
  const { SERVER_URL } = useOutletContext();
  const [userNameHEre, setUNHERE] = useState("");

    function Logout(){
     
        console.log("logout");
    }
    async function  Info () {
      const userIdHere = {userId:Cookies.getItem("userId")}
    try {
        await axios.post(SERVER_URL+"/users/myInfo",userIdHere).then(res=>{
          
      const resData = res.data ;
        setUNHERE(prev=>resData.nameSent);
          console.log(resData.nameSent);
        
        })
        console.log("got data");
        
      } catch (error) {
        console.log(error);
        
  
      }
    }
  return (
    <ChoiceContainer>
      <Grid container spacing={2} justifyContent="center">
        <Grid item>
          <ChoiceCard>
            <ChoiceCardContent>
              <Typography variant="h5" component="h2">
              UserName: {userNameHEre}
              </Typography>
              <Typography variant="h5" component="h2">
               Score :  =
              </Typography>
              <Typography sx={{ mb: 1.5 }} color="text.secondary">
                UserId: {Cookies.getItem("userId")}
              </Typography>
             
            </ChoiceCardContent>
          </ChoiceCard>
        </Grid>
        <Grid item>
          <ChoiceCard>
            <ChoiceCardContent>
             
              <Button variant="contained" onClick={Info}>
                Get Info
              </Button>
            </ChoiceCardContent>
          </ChoiceCard>
        </Grid>
      </Grid>
    </ChoiceContainer>
  );
}

