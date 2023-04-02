import React, { useEffect, useState ,useRef} from "react";
import { useOutletContext, useParams } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import jsCookies from "js-cookies";

const BackButton = styled(Button)({
  marginTop: "16px",
  position: "relative",
  top: "1px",
  height: "50px",
  left: "-20px",
  width: "100px",
});

const FormContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "16px",
});

const FormInput = styled(TextField)({
  marginRight: "16px",
});

export default function Room() {
  const params = useParams();
  const { csock } = useOutletContext();
  const { roomJoinS } = useOutletContext();
  const [question, setQuestion] = useState("");
  const [expectedAnswer, setExpectedAnswer] = useState("");
  const ansForQues = useRef();
  const QuesAsked = useRef();
  const [isAsked,setIsAsked]= useState(false);


  useEffect(() => {
    if (!csock) return;
    csock.emit("join-room", { roomId: params.roomId });
    jsCookies.setItem("JoinedRoom", true);
    console.log("joined room is set to", jsCookies.getItem("JoinedRoom"));

    
  }, [csock]);

  const nav = useNavigate();

  const handleBackButtonClick = () => {
    jsCookies.setItem("JoinedRoom", "false");
    console.log("joined room is set to", jsCookies.getItem("JoinedRoom"));
    nav(`/newRoom`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("expexted ans at line 56 in room.js:",expectedAnswer)
    console.log("handle")
    let date = new Date();
    csock.emit("question-asked", { text: question,expectedAnswer:expectedAnswer,roomId:params.roomId,sentUser:jsCookies.getItem("userId") ,time:date.getTime()});
    ansForQues.current=expectedAnswer;
    QuesAsked.current=question;
    setQuestion((prev)=>"");
    setExpectedAnswer((prev)=>"")
    setIsAsked((prev)=>true);
  };

  return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <>
        {(jsCookies.getItem("role")==="question") &&
          <FormContainer sx={{display:"inline-flex"}}>
          <form onSubmit={handleSubmit}>
            <FormInput
              label="Ask Question"
              variant="outlined"
              value={question}
              onChange={(e) => setQuestion(prev=>(e.target.value))}
            />
            <FormInput
            sx={{marginTop:"14px"}}
              label="Expected Answer"
              variant="outlined"
              value={expectedAnswer}
              onChange={(e) => setExpectedAnswer(prev=>(e.target.value))}
            />
            <Button  variant="contained" type="submit" >
              Send
            </Button>
          </form>
          
        </FormContainer>
        }{  (jsCookies.getItem("role")==="question") &&
   isAsked &&
  <ChatWindow expectedAnswer={expectedAnswer} ansForQues={ansForQues} QuesAsked={QuesAsked} isAsked={isAsked} />
  }
  {
  (jsCookies.getItem("role")==="answer") &&
  <ChatWindow expectedAnswer={expectedAnswer} ansForQues={ansForQues} QuesAsked={QuesAsked} isAsked={isAsked} />
  }
  
  
        <BackButton variant="contained" onClick={handleBackButtonClick}>
          Leave game
        </BackButton>
      </>
    </div>
  );
}
