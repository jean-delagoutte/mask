import React, { useContext } from 'react';
import { Button, Intent } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../context/UserContext';
import EnableMfa from './EnableMfa';

const Profile = () => {
  const [userContext] = useContext(UserContext);
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('profile.title')}</h1>
      <p>{t('profile.welcome', { name: userContext.user.firstName })}</p>
      {!userContext.user.mfaEnabled && (
        <Button intent={Intent.PRIMARY} text={t('profile.enableMfa')} icon="security" />
      )}
      {userContext.user.mfaEnabled && (
        <p>{t('profile.mfaEnabled')}</p>
      )}
      <EnableMfa />
    </div>
  );
};

export default Profile;
