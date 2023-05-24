import React, {Component, useEffect, useState} from 'react';
import {  createUserWithEmailAndPassword   } from 'firebase/auth';
import {addDoc, serverTimestamp, collection, doc, updateDoc, getDoc} from "firebase/firestore"
import ValidData from "../../ValidData";
import {auth, db} from "../UI/firebaseConfig";
import {Link, useNavigate} from "react-router-dom";
import {Form} from "react-bootstrap";
import {isDisabled} from "@testing-library/user-event/dist/utils";

const initialState = {
    name: "",
    surname: "",
    patronymic: "",
    birthday: "",
    phone: "",
    role: false,
};

const Registration = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [data, setData] = useState(initialState);
    const {name, surname, patronymic, birthday, phone, role} = data;
    const [isSubmit, setIsSubmit] = useState(false);

    const handleClick = (e) =>{
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        await addDoc(collection(db, "Users"), {
            ...data,
            name,
            surname,
            patronymic,
            birthday,
            phone,
            role
        })
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                ValidData('Вы успешно зарегистрировались', true);
                navigate("/login")

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log(errorCode)
                console.log(errorMessage)

                if(errorCode == 'auth/invalid-email')
                    return ValidData('Некорректный E-mail', false);

                if(errorCode == 'auth/missing-email')
                    return ValidData('Заполните E-mail', false);

                if(errorCode == 'auth/missing-password')
                    return ValidData('Заполните пароль', false);

                if(errorCode == 'auth/weak-password')
                    return ValidData('Пароль должен содержать более 6 символов', false);

                if(errorCode == 'auth/email-already-in-use')
                    return ValidData('Данный E-mail уже существует', false);
            });

    }



    return (
        <div className={'modal login'}>
            <div className={'form'}>
                <div className={'form_content'}>
                    <h1>Регистрация</h1>
                    <form>
                        <input placeholder={'E-mail'} type={'email'} onChange={(e)=> setEmail(e.target.value)} required/>
                        <input placeholder={'Пароль'} type={'password'} onChange={(e)=> setPassword(e.target.value)} required/>
                        <input placeholder={'Имя'} type={'text'} onChange={handleClick} value={name} name="name" required/>
                        <input placeholder={'Фамилия'} type={'text'} onChange={handleClick} value={surname} name="surname" required/>
                        <input placeholder={'Отчество'} type={'text'} onChange={handleClick} value={patronymic} name="patronymic" required/>
                        <input placeholder={'День рождения дд.мм.гггг'} type={'date'} onChange={handleClick} value={birthday} name="birthday" required/>
                        <input placeholder={'Номер телефона'} type={'text'} onChange={handleClick} value={phone} required name="phone"/>
                        <button className={'button'} type={'button'} onClick={onSubmit} >Зарегистрироваться</button>
                        <footer>
                            <p>Уже зарегистрированы?<Link to="/login"> Войти</Link></p>
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

export default Registration;