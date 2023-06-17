import React, {useEffect, useState} from 'react';
import {db} from "../UI/firebaseConfig";
import {collection, onSnapshot,} from "firebase/firestore";
import {Image} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css"
import Swipers from "../UI/Swipers";
import Head from "../UI/Head";
import Loader from "../UI/Loader";


const Home = () => {
const [news, setNews] = useState([]);
const [loadings, setLoading] = useState(true);

useEffect(()=>{
    const unsubs = onSnapshot(collection(db,"News"), (snapshot) =>{
        let list = [];
        snapshot.docs.forEach((doc) =>{
            list.push({id: doc.id, ...doc.data()})
        });
        setNews(list);
        setLoading(false);
    }, (error)=>{
        console.log(error);
    })
    return() =>{
        unsubs();
    }
}, []);

return (
    loadings ? <Loader/> :
        <div>
            <Head/>
            <div className="container" style={{paddingTop: "35px"}}>
                <div  className="bgimghome" style={{paddingTop: "35px"}}>
                    <div>
                        <h2 className="bgtext-title">
                            Школьный лагерь "Совёнок"
                        </h2>
                        <label className="bgtext-desc">
                            Окунись в веселье с нашим лагерем!
                        </label>
                    </div>
                    <Image className="image1" src={"https://www.pinecrestschool.org/wp-content/uploads/2022/06/unnamed-4-1-scaled.jpg"}/>
                    <Image className="image2" src={"https://www.cavehillcreek.com.au/wp-content/uploads/2017/11/15975228-1380280761990649-822947999874321935-o_orig.jpg"}/>
                    <Image className="image3" src={"https://static.honeykidsasia.com/wp-content/uploads/2021/03/school-camp-activities.jpeg"}/>
                        </div>
                        </div>
                        <Swipers news={news}/>
                        </div>
                        );
                    }
export default Home;