import './App.css';
import React, {useState, useContext, useCallback, useEffect} from 'react';
import { Card, Tab, Tabs } from '@blueprintjs/core';
import Login from './Login';
import Register from './Register';
import { UserContext } from './context/UserContext';
import Welcome from './Welcome';
import Loader from './Loader';

 function App() {
  const [curTab, setCurTab] = useState("login");
  const [userContext, setUserContext] = useContext(UserContext);
  
  const verifyUser = useCallback(async () => {
    console.log("verifying user");
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/users/refreshToken`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    }).then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setUserContext(oldValues => {
          return { ...oldValues, token: data.token }
        })
      }else{
        setUserContext(oldValues => {
          return { ...oldValues, token: null }
        })
      }
      setTimeout(verifyUser, 1000 * 60 * 5);
    });
  }, [setUserContext]);

  useEffect(() => {
    verifyUser();
  }, [verifyUser]);


  return userContext.token === null ? (
    <Card elevation="1">
      <Tabs id="Tabs" onChange={(newTabId) => setCurTab(newTabId)} selectedTabId={curTab}>
        <Tab id="login" title="Sign In" panel={<Login />} />
        <Tab id="register" title="Register" panel={<Register />} />
      </Tabs>
    </Card>
  ): 
  userContext.token ?(
  <Welcome />
  ):(
    <Loader />
  );
}

export default App;
