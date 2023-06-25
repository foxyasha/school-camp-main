import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../UI/firebaseConfig";
import {signOut} from "firebase/auth";
import ValidData from "../../ValidData";
import {collection, onSnapshot, } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.css"
import {Container, Navbar, Spinner} from "react-bootstrap";
import addCampType from "../pages/AddCampType";

const Head = () => {
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    const [role, setRole] = useState(false)
    const [loadings, setLoading] = useState(false);
    const [users, setUsers] = useState([]);

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

    useEffect(()=>{
        setLoading(true);
        const unsubs = onSnapshot(collection(db,"Users"), (snapshot) =>{
            let list = [];
            snapshot.docs.forEach((doc) =>{
                if(auth.currentUser?.uid === doc.data().userUid){
                    list.push({id: doc.id, ...doc.data()})
                }
            });
            setUsers(list);
            setLoading(false);
        }, (error)=>{
            console.log(error);
        })
        return() =>{
            unsubs();
        }
    }, []);

    const logout = () =>{
        signOut(auth).then(() => {
            navigate("/");
            ValidData("Вы успешно вышли из аккаунта", true)
        }).catch((error) => {

        });
    }

    const addNews = () =>{
        navigate("/addNews")
    }
    const addCampType = () =>{
        navigate("/addCampType")
    }

    const profile = () =>{
        navigate("/profile")
    }

    function openWindow() {
        document.getElementById("myDropdown").classList.toggle("show");
    }

    window.onclick = function(event) {
        if (!event.target.matches('.dropbtn')) {

            var dropdowns = document.getElementsByClassName("dropdown-content");
            var i;
            for (i = 0; i < dropdowns.length; i++) {
                var openDropdown = dropdowns[i];
                if (openDropdown.classList.contains('show')) {
                    openDropdown.classList.remove('show');
                }
            }
        }
    }

    return (
        <div className={'header'}>
            <Container className={"d-flex justify-content-between align-items-center"}>
                <div className={'header_logo'}>
                    <Navbar.Brand href="/">
                        <div>
                            <h2 className="textlogo">Совёнок</h2>
                        </div>
                    </Navbar.Brand>

                    <div className="dropdown">
                        <button className="button dropbtn" onClick={openWindow}>Информация</button>
                        <div id="myDropdown" className="dropdown-content">
                            <a href="#">Основная информация</a>
                            <a href="#">Нормативные документы</a>
                            <a href="/camps">Лагеря и отряды</a>
                        </div>
                    </div>
                </div>
                <nav>
                    <Link to="/login" hidden={user}>
                        <button className={'button'} >
                            Войти
                        </button>
                    </Link>
                    <Link to="/registration" hidden={user}>
                        <button className={'button'}>
                            Зарегистрироваться
                        </button>
                    </Link>
                    <div hidden={!user}>
                        <a className="menu">
                            <span className="menu-title">Личный кабинет</span>
                            {users && users.map((users)=>(
                                <ul className="menu-dropdown" key={users.id}>
                                    <li hidden={!role} onClick={addNews}>Добавить новость</li>
                                    <li hidden={!role} onClick={addCampType}>Добавить отряды</li>
                                    <li hidden={role} onClick={() => navigate(`/profile/${users.id}`)}>Профиль</li>
                                    <li hidden={!role} onClick={logout}>Выйти</li>
                                </ul>
                            ))}
                        </a>
                    </div>
                </nav>
            </Container>
        </div>
    );
}

export default Head;