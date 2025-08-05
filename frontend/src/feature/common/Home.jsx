import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

function Home() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hotItems, setHotItems] = useState([]);
  const [shuffledItems, setShuffledItems] = useState([]); // ✅ 고정 순서
  const swiperRef = useRef(null);

  useEffect(() => {
    axios
      .get("/api/product/hot-random")
      .then((res) => {
        const sliced = res.data.slice(0, 10);
        const shuffled = [...sliced].sort(() => Math.random() - 0.5);
        setHotItems(sliced);
        setShuffledItems(shuffled);
      })
      .catch((err) => console.error("HOT 상품 불러오기 실패:", err));
  }, []);

  return (
    <div className="container">
      <section className="main-visual-row">
        {/* 좌측 비주얼 */}
        <div className="main-visual-box">
          {shuffledItems[0] && (
            <>
              <img
                src={shuffledItems[0].thumbnailUrl}
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
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex + 1)}
            direction="horizontal"
            modules={[Autoplay]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            slidesPerView={1}
            loop={shuffledItems.length > 2}
            className="hot-swiper"
          >
            {shuffledItems.map((item, idx) => (
              <SwiperSlide key={idx}>
                <div className="hot-thumbnail">
                  <img src={item.thumbnailUrl} alt={item.productName} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* 인덱스 표시 */}
          <div className="slide-index-indicator">
            {currentIndex} / {shuffledItems.length}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
