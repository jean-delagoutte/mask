import React,{useState, useContext} from "react";
import { Button, Callout, FormGroup, InputGroup } from "@blueprintjs/core";
import { UserContext } from "./context/UserContext";


const Register = () => {
    const [userContext, setUserContext] = useContext(UserContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const formSubmitHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        const genericErrorMsg = "Something went wrong. Please try again later.";
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/users/signup`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: email, password, firstName, lastName})
        }).then(async (res) => {
            setIsSubmitting(false);
            if (!res.ok) {
                if (res.status === 400) {
                    setError("Please fill all the fields correctly!")
                } 
                else 
                {
                  if (res.status === 401) {
                    setError("Invalid email and password combination.")
                  } else {
                        if (res.status === 500) {
                            console.log(res);
                            const data = await res.json();
                            if (data.message) {
                                setError(data.message || genericErrorMsg);
                            }
                        }
                        else {
                            setError(genericErrorMsg)
                        }
                    }
                }
            } else {
                const data = await res.json()
                setUserContext(oldValues => {
                    return { ...oldValues, token: data.token }
                })
            }
        }).catch((err) => {
            setError(genericErrorMsg);
            setIsSubmitting(false);
        });

    }

    return(
        <>
        {error && <Callout intent="danger">{error}</Callout>}
        <form className="auth-form" onSubmit={formSubmitHandler}>
            <FormGroup label="First Name" labelFor="firstName">
                <InputGroup id="firstName" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </FormGroup>
            <FormGroup label="Last Name" labelFor="lastName">
                <InputGroup id="lastName" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </FormGroup>
            <FormGroup label="Email" labelFor="email">
                <InputGroup id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormGroup>
            <FormGroup label="Password" labelFor="password">
                <InputGroup id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormGroup>
            <Button 
              intent="primary"
              disabled={isSubmitting} 
              fill 
              type="submit" 
              text={`${isSubmitting ? "Registering" : "Register"}`} />
        </form>
        </>
    )

};

export default Register;
