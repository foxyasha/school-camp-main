import React, {Component, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "./firebaseConfig";
import {addDoc, collection, serverTimestamp, setDoc, doc, updateDoc, getDoc} from "firebase/firestore";
import ValidData from "../../ValidData";
import "../ModalStyle.css"
import {Form} from "react-bootstrap";

const initialState = {
    name: "",
    surname: "",
    patronymic: "",
    birthday: "",
};

const Modal =({open,close, id}) => {
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    const [data, setData] = useState(initialState);
    const [isSubmit, setIsSubmit] = useState(false);
    const parentUID = user?.uid;
    const [loadings, setLoading] = useState(true);


    useEffect(() =>{
        id && getSingleUser();
    }, [id]);

    const getSingleUser = async () =>{
        const docRef = doc(db, "Users", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()){
            setData(({...snapshot.data()}))
        }
        setLoading(false);
    }

    if (!open) return null;


    const handleClick = (e) =>{
        setData({ ...data, [e.target.name]: e.target.value });
    }


    const handleSubmit = async (e) =>{
        e.preventDefault();
        setIsSubmit(true);
        if(!id){
            await addDoc(collection(db, "Childrens"), {
                ...data,
                parentUID,
                timestamp: serverTimestamp()
            })
                ValidData('Ребенок добавлен!', true)
        }else{
            try{
                await updateDoc(doc(db,"Childrens", id),{
                    ...data
                });
                ValidData('Данные изменены!', true)
            } catch (error){
                console.log(error);
            }
        }
    }

    return (
        <div className='overlay modalBack modalAnimation'>
            <div className='modalContainer'>
                <div className='modalRight '>
                    <button className={'closeBtn btn-close'} onClick={close}/>
                    <div className='content'>
                        <h1 style={{marginBottom: "20px"}}>Добавить ребенка</h1>
                        <Form onSubmit={handleSubmit} >
                            <input placeholder={'Имя'}  type={'text'} onChange={handleClick} value={data.name} name="name" required />
                            <input placeholder={'Фамилия'} type={'text'} onChange={handleClick} value={data.surname} name="surname" required/>
                            <input placeholder={'Отчество'} type={'text'} onChange={handleClick} value={data.patronymic} name="patronymic" required/>
                            <input placeholder={'День рождения дд.мм.гггг'} type={'date'} onChange={handleClick} value={data.birthday} name="birthday" required/>
                            <hr/>
                            <button className={'button'} >Добавить</button>
                        </Form>
                    </div>

                </div>
            </div>
        </div>
    );
};




export default Modal;




