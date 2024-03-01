import React, { useContext } from 'react';
import {  Card } from '@blueprintjs/core';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../context/UserContext';
import EnableMfa from './EnableMfa';
import Loader from "../Loader";

const Profile = () => {
    const [userContext, setUserContext] = useContext(UserContext);
    const {t} = useTranslation('');


    return userContext.details === null ?(
        "Error Loading User Details"
    ) : !userContext.details ? (
        <Loader />
    ) : (
        <>
        <Card elevation="1">
            <div className="user-details">  
                <div>
                    <p>Welcome&nbsp;
                        <strong>
                            {userContext.details.firstName} {userContext.details.lastName && " " + userContext.details.lastName}
                        </strong>!
                    </p>
                    <p>Your reward points <strong>{userContext.details.points}</strong></p>
                </div>
            </div>
            <EnableMfa />
        </Card>
        
        </>
    )
};

export default Profile;
