import React, {useState} from "react";

const UserContext = React.createContext([{}, () => {}]);

let inintialState = {};

const UserProvider = (props) => {
    const [state, setState] = useState(inintialState);
    return (
        <UserContext.Provider value={[state, setState]}>
            {props.children}
        </UserContext.Provider>
    )
};

export {UserContext, UserProvider};