import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { useNavigate } from "react-router";
import CategoryMenu from "./CategoryMenu.jsx";
import BestProductSection from "./BestProductSection.jsx";
import LeftVisual from "./LeftVisual.jsx";

function Home() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(1);
  const [shuffledItems, setShuffledItems] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    // 우측배너
    axios
      .get("/api/product/hot-random")
      .then((res) => {
        const sliced = res.data.slice(0, 10);
        const messages = [
          "첫구매 최대 2만원 할인!",
          "인기상품 특가!",
          "한정 수량 할인!",
        ];
        const shuffled = [...sliced]
          .sort(() => Math.random() - 0.5)
          .map((item) => ({
            ...item,
            message: messages[Math.floor(Math.random() * messages.length)],
          }));
        setShuffledItems(shuffled);
      })
      .catch((err) => console.error("HOT 상품 불러오기 실패:", err));
  }, []);

  return (
    <>
      <div className="container">
        <section className="main-visual-row">
          <LeftVisual />

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
              {shuffledItems.map((item, idx) => {
                return (
                  <SwiperSlide key={idx}>
                    <div
                      className="hot-thumbnail"
                      onClick={() => navigate(`/product/view?id=${item.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <img src={item.thumbnailUrl} alt={item.productName} />
                      <div className="hot-slide-text">{item.message}</div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* 인덱스 표시 */}
            <div className="slide-index-indicator">
              {currentIndex} / {shuffledItems.length}
            </div>
          </div>
        </section>
        <CategoryMenu />
        <BestProductSection />
      </div>
    </>
  );
}

export default Home;
