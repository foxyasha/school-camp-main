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
    const [schedule, setSchedule] = useState([]);
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

    useEffect(()=>{
        setLoading(true);
        const unsub = onSnapshot(collection(db,"Schedule"), (snapshot) =>{
            let list = [];
            snapshot.docs.forEach((doc) =>{
                list.push({id: doc.id, ...doc.data()})
            });
            setSchedule(list);
            setLoading(false);
        }, (error)=>{
            console.log(error);
        })
        return() =>{
            unsub();
        }
    }, []);



    if (!open) return null;

    return (
        loadings ? <Loader/> :
            <div className='overlay modalBack modalAnimation'>
                <div className='modalContainer'>
                    <div className='modalRight '>
                        <button className={'closeBtn btn-close'} onClick={close}/>
                        <div className='content'>
                            <h1 style={{marginBottom: "20px"}}>Расписание</h1>
                            {childrens && childrens.map((childrens)=>

                                <div style={{width:"100%"}}>
                                {tickets && tickets.map((tickets)=>(
                                    childrens.id === tickets.ChildrenUID ?
                                        <Form>
                                            <h4>Ребенок: {childrens.name}</h4>
                                            <h4>{camps[getIdCamp(tickets.CampTypeUID)].Title}</h4>
                                            {camps && camps.map((camps)=>
                                                <div>
                                                    {schedule && schedule.map((schedule) =>
                                                        camps.id === schedule.campTypeUid ?
                                                            <table>
                                                                <tr>
                                                                    <th> </th>
                                                                    <th>Понедельник</th>
                                                                    <th>Вторник</th>
                                                                    <th>Среда</th>
                                                                    <th>Четверг</th>
                                                                    <th>Пятница</th>
                                                                    <th>Суббота</th>
                                                                    <th>Воскресенье</th>
                                                                </tr>
                                                                <tr>
                                                                    <td>{schedule.time}</td>
                                                                </tr>
                                                                <tr>
                                                                    <td>February</td>
                                                                    <td>$80</td>
                                                                </tr>
                                                            </table>
                                                            : null
                                                    )}
                                                </div>


                                            )}
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
