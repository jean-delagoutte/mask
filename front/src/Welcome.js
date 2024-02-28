import React, {useCallback, useContext, useEffect} from "react";
import { Button, Card } from "@blueprintjs/core";
import { UserContext } from "./context/UserContext";
import Loader from "./Loader";

const Welcome = () => {
    const [userContext, setUserContext] = useContext(UserContext);

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
        if (!userContext.details){
            fetchUserDetails();
        }
    }, [userContext.details, fetchUserDetails]);

    const refetchHandler = () => {
        // details mis à undefined, le loader  sera affcihé et le fetchuserdetails sera appelé de nouveau par le useeffect
        setUserContext(oldValues => { 
          return { ...oldValues, details: undefined }
        })
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
                    <Button text="Logout" intent="primary" minimal onClick={logoutHandler} />
                </div>
            </div>
        </Card>
        </>
    )
};

export default Welcome;