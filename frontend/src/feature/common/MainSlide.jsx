import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/mousewheel";
import "./MainSlide.css";

function MainSlide() {
  const [slides, setSlides] = useState([]);
  const swiperRef = useRef(null);
  const hasJustReachedEnd = useRef(false);

  useEffect(() => {
    axios
      .get("/api/product/hot-random")
      .then((res) => {
        console.log("슬라이드 데이터:", res.data);
        setSlides(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const wheelHandler = (e) => {
      const swiper = swiperRef.current;
      if (!swiper) return;

      const isLast = swiper.activeIndex === slides.length - 1;
      const isFirst = swiper.activeIndex === 0;

      if (isLast && e.deltaY > 0) {
        if (!hasJustReachedEnd.current) {
          hasJustReachedEnd.current = true;
          setTimeout(() => {
            swiper.slideTo(0);
            hasJustReachedEnd.current = false;
          }, 500);
          e.preventDefault();
        }
      } else if (isFirst && e.deltaY < 0) {
        if (!hasJustReachedEnd.current) {
          hasJustReachedEnd.current = true;
          setTimeout(() => {
            swiper.slideTo(slides.length - 1);
            hasJustReachedEnd.current = false;
          }, 500);
          e.preventDefault();
        }
      } else {
        hasJustReachedEnd.current = false;
      }
    };

    window.addEventListener("wheel", wheelHandler, { passive: false });
    return () => {
      window.removeEventListener("wheel", wheelHandler);
    };
  }, [slides]);

  return (
    <Swiper
      direction="vertical"
      slidesPerView={1}
      spaceBetween={0}
      mousewheel={true}
      modules={[Mousewheel, Pagination]}
      pagination={{
        clickable: true,
      }}
      onSwiper={(swiper) => (swiperRef.current = swiper)}
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
