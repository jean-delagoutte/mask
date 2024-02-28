import { Alignment, Navbar, Menu, MenuItem, Popover, Button, Switch } from '@blueprintjs/core';
import { useContext, useState } from 'react';
import { UserContext } from "../context/UserContext";
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { ThemeContext } from '../context/ThemeContext';




const Header = () => {
  const [userContext] = useContext(UserContext);
  const [langage, setLangage] = useState('fr');
  const {t} = useTranslation();
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
  }

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
                        <MenuItem icon="user"  text={t('profile')} />
                        <MenuItem icon="log-out"  text={t('logout')} />
                    </Menu>} placement='bottom'>
                    <Button icon='user' text={userContext.details?.username} />
                </Popover>
                </>
              ) : (
                <>
                    <Button className="bp5-minimal" icon="log-in"  text={t('signIn')}/>
                    <Button className="bp5-minimal"icon="new-person"  text={t('signUp')} />
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


