import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {auth, db} from "./firebaseConfig";
import {collection, doc, onSnapshot, deleteDoc} from "firebase/firestore";
import ValidData from "../../ValidData";
import "../ModalStyle.css"
import {Form, Image} from "react-bootstrap";
import Loader from "./Loader";




const ModalSchedule =({open,close, id}) => {
    const [loadings, setLoading] = useState(true);
    const [camps, setCamps] = useState([]);
    const [childrens, setChildrens] = useState([]);
    const [tickets, setTickets] = useState([]);



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
            console.log(tickets)
            setLoading(false);
        }, (error)=>{
            console.log(error);
        })
        return() =>{
            unsub();
        }
    }, []);

    function getIdCamp(ticketsIdCamp) {
        let id = 0;
        camps.forEach((el, index) => {
            if (ticketsIdCamp == el.id) {
                return id = index
            }
        })
        return id;
    }

    const handleDelete = async (e, id) =>{
        e.preventDefault();
        console.log(id)
        try{
            await deleteDoc(doc(db, "Tickets", id));
            setChildrens(tickets.filter((tickets) => tickets.id !== id))
            ValidData('Данные удалены успешно!', true)
        } catch(err){
            console.log(err);
        }
    }

    if (!open) return null;

    return (
        loadings ? <Loader/> :
            <div className='overlay modalBack modalAnimation'>
                <div className='modalContainer'>
                    <div className='modalRight '>
                        <button className={'closeBtn btn-close'} onClick={close}/>
                        <div className='content'>
                            <h1 style={{marginBottom: "20px"}}>Мои билеты</h1>
                            {childrens && childrens.map((childrens)=>
                                <div style={{width:"100%"}}>
                                    <h4>Ребенок: {childrens.name}</h4>

                                    {tickets && tickets.map((tickets)=>(
                                        childrens.id === tickets.ChildrenUID ?
                                            <Form key={tickets.id}>
                                                <h4>{camps[getIdCamp(tickets.CampTypeUID)].Title}<Link style={{fontSize:"20px", marginLeft:"5px"}} to={"/camps"}>Подробнее</Link></h4>
                                                <div className={'d-flex'}>
                                                    <Image className="imgcampmodal" src={camps[getIdCamp(tickets.CampTypeUID)].Image}/>
                                                    <div style={{display:"flex", justifyContent:"end", alignItems:"end", marginBottom:"10px"}}>
                                                    </div>
                                                </div>
                                                <button onClick={(e) => handleDelete(e, tickets.id)} style={{marginTop: '10px'}} className={'button'}>Удалить билет</button>
                                                <hr/>
                                            </Form>
                                            : null
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default ModalSchedule;
