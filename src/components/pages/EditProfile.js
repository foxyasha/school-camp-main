import React, {useEffect, useState} from 'react';
import {  createUserWithEmailAndPassword   } from 'firebase/auth';
import {addDoc, collection, doc, getDoc, serverTimestamp, updateDoc} from "firebase/firestore"
import ValidData from "../../ValidData";
import {auth, db} from "../UI/firebaseConfig";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import Loader from "../UI/Loader";

const initialState = {
    name: "",
    surname: "",
    patronymic: "",
    birthday: "",
    phone: ""
};

const Registration = () => {

    const navigate = useNavigate();
    const [data, setData] = useState(initialState);
    const {name, surname, patronymic, birthday, phone, role} = data;
    const [isSubmit, setIsSubmit] = useState(false);
    const [user] = useAuthState(auth);
    const { id } = useParams();
    const [loadings, setLoading] = useState(true);



    useEffect(() =>{
        id && getSingleUser();
    }, [id]);

    const getSingleUser = async () =>{
        const docRef = doc(db, "Users", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()){
            setData(({...snapshot.data()}))
            setLoading(false);

        }
    }

    const handleClick = (e) =>{
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const onSubmit = async (e) =>{
        e.preventDefault();
        setIsSubmit(true);
            try{
                await updateDoc(doc(db,"Users", id),{
                    ...data
                });
                ValidData('Информация изменена!', true)
            } catch (error){
                console.log(error);
        }
        navigate (`/profile/${id}`);
    }




    return (
        loadings ? <Loader/> :
        <div className={'modalwindow login'}>
            <div className={'form'}>
                <div className={'form_content'}>
                    <h1>Редактировать профиль</h1>
                    <form>
                        <input placeholder={'Имя'} type={'text'} required onChange={handleClick} value={name} name="name" maxLength={16} />
                        <input placeholder={'Фамилия'} type={'text'} required onChange={handleClick} value={surname} maxLength={18} name="surname" />
                        <input placeholder={'Отчество'} type={'text'} required onChange={handleClick} value={patronymic} maxLength={18} name="patronymic" />
                        <input placeholder={'Номер телефона'} type={'text'} required onChange={handleClick} value={phone} maxLength={11} name="phone"/>
                        <button className={'button'} type={'button'} onClick={onSubmit} >Редактировать</button>
                    </form>
                </div>
            </div>
            <Link to = {`/profile/${id}`}>
                <div className={'btn-close'}/>
            </Link>

        </div>
    );
}

export default Registration;