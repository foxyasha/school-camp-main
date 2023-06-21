import React, {useState} from 'react';
import {  createUserWithEmailAndPassword   } from 'firebase/auth';
import {addDoc, collection} from "firebase/firestore"
import ValidData from "../../ValidData";
import {auth, db} from "../UI/firebaseConfig";
import {Link, useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";

const initialState = {
    name: "",
    surname: "",
    patronymic: "",
    birthday: "",
    phone: "",
    role: false
};

const Registration = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [data, setData] = useState(initialState);
    const {name, surname, patronymic, birthday, phone, role} = data;
    const [isSubmit, setIsSubmit] = useState(false);
    const [user] = useAuthState(auth);



    const handleClick = (e) =>{
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const userUid = auth.currentUser?.uid;
                addDoc(collection(db, "Users"), {
                    ...data,
                    userUid,
                    name,
                    surname,
                    patronymic,
                    birthday,
                    phone,
                    role
                })
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


    if (user){
        navigate("/")
    }



    return (

        <div className={'modalwindow login'}>
            <div className={'form'}>
                <div className={'form_content'}>
                    <h1>Регистрация</h1>
                    <form onSubmit={onSubmit}>
                        <input placeholder={'E-mail'} type={'email'} onChange={(e)=> setEmail(e.target.value)} />
                        <input placeholder={'Пароль'} type={'password'} onChange={(e)=> setPassword(e.target.value)} maxLength={30}  />
                        <input placeholder={'Имя'} type={'text'} onChange={handleClick} value={name} name="name" maxLength={16} required />
                        <input placeholder={'Фамилия'} type={'text'} required onChange={handleClick} value={surname} maxLength={18} name="surname" />
                        <input placeholder={'Отчество'} type={'text'} required onChange={handleClick} value={patronymic} maxLength={18} name="patronymic" />
                        <input placeholder={'День рождения дд.мм.гггг'} required type={'date'} onChange={handleClick} value={birthday} name="birthday" />
                        <input placeholder={'Номер телефона'} type={'text'} required onChange={handleClick} value={phone} minLength={11} maxLength={11} name="phone"/>
                        <button className={'button'}>Зарегистрироваться</button>
                        <footer>
                            <p>Уже зарегистрированы?<Link to="/login"> Войти</Link></p>
                        </footer>
                    </form>
                </div>
            </div>
            <Link to = "/">
                <div className={'btn-close'}/>
            </Link>

        </div>
    );
}

export default Registration;