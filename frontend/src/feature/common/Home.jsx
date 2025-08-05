import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

function Home() {
  const [hotItems, setHotItems] = useState([]);
  const swiperRef = useRef(null); // ✅ Swiper 인스턴스 저장용

  useEffect(() => {
    axios
      .get("/api/product/hot-random")
      .then((res) => {
        setHotItems(res.data);
      })
      .catch((err) => console.error("HOT 상품 불러오기 실패:", err));
  }, []);

  return (
    <div className="container">
      <section className="main-visual-row">
        {/* 좌측 비주얼 */}
        <div className="main-visual-box">
          {hotItems[0] && (
            <>
              <img
                src={hotItems[0].thumbnailUrl}
                alt="HOT 상품"
                className="main-visual-img"
              />
              <div className="main-visual-text">
                <h2>보는 맛까지 잡은 나의 요거트볼 모음 🍓</h2>
                <p>by. KDH 쇼핑몰</p>
              </div>
            </>
          )}
        </div>

        {/* 우측 HOT 슬라이드 */}
        <div className="hot-items-carousel">
          {/* 직접 만든 좌/우 버튼 */}
          <button
            className="custom-nav-btn left"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            ❮
          </button>
          <button
            className="custom-nav-btn right"
            onClick={() => swiperRef.current?.slideNext()}
          >
            ❯
          </button>

          <Swiper
            onSwiper={(swiper) => (swiperRef.current = swiper)} // ✅ Swiper 인스턴스 참조
            direction="horizontal"
            modules={[Autoplay]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            slidesPerView={1}
            loop={hotItems.length > 2}
            className="hot-swiper"
          >
            {hotItems
              .sort(() => Math.random() - 0.5)
              .slice(0, 10)
              .map((item, idx) => (
                <SwiperSlide key={idx}>
                  <div className="hot-thumbnail">
                    <img src={item.thumbnailUrl} alt={item.productName} />
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
}

export default Home;
