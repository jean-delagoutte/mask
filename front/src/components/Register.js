import React,{useState, useContext} from "react";
import { Button, Callout, FormGroup, InputGroup } from "@blueprintjs/core";
import { UserContext } from "../context/UserContext";
import { useTranslation } from 'react-i18next';


const Register = () => {
    const [, setUserContext] = useContext(UserContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const {t} = useTranslation('loginregister');

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
            <FormGroup label={t('firstName')} labelFor="firstName">
                <InputGroup id="firstName" type="text" placeholder={t('firstName')} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </FormGroup>
            <FormGroup label={t('lastName')} labelFor="lastName">
                <InputGroup id="lastName" type="text" placeholder={t('lastName')} value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </FormGroup>
            <FormGroup label={t('email')} labelFor="email">
                <InputGroup id="email" type="email" placeholder={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormGroup>
            <FormGroup label={t('password')} labelFor="password">
                <InputGroup id="password" type="password" placeholder={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormGroup>
            <Button 
              intent="primary"
              disabled={isSubmitting} 
              fill 
              type="submit" 
              text={`${isSubmitting ? t('registring') : t('register')}`} />
        </form>
        </>
    )

};

export default Register;
