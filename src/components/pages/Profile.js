import {Link, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {collection, deleteDoc, doc, getDoc, onSnapshot} from "firebase/firestore";
import {auth, db} from "../UI/firebaseConfig";
import Loader from "../UI/Loader";
import Head from "../UI/Head";
import {Container} from "react-bootstrap";
import avatar from "../../profile.png"
import editbutton from "../../edit.png"
import deletebutton from "../../deletebutton.png"
import {signOut} from "firebase/auth";
import ValidData from "../../ValidData";
import Modal from "../UI/ModalComp";
import ModalTicket from "../UI/ModalTicket";
import ModalMyTickets from "../UI/ModalMyTickets";
import ModalSchedule from "../UI/ModalSchedule";


const initialState = {
    name: "",
    surname: "",
    patronymic: "",
    birthday: "",
    phone: ""
};

const Profile = () => {

    const { id } = useParams();
    const [data, setData] = useState(initialState);
    const [loadings, setLoading] = useState(true);
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false)
    const [openModalTicket, setOpenModalTicket] = useState(false)
    const [openModalMyTicket, setOpenModalMyTicket] = useState(false)
    const [openModalSchedule, setOpenModalSchedule] = useState(false)
    const [childrens, setChildrens] = useState([]);

    useEffect(() =>{
        id && getSingleUser();
    }, [id]);

    const getSingleUser = async () =>{
        const docRef = doc(db, "Users", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()){
            setData(({...snapshot.data()}))
        }
        setLoading(false);
    }

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

    const logout = () =>{
        signOut(auth).then(() => {
            navigate("/");
            ValidData("Вы успешно вышли из аккаунта", true)
        }).catch((error) => {

        });
    }


    const handleClick = (item) =>{
        setOpenModal(true)
    }
    const handleClickTicket = (item) =>{
        setOpenModalTicket(true)
    }
    const handleClickMyTicket = (item) =>{
        setOpenModalMyTicket(true)
    }
    const handleClickSchedule = (item) =>{
        setOpenModalSchedule(true)
    }

    const handleDelete = async (id) =>{
            try{
                await deleteDoc(doc(db, "Childrens", id));
                setChildrens(childrens.filter((childrens) => childrens.id !== id))
                ValidData('Данные удалены успешно!', true)

            } catch(err){
                console.log(err);
            }
    }


    return (
        loadings ? <Loader/> :
            <div>
                <Head />
                <Container className={'profile'}>
                    <h1>Профиль</h1>
                    <div className={'profile-body'}>
                        <div className={'profile-body_left'}>
                            <div className={'profile-avatar_box'}>
                                <img src={avatar} alt={'avatar'}/>
                                <div className={'profile-avatar_info'}>
                                    <h5>{data.surname} {data.name} {data.patronymic}</h5>
                                </div>
                            </div>
                            <div className="profile-nav">
                                <ul className="profile_menu">
                                    <li onClick={() => handleClick()} className="to-left">Добавить ребенка</li>
                                    <li onClick={() => handleClickTicket()} className="to-left">Доступные отряды</li>
                                    <li onClick={() => handleClickMyTicket()} className="to-left">Мои билеты</li>
                                    <li onClick={() => handleClickSchedule()} className="to-left">Расписания</li>
                                </ul>
                            </div>
                        </div>
                        <div className={'profile-body_right'}>
                            <h3>Ваша информация</h3>
                            <div className={'profile-info'}>
                                <div>
                                    <h6>ФИО</h6>
                                    <p>{data.surname} {data.name} {data.patronymic}</p>
                                </div>
                                <div>
                                    <h6>Почта</h6>
                                    <p>{auth.currentUser.email}</p>
                                </div>
                                <div>
                                    <h6>Телефон</h6>
                                    <p>+{data.phone}</p>
                                </div>
                                <div>
                                    <h6>Дата рождения</h6>
                                    <p>{data.birthday}</p>
                                </div>
                            </div>
                            <div className={'d-flex'}>
                                <button className={'button'} onClick={() => navigate(`/editProfile/${id}`)}>Редактировать профиль</button>
                                <button style={{background: "blueviolet", margin: "0 10px"}} onClick={logout} className={'button'}>Выход</button>
                            </div>
                            <br/>
                            <br/>
                            <h3>Информация о детях</h3>
                            {childrens && childrens.map((childrens)=>(
                                <div className="children-info">
                                    <div>
                                        <h6>ФИО</h6>
                                        <p>{childrens.surname} {childrens.name} {childrens.patronymic}</p>
                                    </div>
                                    <div>
                                        <h6>Дата рождения</h6>
                                        <p>{childrens.birthday}</p>
                                    </div>
                                        <div>
                                            <button onClick={() => handleDelete(childrens.id)} className="btn"><img src={deletebutton} style={{width:"25px", height: "25px"}}></img></button>
                                        </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </Container>
                <Modal open={openModal} close={() => {setOpenModal(false)}}  />
                <ModalTicket open={openModalTicket} close={() => {setOpenModalTicket(false)}}  />
                <ModalMyTickets open={openModalMyTicket} close={() => {setOpenModalMyTicket(false)}}  />
                <ModalSchedule open={openModalSchedule} close={() => {setOpenModalSchedule(false)}}/>

            </div>
    );

}

export default Profile;