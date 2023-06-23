import {Link, useNavigate, useParams} from "react-router-dom";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import {addDoc, serverTimestamp, collection, doc, updateDoc, getDoc, onSnapshot} from "firebase/firestore"
import {auth, db, storage} from "../UI/firebaseConfig";
import React, {useEffect, useState} from "react";
import ValidData from "../../ValidData";
import {Form} from "react-bootstrap";
import camps from "./Camps";
import {useAuthState} from "react-firebase-hooks/auth";
import Loader from "../UI/Loader";


const initialState = {
    Title: "",
    Description: "",
    Price: "",
    StartDate: "",
    EndDate: "",
    ScheduleUid: "",
    Image: "",
};

const AddNews = () => {

    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [data, setData] = useState(initialState);
    const {Title, Description, Price, StartDate, EndDate, ScheduleUid} = data;
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, loading] = useAuthState(auth);
    const [role, setRole] = useState([])
    const [loadings, setLoading] = useState(true);

    useEffect(()=>{
        const uploadFile = () =>{
            const name = new Date().getTime() + file.name;
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            if(file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg'){
                document.getElementById('addNews').disabled = false;
            } else {
                ValidData("Неверный формат файла", false)
                document.getElementById('addNews').disabled = true;
                return;
            }

            uploadTask.on("state_changed", (snapshot) =>{
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(progress);
                    switch (snapshot.state){
                        case "paused":
                            console.log("Upload is Pause");
                            break;
                        case "running":
                            console.log("Upload is Running");
                            break;
                        default:
                            break;
                    }
                }, (error) =>{
                    console.log(error)
                },
                () =>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>{
                        setData((prev) => ({...prev, Image: downloadURL}));
                    });
                }
            );
        };
        file && uploadFile()
    }, [file]);

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


    const handleClick = (e) =>{
        setData({ ...data, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        setIsSubmit(true);
        if(!id){
            await addDoc(collection(db, "CampType"), {
                ...data,
                timestamp: serverTimestamp()
            })
            ValidData('Отряд добавлен!', true)
        }else{
            try{
                await updateDoc(doc(db,"CampType", id),{
                    ...data
                });
                ValidData('Отряд изменен!', true)
            } catch (error){
                console.log(error);
            }
        }
        navigate ("/")
    }

    useEffect(() =>{
        id && getSingleCamp();
    }, [id]);

    const getSingleCamp = async () =>{
        const docRef = doc(db, "CampType", id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()){
            setData(({...snapshot.data()}))
        }
    }


    if(!user || !role){
        navigate("/")
    }

    return (
        loadings ? <Loader/> :
            <div className={'modalwindow login'}>
            <div className={'form'}>
                <div className={'form_content'}>
                    <h1>{id ? "Изменить отряд" : "Добавить отряд" }</h1>
                    <Form onSubmit={handleSubmit} >
                        <input placeholder={'Название'}  type={'text'} onChange={handleClick} value={Title} name="Title"  required/>
                        <input placeholder={'Описание'} type={'text'} onChange={handleClick} value={Description} name="Description" required/>
                        <input placeholder={'Цена'} type={'number'} onChange={handleClick} value={Price} name="Price" required/>
                        <input placeholder={'Дата начала'} type={'date'} onChange={handleClick} value={StartDate} name="StartDate" required/>
                        <input placeholder={'Дата окончания'} type={'date'} onChange={handleClick} value={EndDate} name="EndDate" required/>
                        <input type={'file'} id="file" onChange={(e)=> setFile(e.target.files[0])} required/>
                        <button className={'button'} id="addNews" disabled={progress !== null && progress < 100}>Добавить</button>
                    </Form>
                </div>
            </div>
            <Link to = "/">
                <div className={'btn-close'}/>
            </Link>

        </div>
    );
}

export default AddNews;