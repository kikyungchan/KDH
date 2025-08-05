// Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const [hotItem, setHotItem] = useState(null);

  useEffect(() => {
    axios
      .get("/api/product/hot-random")
      .then((res) => {
        console.log("hot:", res.data);
        if (res.data.length > 0) {
          const randomOne = res.data[0];
          setHotItem(randomOne);
        }
      })
      .catch((err) => console.error("HOT 상품 불러오기 실패:", err));
  }, []);

  return (
    <div className="container">
      <section className="main-visual">
        {hotItem && (
          <div className="main-visual-box">
            <img
              src={hotItem.thumbnailUrl}
              alt="HOT 상품"
              className="main-visual-img"
            />
            <div className="main-visual-text">
              <h2>보는 맛까지 잡은 나의 요거트볼 모음 🍓</h2>
              <p>by. KDH 쇼핑몰</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;
