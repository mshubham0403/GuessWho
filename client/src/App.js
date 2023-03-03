
import './App.css';
import {useEffect,useState} from 'react';
import React from 'react';
import { io } from "socket.io-client";
import { Button, Checkbox, Form, Input ,Row} from 'antd';
import 'antd/dist/reset.css';

function App() {
  const [csock,setSock]=useState(null);
  const [msg,setMsg]=useState('');
  useEffect(()=>{
    setSock(io("http://localhost:7000"));
  },[])



  const onFinish = (values) => {
    // console.log('Success:', values);
    csock.emit('send-message-client',{msg});
  
    console.log("this is the sent message",msg);
    setMsg(" ");

  }
  
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="App">
     <Form
    name="basic"
    labelCol={{
      span: 8,
    }}
    wrapperCol={{
      span: 16,
    }}
    style={{
      maxWidth: 600,
    }}
    initialValues={{
      remember: true,
    }}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
    autoComplete="off"
  >
    <Row  gutter={-1222}
     >
    <Form.Item
      label="Message"
      name="message"
      wrapperCol={{
        offset: 89,
        span: 119,
      }}
    
      rules={[
        {
          required: true,
          message: 'Please input your message!',
        },
      ]}
    >
      <Input value={msg}
      onChange={(e)=>setMsg(e.target.value)}
      allowClear = { true}
     
      />
    </Form.Item>
    </Row>

   

    
    <Form.Item
      wrapperCol={{
        offset: 59,
        span: 19,
      }}
    >
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
  </div>
  );
}

export default App;
