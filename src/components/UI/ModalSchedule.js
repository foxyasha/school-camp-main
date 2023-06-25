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
    const dayWeek = [
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
        "Воскресенье",
    ];
    const [time, setTime] = useState([]);

    useEffect(()=>{
        setLoading(true);
        onSnapshot(collection(db,"CampType"), (snapshot) =>{
            let list = [];
            snapshot.docs.forEach((doc) =>{
                list.push({id: doc.id, ...doc.data()})
            });
            setCamps(list);
            setLoading(false);
        }, (error)=>{
            console.log(error);
        })

        onSnapshot(collection(db,"Childrens"), (snapshot) =>{
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

        onSnapshot(collection(db,"Tickets"), (snapshot) =>{
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

        onSnapshot(collection(db,"Schedule"), (snapshot) =>{
            let list = [];
            let time = [];
            snapshot.docs.forEach((doc) =>{
                list.push({id: doc.id, ...doc.data()})
                if (!time.includes(doc.data().time)) {
                    time.push(doc.data().time)
                }
            });
            setSchedule(list);
            setTime(time.sort())
            setLoading(false);
        }, (error)=>{
            console.log(error);
        })
        setLoading(false);
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
    if (!open) return null;

    return (
        loadings ? <Loader/> :
            <div  className='overlay modalBack modalAnimation'>
                <div style={{maxWidth: '850px'}} className='modalContainer'>
                    <div style={{width: '850px'}} className='modalRight '>
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
                                                camps.id === tickets.CampTypeUID ?
                                                <div>
                                                    <table>
                                                        <tr>
                                                            <th>Время</th>
                                                            {dayWeek.map(day => <th>{day}</th>)}
                                                        </tr>
                                                        {/*{schedule && schedule.map((schedule) =>
                                                            camps.id === schedule.campTypeUid ?
                                                        <tr>
                                                            {time.map(time => <td>{time}</td>)}
                                                            {dayWeek.map(day => <td>{schedule.day === day ? schedule.event : null}</td>)}
                                                        </tr>
                                                                : null
                                                        )}*/}

                                                        {time.map(time =>
                                                            <tr>
                                                                <td>{time}</td>
                                                                {schedule && schedule.map((schedule) =>
                                                                    camps.id === schedule.campTypeUid ?
                                                                        time === schedule.time ? dayWeek.map(day => schedule.day === day ? <td>{schedule.event}</td> : null) : <td></td>
                                                                    : null
                                                                )}
                                                            </tr>
                                                        )}
                                                    </table>
                                                </div>
                                                    : null
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
