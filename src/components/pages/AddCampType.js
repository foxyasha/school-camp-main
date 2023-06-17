import {Link, useNavigate, useParams} from "react-router-dom";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage"
import {addDoc, serverTimestamp, collection, doc, updateDoc, getDoc} from "firebase/firestore"
import {db, storage} from "../UI/firebaseConfig";
import {useEffect, useState} from "react";
import ValidData from "../../ValidData";
import {Form} from "react-bootstrap";
import camps from "./Camps";


const initialState = {
    Title: "",
    Description: "",
    Price: "",
    StartDate: "",
    EndDate: "",
    Image: "",
};

const AddNews = () => {

    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [data, setData] = useState(initialState);
    const {Title, Description, Price, StartDate, EndDate} = data;
    const { id } = useParams();
    const navigate = useNavigate();


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

    return (
        <div className={'modalwindow login'}>
            <div className={'form'}>
                <div className={'form_content'}>
                    <h1>{id ? "Изменить отряд" : "Добавить отряд" }</h1>
                    <Form onSubmit={handleSubmit} >
                        <input placeholder={'Название'}  type={'text'} onChange={handleClick} value={Title} name="Title"  required/>
                        <input placeholder={'Описание'} type={'text'} onChange={handleClick} value={Description} name="Description" required/>
                        <input placeholder={'Цена'} type={'text'} onChange={handleClick} value={Price} name="Price" required/>
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