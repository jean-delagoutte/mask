import './App.css';
import React, {useState, useContext, useCallback, useEffect} from 'react';
import { UserContext } from './context/UserContext';
import Welcome from './Welcome';
import Loader from './Loader';
import Header from './components/Header';
import { ThemeContext, lightTheme, darkTheme  } from './context/ThemeContext';
import LoginRegister from './components/LoginRegister';


 function App() {
  const [userContext, setUserContext] = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [LoginRegisterActiveTab, setLoginRegisterActiveTab] = useState("login");
  
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
          <Header setActiveTab={setLoginRegisterActiveTab}/>
          <LoginRegister activeTab={LoginRegisterActiveTab} setActiveTab={setLoginRegisterActiveTab}/>
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
