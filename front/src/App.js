import './App.css';
import React, {useState, useContext, useCallback, useEffect} from 'react';
import { Card, Tab, Tabs } from '@blueprintjs/core';
import Login from './Login';
import Register from './Register';
import { UserContext } from './context/UserContext';
import Welcome from './Welcome';
import Loader from './Loader';
import Header from './components/Header';
import { useTranslation } from 'react-i18next';
import { ThemeContext, lightTheme, darkTheme  } from './context/ThemeContext';
import  FormContainer  from './components/FormContainer';

 function App() {
  const [curTab, setCurTab] = useState("login");
  const [userContext, setUserContext] = useContext(UserContext);
  const {t} = useTranslation();
  const { theme } = useContext(ThemeContext);
  
  const verifyUser = useCallback(async () => {
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


  return (
    <div className={theme === 'light' ? lightTheme : darkTheme}>
      {userContext.token === null ? (
        <>
          <Header />
          <FormContainer>
          <Card elevation="1">
            <Tabs id="Tabs" onChange={(newTabId) => setCurTab(newTabId)} selectedTabId={curTab}>
              <Tab id="login" title={t('signIn')} panel={<Login />} />
              <Tab id="register" title={t('signUp')} panel={<Register />} />
            </Tabs>
          </Card>
          </FormContainer>
        </>
      ) : userContext.token ? (
        <>
          <Header />
          <Welcome />
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
  
}

export default App;
