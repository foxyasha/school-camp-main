import {Link, useNavigate, useParams} from "react-router-dom";
import {addDoc, serverTimestamp, collection, doc, updateDoc, getDoc, onSnapshot} from "firebase/firestore"
import {db, storage} from "../UI/firebaseConfig";
import 'firebase/firestore';
import React, {useEffect, useState} from "react";
import ValidData from "../../ValidData";
import {Dropdown, Form} from "react-bootstrap";



const AddSchedule = () => {

    const { id } = useParams();

    const [day, setDay] = useState('');
    const [time, setTime] = useState('');
    const [event, setEvent] = useState('');

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




    return (
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