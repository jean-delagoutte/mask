import React, {useState, useContext} from "react";
import { Button, Callout, FormGroup, InputGroup } from "@blueprintjs/core"
import { UserContext } from "../context/UserContext";
import { useTranslation } from 'react-i18next';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);    
    const [error, setError] = useState("");
    const [otpRequired, setOtpRequired] = useState(false);
    const [, setUserContext] = useContext(UserContext);
    const {t} = useTranslation('loginregister');

    const formSubmitHandler  = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");
        const genericErrorMsg = "Something went wrong. Please try again later.";
        fetch(`${process.env.REACT_APP_API_ENDPOINT}/users/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({username: email, password, totp: otpRequired ? otp : undefined})
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
                    } 
                    else 
                    {    
                        setError(genericErrorMsg)
                    }
                } 
            } 
            else 
            {
                const data = await res.json()
                if (data.otpRequired) {
                    setOtpRequired(true);
                } else {
                    setUserContext(oldValues => {
                      return { ...oldValues, token: data.token };
                    });
                }
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
            <FormGroup label={t('email')} labelFor="email">
                <InputGroup id="email" type="email" placeholder={t('email')} value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormGroup>
            <FormGroup label={t('password')} labelFor="password">
                <InputGroup id="password" type="password" placeholder={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormGroup>
            {otpRequired && (
            <FormGroup
                label={t('totp')}
                labelFor="totp-input"
            >
                <InputGroup
                id="totp-input"
                type="text"
                placeholder={t('totp')}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                />
            </FormGroup>
            )}
            <Button 
                intent="primary"
                disabled={isSubmitting} 
                fill 
                type="submit" 
                text={isSubmitting ? t('signingIn') : t('signIn')} />
        </form>
        </>
    )
};

export default Login;