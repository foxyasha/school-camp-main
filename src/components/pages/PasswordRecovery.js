import React, {Component, useEffect, useState} from 'react';
import {sendPasswordResetEmail, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import ValidData from "../../ValidData";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../UI/firebaseConfig";
import {Link, useNavigate} from "react-router-dom";

const PasswordRecovery = () => {

    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const sendPasswordReset = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            ValidData('Успешно', true)
            navigate("/login")
        }
        catch (error) {
            const errorCode = error.code;
            console.log(errorCode);
            if(errorCode == 'auth/missing-email')
                return ValidData('Заполните поле с E-mail', false);
            if(errorCode == 'auth/invalid-email')
                return ValidData('Неверная почта', false);
            if(errorCode == 'auth/user-not-found')
                return ValidData('Пользователь не найден', false);
            if(errorCode == 'auth/too-many-requests')
                return ValidData('Слишком много запросов, повторите позже', false);
        }

    };
    return (
        <div className={'modal login'}>
            <div className={'form'}>
                <div className={'form_content'}>
                    <h1>Сброс пароля</h1>
                    <form>
                        <input placeholder={'E-mail'} type={'email'} value={email} onChange={(e)=> setEmail(e.target.value)} required/>
                        <button className={'button'} type={'button'} onClick={() => sendPasswordReset(email)}>Сбросить пароль</button>
                    </form>
                </div>
            </div>
            <Link to = "/">
                <div className={'btn-close'}>
                    <div/>
                    <div/>
                </div>
            </Link>

        </div>
    );
}

export default PasswordRecovery;