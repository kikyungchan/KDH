import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/mousewheel";
import "./MainSlide.css";

function MainSlide() {
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    axios
      .get("/api/product/hot-random")
      .then((res) => {
        console.log("슬라이드 데이터:", res.data);
        setSlides(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <Swiper
      direction="vertical"
      slidesPerView={1}
      spaceBetween={0}
      loop={true}
      mousewheel={true}
      // autoplay={{ delay: 3000 }}
      modules={[Mousewheel, Pagination]}
      pagination={{
        clickable: true,
      }}
      className="mainSwiper"
    >
      {slides.map((product, index) => (
        <SwiperSlide key={index}>
          <div
            className="slide"
            style={{
              backgroundImage: `url(${product.thumbnailUrl})`,
            }}
          >
            <div className="overlay">
              <h1>{product.productName}</h1>
              <p>{product.price.toLocaleString()}원</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default MainSlide;
