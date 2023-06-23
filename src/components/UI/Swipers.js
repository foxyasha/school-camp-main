import React, {useRef} from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../App.css"
import {Pagination, Navigation, Autoplay} from "swiper";
import {Container, Image} from "react-bootstrap";
import {useNavigate} from "react-router-dom";

const Swipers = (props) =>{
    const navigate = useNavigate();


    const progressCircle = useRef(null);
    const progressContent = useRef(null);
    const onAutoplayTimeLeft = (s, time, progress) => {
        progressCircle.current.style.setProperty('--progress', 1 - progress);
        progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    };


    return (
        <div style = {{height: "400px", marginBottom:"30px"}}>

            <Swiper
                spaceBetween={30}
                centeredSlides={true}
                autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                }}
                loop={true}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                onAutoplayTimeLeft={onAutoplayTimeLeft}
                className="mySwiper imageswiper"
            >
                {props.news && props.news.map((news)=>(
                    <SwiperSlide key={news.id}>
                        <Image src={news.Image} onClick={() => navigate(`/news/${news.id}`)}/>
                    </SwiperSlide>
                ))}
                <div className="autoplay-progress " slot="container-end">
                    <svg viewBox="0 0 48 48" ref={progressCircle}>
                        <circle cx="24" cy="24" r="20"></circle>
                    </svg>
                    <span ref={progressContent}></span>
                </div>
            </Swiper>
        </div>
    );
}
export default Swipers;