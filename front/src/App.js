import './App.css';
import React, {useState, useContext, useCallback, useEffect, useRef} from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import { UserContext } from './context/UserContext';
import { ThemeContext, lightTheme, darkTheme  } from './context/ThemeContext';
import Header from './components/Header';
import LoginRegister from './components/LoginRegister';
import Profile from './components/Profile';
import Home from './components/Home';
import {PrivateRoute, UnAuthRoute} from './routes/PrivateRoute';


 function App() {
  const [,setUserContext] = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  const [,setActiveTab] = useState('login');
  const effectExecuted = useRef(false);
  
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
    if (effectExecuted.current) return;
    verifyUser();
  }, [verifyUser]);

  useEffect(() => {
    effectExecuted.current = true;
  }, []);


  return (
    <div className={theme === 'light' ? lightTheme : darkTheme}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<UnAuthRoute><LoginRegister activeTab={'login'} onTabChange={setActiveTab}/></UnAuthRoute>} />
          <Route path="/register" element={<UnAuthRoute><LoginRegister activeTab={'register'} onTabChange={setActiveTab}/></UnAuthRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />       
        </Routes>
      </Router>
    </div>
  );
  
}

export default App;
