import React from "react";
import { Card, Tab, Tabs } from "@blueprintjs/core";
import Login from "./Login";
import Register from "./Register";
import FormContainer from "./FormContainer";
import { useTranslation } from "react-i18next"; 


const LoginRegister = ({ activeTab, setActiveTab }) => {
    const { t } = useTranslation('loginregister');
  
    return (
      <FormContainer>
        <Card elevation="1">
          <Tabs id="Tabs" onChange={(newTabId) => setActiveTab(newTabId)} selectedTabId={activeTab} >
            <Tab icon="log-in" id="login" title={t('signIn')} panel={<Login />} active={activeTab === 'login'} />
            <Tab icon="new-person" id="register" title={t('signUp')} panel={<Register />} active={activeTab === 'register'} />
          </Tabs>
        </Card>
      </FormContainer>
    );
  };

export default LoginRegister;
  