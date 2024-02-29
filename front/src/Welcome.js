import React, { useContext } from "react";
import { Button, Card } from "@blueprintjs/core";
import { UserContext } from "./context/UserContext";
import Loader from "./Loader";
import EnableMfa from "./components/EnableMfa";

const Welcome = () => {
    const [userContext, setUserContext] = useContext(UserContext);
    const refetchHandler = () => {
        // details mis à undefined, le loader  sera affcihé et le fetchuserdetails sera appelé de nouveau par le useeffect
        setUserContext(oldValues => { 
          return { ...oldValues, details: undefined }
        })
      };

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
                <div className="user-actions">
                    <Button text="Refetch" intent="primary" onClick={refetchHandler} />
                </div>
            </div>
            <EnableMfa />
        </Card>
        
        </>
    )
};

export default Welcome;