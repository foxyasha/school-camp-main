import React, {useEffect, useState} from 'react';
import Head from "../UI/Head";
import {Image} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {getDoc, doc, onSnapshot, collection, deleteDoc} from "firebase/firestore";
import {auth, db} from "../UI/firebaseConfig";
import ValidData from "../../ValidData";
import Loader from "../UI/Loader";



const Camps = () => {
    const [loadings, setLoading] = useState(false);
    const [camps, setCamps] = useState([]);
    const navigate = useNavigate();
    const [role, setRole] = useState(false)


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
        setLoading(false);
    }, []);

    useEffect(()=>{
        const unsub = onSnapshot(collection(db,"Users"), (snapshot) =>{
            snapshot.docs.forEach((doc) =>{
                if(auth.currentUser?.uid === doc.data().userUid){
                    setRole(doc.data().role)
                }
            });
        }, (error)=>{
            console.log(error);
        })
        return() =>{
            unsub();
        }
    }, []);

    const handleDelete = async (id) =>{
        if(window.confirm("Вы уверены, что хотите удалить отряд?")){
            try{
                await deleteDoc(doc(db, "CampType", id));
                setCamps(camps.filter((camps) => camps.id !== id))
                ValidData('Отряд удален успешно!', true)
                navigate("/")
            } catch(err){
                console.log(err);
            }

        }
    }



    return (
        loadings ? <Loader/> :
        <>
            <Head/>
            {camps && camps.map((camps)=>(

                <div className="container wrapper" style={{paddingTop: "35px"}}>
                    <Image src={camps.Image} className="imgcamp"/>
                <div className="wrapper3">
                    <h1>{camps.Title}</h1>
                    <h5>{camps.Description}</h5>
                    <h5 style={{paddingTop: "20px"}}>Цена: {camps.Price} рублей</h5>
                    <h5>Дата начала: {camps.StartDate}
                        <h5>Дата окончания {camps.EndDate}</h5>
                        <div style={{margin:"auto"}} hidden={!role}>
                            <button className='button' style={{width: "150px", height: "50px", fontWeight: "500", fontSize: "18px", float: "left", marginRight: "10px"}}
                                    onClick={() => navigate(`/updateCampType/${camps.id}`)}>
                                <span className='bold'>Изменить</span>
                            </button>

                            <button className='button' style={{width: "150px", height: "50px", fontWeight: "500", fontSize: "18px", float: "left", marginRight: "10px"}}
                                    onClick={() => navigate(`/addSchedule/${camps.id}`)}>
                                <span className='bold'>Добавить расписание</span>
                            </button>

                            <button style={{width: "150px", height: "50px", float: "right", fontWeight: "400", marginLeft: "10px"}} className="button"
                                    onClick={() => handleDelete(camps.id)}>
                                <span className='bold'>Удалить</span>
                            </button>

                        </div>

                    </h5>
                </div>
            </div>
                ))}
        </>
    );
}

export default Camps;