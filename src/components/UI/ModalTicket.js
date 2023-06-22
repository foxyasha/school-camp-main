import React, {Component, useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {auth, db} from "./firebaseConfig";
import {addDoc, collection, serverTimestamp, setDoc, doc, updateDoc, getDoc, onSnapshot} from "firebase/firestore";
import ValidData from "../../ValidData";
import "../ModalStyle.css"
import {Dropdown, Form, Image} from "react-bootstrap";
import Loader from "./Loader";




const ModalTicket =({open,close, id}) => {
    const [loadings, setLoading] = useState(true);
    const [camps, setCamps] = useState([]);
    const [childrens, setChildrens] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [selectedChild, setselectedChild] = useState([]);

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

    useEffect(()=>{
        setLoading(true);
        const unsub = onSnapshot(collection(db,"Tickets"), (snapshot) =>{
            let list = [];
            snapshot.docs.forEach((doc) =>{
                list.push({id: doc.id, ...doc.data()})
            });
            setTickets(list);
            setLoading(false);
        }, (error)=>{
            console.log(error);
        })
        return() =>{
            unsub();
        }
    }, []);

    if (!open) return null;


    const submitTicket = async (e, camps) => {
        e.preventDefault();
        console.log(tickets)
        let isInTicket = false;

        tickets.forEach(el => {
            console.log(el.ChildrenUID, selectedChild.id)
            if (el.ChildrenUID === selectedChild.id) {
                return isInTicket = true
            }
        })

        if (isInTicket)
            return  ValidData('Ребенок уже состоит в одном из отрядов', false)

        if (selectedChild.length != 0) {
            await addDoc(collection(db, "Tickets"), {
                Date: new Date().toISOString().slice(0, 10),
                ChildrenUID: selectedChild.id,
                CampTypeUID: camps.id,
                timestamp: serverTimestamp()
            })
            ValidData('Ваш билет был добавлен', true)
        } else {
            ValidData('Выберите ребенка', false)
        }
    }

    return (
        loadings ? <Loader/> :
            <div className='overlay modalBack modalAnimation'>
                <div className='modalContainer'>
                    <div className='modalRight '>
                        <button className={'closeBtn btn-close'} onClick={close}/>
                        <div className='content'>
                            <h1 style={{marginBottom: "20px"}}>Доступные отряды</h1>
                            <div className="d-flex" style={{width:"100%"}}>
                                <h4>Ребенок: </h4>
                                <Dropdown style={{marginLeft:"10px", width: '100%'}}>
                                    <Dropdown.Toggle style={{background: '#1564bf', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}} className="btn dropdown-toggle" type="button">
                                        {selectedChild.name || 'Выберите ребенка'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item  onClick={() => setselectedChild([])}>Выберите ребенка</Dropdown.Item>
                                        {childrens && childrens.map((childrens)=>
                                            <Dropdown.Item onClick={() => setselectedChild(childrens)}>{childrens.name}</Dropdown.Item>
                                        )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <br/>
                            {camps && camps.map((camps)=>(
                                <Form>
                                    <h4>{camps.Title}<Link style={{fontSize:"20px", marginLeft:"5px"}} to={"/camps"}>Подробнее</Link></h4>
                                    <h5>Цена: {camps.Price}</h5>
                                    <div>
                                        <Image className="imgcampmodal" src={camps.Image}/>
                                        <button onClick={(e) => submitTicket(e, camps)} style={{marginTop: '10px'}} className={'button'}>Добавить ребенка</button>
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
