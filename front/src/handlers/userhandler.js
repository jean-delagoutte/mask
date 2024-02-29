import { useContext } from 'react';
import { UserContext } from "../context/UserContext";

export const useRefetch = () => {
  const [, setUserContext] = useContext(UserContext);

  const refetchHandler = () => {
    setUserContext(oldValues => {
      return { ...oldValues, details: undefined };
    });
  };

  return refetchHandler;
};


export const useLogout = () => {   
    const [userContext, setUserContext] = useContext(UserContext);
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

