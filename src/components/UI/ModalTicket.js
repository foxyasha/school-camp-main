import React, {Component, useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "./firebaseConfig";
import {addDoc, collection, serverTimestamp, setDoc, doc, updateDoc, getDoc, onSnapshot} from "firebase/firestore";
import ValidData from "../../ValidData";
import "../ModalStyle.css"
import {Dropdown, Form, Image} from "react-bootstrap";
import Loader from "./Loader";
import Camps from "../pages/Camps";
import DropdownMenu from "react-bootstrap/DropdownMenu";

const initialState = {
    Date: "",
    ChildrenUID: "",
    CampTypeUID: "",
};

const ModalTicket =({open,close, id}) => {
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    const [count, setCount] = useState(1)
    const [data, setData] = useState(initialState);
    const [isSubmit, setIsSubmit] = useState(false);
    const [loadings, setLoading] = useState(true);
    const [camps, setCamps] = useState([]);
    const [childrens, setChildrens] = useState([]);


    useEffect(()=>{
        setLoading(true);
        const unsub = onSnapshot(collection(db,"CampType"), (snapshot) =>{
            let list = [];
            snapshot.docs.forEach((doc) =>{
                list.push({id: doc.id, ...doc.data()})
            });
            setCamps(list);
            setLoading(false);
        }, (error)=>{
            console.log(error);
        })
        return() =>{
            unsub();
        }
    }, []);


    useEffect(()=>{
        setLoading(true);
        const unsub = onSnapshot(collection(db,"Childrens"), (snapshot) =>{
            let list = [];
            snapshot.docs.forEach((doc) =>{
                if(auth.currentUser?.uid === doc.data().parentUID){
                    list.push({id: doc.id, ...doc.data()})
                }
            });
            setChildrens(list);
            setLoading(false);
        }, (error)=>{
            console.log(error);
        })
        return() =>{
            unsub();
        }
    }, []);


    if (!open) return null;
    function increment(){
        setCount(count + 1)
    }
    function decrement(){
        if(count > 1){
            setCount(count - 1)
        }
    }



    const submitTicket = async (e) => {
        e.preventDefault();
        await addDoc(collection(db, "Tickets"), {
            ...data,
            timestamp: serverTimestamp()
        })
        ValidData('Ваш билет был добавлен', true)
    }


    function openWindow() {
        document.getElementById("childrenDropdown").classList.toggle("show");
    }

    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {

            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }



    return (
        loadings ? <Loader/> :
                <div className='overlay modalBack modalAnimation'>
                    <div className='modalContainer  '>
                        <div className='modalRight '>
                            <button className={'closeBtn btn-close'} onClick={close}/>
                            <div className='content'>
                                <h1 style={{marginBottom: "20px"}}>Доступные отряды</h1>
                                {camps && camps.map((camps)=>(
                                    <Form>
                                        <h4>{camps.Title}</h4>
                                        <h5>Цена: {camps.Price}</h5>
                                        <Image className="imgcampmodal" src={camps.Image}/>
                                        <button onClick={() => navigate("/camps")} className={'button'} style={{width: "150px", height: "50px", fontWeight: "500", fontSize: "18px", float: "right", marginRight: "10px"}} >Подробнее</button>
                                        <button onClick={submitTicket} className={'button'} style={{width: "150px", height: "50px", fontWeight: "500", fontSize: "18px", float: "right", marginRight: "10px"}} >Добавить</button>
                                        <div className="dropdown">
                                            <button className="button dropbtn" onClick={openWindow}>Информация</button>
                                                <div id="childrenDropdown" className="dropdown-content">
                                                    {childrens && childrens.map((childrens)=>
                                                        <a>{childrens.name}</a>
                                                    )}
                                            </div>
                                        </div>
                                        <hr/>
                                    </Form>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

    );
};




export default ModalTicket;




