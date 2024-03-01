//cré ci desoius  une composant home react
import React, {useContext} from 'react';
import { Card, Tab, Tabs } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import FormContainer from './FormContainer';
import { UserContext } from '../context/UserContext';


const Home = () => {
    const [userContext] = useContext(UserContext);
    const { t } = useTranslation();
    
    return (
        <FormContainer>
Welcome
        </FormContainer>
    );
};

export default Home;



