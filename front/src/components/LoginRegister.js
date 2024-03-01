import React from "react";
import { Card, Tab, Tabs } from "@blueprintjs/core";
import Login from "./Login";
import Register from "./Register";
import FormContainer from "./FormContainer";
import { useTranslation } from "react-i18next"; 
import {useNavigate} from 'react-router-dom';



const LoginRegister = ({activeTab, onTabChange}) => {
    const { t } = useTranslation('loginregister');
    const navigate = useNavigate();

    const handleTabChange = (newTabId) => {
      onTabChange(newTabId);
      navigate('/'+newTabId);
    }

    return (
      <FormContainer>
        <Card elevation="1">
          <Tabs id="Tabs" onChange={handleTabChange} selectedTabId={activeTab}>
            <Tab icon="log-in" id="login" title={t('signIn')} panel={<Login />}  />
            <Tab icon="new-person" id="register" title={t('signUp')} panel={<Register />}  />
          </Tabs>
        </Card>
      </FormContainer>
    );
  };

export default LoginRegister;
  