import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function Carousel() {
    return (
        <div className=" pad text-center">
        <Swiper
            modules={[Navigation, Autoplay]}
            loop={true}
            autoplay={{ delay: 3000 }}
            navigation className="navigation"
            
            breakpoints={{
                1024: { slidesPerView: 5 },
                770: { slidesPerView: 2 },
                0: { slidesPerView: 1 },
            }}
        >
            <SwiperSlide>
                <img src="img/logo1.jpg" className="img-fluid m-auto" />
            </SwiperSlide>

            <SwiperSlide>
                <img src="img/logo2.jpg" className="img-fluid m-auto" />
            </SwiperSlide>

            <SwiperSlide>
                <img src="img/logo3.jpg" className="img-fluid m-auto" />
            </SwiperSlide>

            <SwiperSlide>
                <img src="img/logo4.jpg" className="img-fluid m-auto" />
            </SwiperSlide>

            <SwiperSlide>
                <img src="img/logo1.jpg" className="img-fluid m-auto" />
            </SwiperSlide>

            <SwiperSlide>
                <img src="img/logo2.jpg" className="img-fluid m-auto" />
            </SwiperSlide>
        </Swiper>
        </div>
      
    );
}

export default Carousel;
