import React, {Component, useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
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
    const [selectedChild, setselectedChild] = useState([]);
    const [selectedCamp, setselectedCamp] = useState([]);

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

    const submitTicket = async (e, camps) => {
        e.preventDefault();
        await addDoc(collection(db, "Tickets"), {
            Date: new Date().toISOString().slice(0, 10),
            ChildrenUID: selectedChild.id,
            CampTypeUID: camps.id,
            timestamp: serverTimestamp()
        })
        ValidData('Ваш билет был добавлен', true)
    }

    return (
        loadings ? <Loader/> :
            <div className='overlay modalBack modalAnimation'>
                <div className='modalContainer  '>
                    <div className='modalRight '>
                        <button className={'closeBtn btn-close'} onClick={close}/>
                        <div className='content'>
                            <h1 style={{marginBottom: "20px"}}>Доступные отряды</h1>
                            <div className="d-flex" style={{width:"100%"}}>
                                <h4>Ребенок: </h4>
                                <select className="form-select" aria-label="Default select example" style={{marginLeft:"10px"}}>
                                    <option selected>{selectedChild.name || 'Выберите ребенка'}</option>
                                    {childrens && childrens.map((childrens)=>
                                        <option onClick={() => setselectedChild(childrens)}>{childrens.name}</option>
                                    )}
                                </select>
                            </div>
                            <br/>
                            {camps && camps.map((camps)=>(
                                <Form>
                                    <h4>{camps.Title}<Link style={{fontSize:"20px", marginLeft:"5px"}} to={"/camps"}>Подробнее</Link></h4>
                                    <h5>Цена: {camps.Price}</h5>
                                    <div className={'d-flex'}>
                                        <Image className="imgcampmodal" src={camps.Image}/>
                                        <div style={{display:"flex", justifyContent:"end", alignItems:"end", marginBottom:"10px"}}>
                                            <div className={'d-flex '} >
                                                <button onClick={(e) => submitTicket(e, camps)} className={'button'} style={{width: "300px" ,height: "50px", fontWeight: "500", fontSize: "18px"}}>Добавить ребенка</button>
                                            </div>
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


