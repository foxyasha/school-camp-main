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
    const [day, setDay] = useState('');
    const [time, setTime] = useState('');
    const [event, setEvent] = useState('');
    const [role, setRole] = useState([])
    const [loadings, setLoading] = useState(true);

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

    const handleDayChange = (e) => {
        setDay(e.target.value);
    };

    const handleTimeChange = (e) => {
        setTime(e.target.value);
    };

    const handleEventChange = (e) => {
        setEvent(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const eventData = {
                campTypeUid: id,
                day: day,
                time: time,
                event: event,
            };
            const docRef = await addDoc(collection(db, 'Schedule'),{
                ...eventData
            })
            setDay('');
            setTime('');
            setEvent('');
            ValidData("Событие успешно добавлено", true)
        } catch (error) {
            console.error('Ошибка при добавлении события:', error);
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
                            <select value={day} onChange={handleDayChange} style={{marginTop:"10px"}}>
                                <option value="">Выберите день</option>
                                <option value="Понедельник">Понедельник</option>
                                <option value="Вторник">Вторник</option>
                                <option value="Среда">Среда</option>
                                <option value="Четверг">Четверг</option>
                                <option value="Пятница">Пятница</option>
                                <option value="Суббота">Суббота</option>
                                <option value="Воскресенье">Воскресенье</option>
                            </select>
                            <input placeholder="Время" type="time" value={time} onChange={handleTimeChange} />
                            <input placeholder="Событие" value={event} onChange={handleEventChange} />
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