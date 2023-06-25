import {Link, useNavigate, useParams} from "react-router-dom";
import {addDoc, serverTimestamp, collection, doc, updateDoc, getDoc, onSnapshot} from "firebase/firestore"
import {auth, db, storage} from "../UI/firebaseConfig";
import 'firebase/firestore';
import React, {useEffect, useState} from "react";
import ValidData from "../../ValidData";
import {Dropdown, Form} from "react-bootstrap";
import {useAuthState} from "react-firebase-hooks/auth";
import Loader from "../UI/Loader";



const AddSchedule = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    const [time, setTime] = useState('');
    const [event, setEvent] = useState([]);
    const [isOneEvent, setIsOneEvent] = useState(false);
    const [role, setRole] = useState([])
    const [loadings, setLoading] = useState(true);
    const dayWeek = [
        "Понедельник",
        "Вторник",
        "Среда",
        "Четверг",
        "Пятница",
        "Суббота",
        "Воскресенье",
    ];

    useEffect(()=>{
        const unsub = onSnapshot(collection(db,"Users"), (snapshot) =>{
            snapshot.docs.forEach((doc) =>{
                if(auth.currentUser?.uid === doc.data().userUid){
                    setRole(doc.data().role)
                    setLoading(false)
                }
            });
        }, (error)=>{
            setLoading(true)
            console.log(error);
        })
        return() =>{
            unsub();
        }
    }, []);

    const handleTimeChange = (e) => {
        setTime(e.target.value);
    };

    const handleEventChange = (e, index) => {
        const updatedAreas = [...event];
        updatedAreas[index] = e.target.value;
        console.log(updatedAreas,e.target.value)
        setEvent(updatedAreas);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            for (let i = 0; i < dayWeek.length; i++) {
                try {
                    const eventData = {
                        campTypeUid: id,
                        day: dayWeek[i],
                        time: time,
                        event: event[isOneEvent ? 0 : i] ? event[isOneEvent ? 0 : i] : "-",
                    };
                    const docRef = await addDoc(collection(db, 'Schedule'),{
                        ...eventData
                    })
                    setTime('');
                    setEvent([]);
                } catch (error) {
                    console.error('Ошибка при добавлении события:', error);
                }
            }
            ValidData("События успешно добавлено", true)
        } catch (e) {
            console.log(e)
        }
    };

    if(!user || !role){
        navigate("/")
    }



    return (
        loadings ? <Loader/> :
            <div className={'modalwindow login'}>
            <div className={'form'}>
                <div className={'form_content'}>
                    <h1>Добавить расписание</h1>
                    <Form onSubmit={handleSubmit}>
                        <input placeholder="Время" type="time" value={time} onChange={handleTimeChange} />
                        <div className="form-check form-switch d-flex align-items-center">
                            <input checked={isOneEvent} onChange={() => setIsOneEvent(!isOneEvent)} className="form-check-input px-5" type="checkbox" id="flexSwitchCheckDefault"/>
                            <label className="form-check-label m-lg-3" htmlFor="flexSwitchCheckDefault">Одно событие на все дни</label>
                        </div>
                        {isOneEvent
                            ? <input style={{width: "100%"}} placeholder="Событие" value={event[0]} onChange={(e) => handleEventChange(e, 0)} />
                            : dayWeek.map((day, index) =>
                                <div className={"d-flex justify-content-between align-items-center"}>
                                    <h6>{day}:</h6>
                                    <input style={{width: "200px"}} placeholder="Событие" value={event[index]} onChange={(e) => handleEventChange(e, index)} />
                                </div>
                            )}
                        <button type="submit" className="button">Добавить</button>
                    </Form>
                </div>
            </div>
            <Link to = "/">
                <div className={'btn-close'}/>
            </Link>

        </div>
    );
}

export default AddSchedule;