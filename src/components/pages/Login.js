import React, {Component, useEffect, useState} from 'react';
import {  signInWithEmailAndPassword, signOut   } from 'firebase/auth';
import ValidData from "../../ValidData";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../UI/firebaseConfig";
import {Link, useNavigate} from "react-router-dom";

const Login = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [user, loading] = useAuthState(auth);

    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                ValidData('Вы успешно авторизовались', true)
                navigate("/")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if(!user || errorCode == 'auth/invalid-email'){
                    ValidData('Неверный логин или пароль', false)
                }

            });

    }

    const handleLogout = () => {
        signOut(auth).then(() => {
            navigate("/");
            ValidData("Вы успешно вышли из аккаунта", true)
        }).catch((error) => {

        });
    }

        return (
            <div className={'modal login'}>
                <div className={'form'}>
                    <div className={'form_content'}>
                        <h1>Вход</h1>
                        <form>
                            <input placeholder={'E-mail'} type={'email'} onChange={(e)=> setEmail(e.target.value)} required/>
                            <input placeholder={'Пароль'} type={'password'} onChange={(e)=> setPassword(e.target.value)} required/>
                            <button className={'button'} type={'button'} onClick={onLogin}>Войти</button>
                            <footer>
                                <p>Забыли пароль?<Link to="/recovery"> Восстановление пароля</Link></p>
                            </footer>
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

export default Login;