import { Alignment, Navbar, Menu, MenuItem, Popover, Button, Switch } from '@blueprintjs/core';
import { useContext, useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from "../context/UserContext";
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { ThemeContext } from '../context/ThemeContext';




const Header = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [langage, setLangage] = useState('fr');
  const {t} = useTranslation('header');
  const {theme, toggleTheme} = useContext(ThemeContext);

  const handleLanguageChange = (newlangage) => {
    setLangage(newlangage);
    console.log('new langage : '+newlangage);
    i18n.changeLanguage(newlangage);
  };

  
  const getLangageCountryCode = (lang) => {
    switch(lang){
      case 'fr':
        return 'fr';
      case 'en':
        return 'gb';
      case 'es':
        return 'es';
      default:
        return 'fr';
    }
  };

  const logoutHandler = () => {   
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/users/logout`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userContext.token}`,
        },
    }).then(async (res) => {
        setUserContext(oldValues => {
            return { ...oldValues, token: null, details: null }
        })
        window.localStorage.setItem("logout", Date.now());
    }
    );
  };

  const fetchUserDetails = useCallback(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/users/me`, {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userContext.token}`
        }
    }).then(async (res) => {
        if (res.ok) {
            const data = await res.json();
            setUserContext(oldValues => {
                return { ...oldValues, details: data }
            })
        }
        else{
            if (res.status === 401) {
                window.location.reload();
            }else{
                setUserContext(oldValues => {
                    return { ...oldValues, details: null }
                })
            }
        }
    });
  }, [setUserContext, userContext.token]);

  useEffect(() => {
    if (userContext.token != null){
      if (!userContext.details){
        fetchUserDetails();
      }
    }

  }, [userContext.token, userContext.details, fetchUserDetails]);
  

  return (
    <header>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
            <Navbar.Heading>MERN Auth</Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
        <Switch
          style={{marginBottom: 'unset'}}
          inline={true}
          alignIndicator={Alignment.RIGHT}
          defaultChecked={theme === 'dark'}
          onClick={()=> toggleTheme()}
          label={theme === 'dark' ? t('darktheme') : t('lighttheme')}
        />
            {userContext.token != null ?  (
                <>
                <Popover content={
                    <Menu>
                        <Link to="/profile" >
                          <MenuItem icon="user"  text={t('profile')} />
                        </Link>
                        <MenuItem icon="log-out"  text={t('logout')} onClick={logoutHandler} />
                    </Menu>} placement='bottom'>
                    <Button icon='user' text={userContext.details?.username} />
                </Popover>
                </>
              ) : (
                <>
                <Link to="/login" >
                    <Button className="bp5-minimal" icon="log-in"  text={t('signIn')}  />
                </Link>
                <Link to="/register" >
                    <Button className="bp5-minimal"icon="new-person"  text={t('signUp')} />
                </Link>
                </>
              )}
              <Popover content={
              <Menu style={{ minWidth: 'unset' }}>
                <MenuItem  textClassName="fi fi-fr fis" text="" onClick={() => handleLanguageChange('fr')} />
                <MenuItem  textClassName="log-in fi fi-gb fis" text="" onClick={() => handleLanguageChange('en')} />
                <MenuItem  textClassName="fi fi-es fis" text="" onClick={() => handleLanguageChange('es')} />
              </Menu>} placement='bottom'>
                <Button className="bp5-minimal"textClassName={`fi fi-${getLangageCountryCode(langage)} fis`} text=" "/>
                </Popover>

        </Navbar.Group>
      </Navbar>
    </header>
  );
};

export default Header;


