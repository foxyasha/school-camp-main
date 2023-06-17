import React, {useEffect, useState} from 'react';
import Head from "../UI/Head";
import {Image} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import {getDoc, doc, deleteDoc, onSnapshot, collection} from "firebase/firestore";
import {auth, db} from "../UI/firebaseConfig";
import ValidData from "../../ValidData";
import Loader from "../UI/Loader";


const initialState = {
    Title: "",
    Description: "",
    SecondImage: "",
};

const News = () => {
    const { id } = useParams();
    const [data, setData] = useState(initialState);
    const [role, setRole] = useState(false)
    const navigate = useNavigate();
    const [loadings, setLoading] = useState(true);



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

    useEffect(() =>{
        id && getSingleNews();
    }, [id]);

    const getSingleNews = async () =>{
        const docRef = doc(db, "News", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()){
            setData(({...snapshot.data()}))
        }
        setLoading(false);
    }


    const handleDelete = async (id) =>{
        if(window.confirm("Вы уверены, что хотите удалить новость?")){
            try{
                await deleteDoc(doc(db, "News", id));
                setData(data.filter((data) => data.id !== id))
                ValidData('Новость удалена успешно!', true)
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
            <div className="container wrapper" style={{paddingTop: "35px"}}>
                    <Image src={data.SecondImage} className="imgnews"/>
                <div className="wrapper2">
                    <h1>{data.Title}</h1>
                    <h5>{data.Description}</h5>
                    <div  hidden={!role} style={{marginTop:"auto"}}>
                        <button className='button' style={{width: "150px", height: "50px", fontWeight: "500", fontSize: "18px", float: "left"}}
                                onClick={() => navigate(`/updateNews/${id}`)}>
                            <span className='bold'>Изменить</span>
                        </button>
                        <button style={{width: "150px", height: "50px", fontWeight: "500", fontSize: "18px", float: "right"}} className="button"
                                onClick={() => handleDelete(id)}>
                            <span className='bold'>Удалить</span>
                        </button>
                    </div>

                </div>

            </div>
        </>
    );
}

export default News;