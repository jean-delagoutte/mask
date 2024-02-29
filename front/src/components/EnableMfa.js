import React, { useState, useContext } from 'react';
import { Button, Card } from "@blueprintjs/core";
import { UserContext } from '../context/UserContext';
import VerifyTOTP from './VerifyTOTP';
import { useTranslation } from 'react-i18next';

const EnableMFA = () => {
  const [qrCode, setQrCode] = useState('');
  const [error, setError] = useState('');
  const [showVerifyTOTP, setShowVerifyTOTP] = useState(false);
  const [userContext, setUserContext] = useContext(UserContext);
  const { t } = useTranslation('enablemfa');

  const enableMFA = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/users/enable-mfa`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${userContext.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to enable MFA. Please try again later.');
      }

      const data = await response.json();
      setQrCode(data.qrCode);
      setShowVerifyTOTP(true);
    } catch (error) {
      setError(error.message);
    }
  };
  const disableMFA = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/users/disable-mfa`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${userContext.token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to disable MFA. Please try again later.');
      }

      const data = await response.json();
      setUserContext(oldValues => {
        return { ...oldValues, details: { ...oldValues.details, twoFactorEnabled: data.twoFactorEnabled } }
      })
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <Card>
      <h2>{t('title')}</h2>
      <p>{t('description')}</p>
      {error && <p>{error}</p>}
      {showVerifyTOTP ? (
        <>
          <h3>Scan this QR code with your authenticator app:</h3>
          <img src={qrCode} alt="QR Code" />
          <VerifyTOTP setShowVerifyTOTP={setShowVerifyTOTP} setUserContext={setUserContext} />
        </>
      ) : (
        <>
          {userContext.details.twoFactorEnabled ? (
            <>
              <p>{t('enabletext')}</p>
              <Button onClick={disableMFA} text={t('disable')}/>
            </>
          ) : (
            <>
            <p>{t('disabletext')}</p>
            <Button onClick={enableMFA} text={t('enable')} />
            </>

          )}
        </>
      )}
    </Card>
  );

};

export default EnableMFA;
