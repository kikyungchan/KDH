import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

function LeftVisual() {
  const [visualData, setVisualData] = useState({
    data: null,
    isLoaded: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/product/main-thumbnail-random")
      .then((res) => {
        setVisualData({
          data: res.data,
          isLoaded: true,
        });
      })
      .catch((err) => console.error("좌측 비주얼 로딩 실패:", err));
  }, []);

  const { data, isLoaded } = visualData;

  if (!data || !data.storedPath) {
    // 아직 로딩 전이면 placeholder 보여줌 (공간 유지)
    return (
      <div className="main-visual-box placeholder">
        <div className="image-placeholder" />
      </div>
    );
  }

  return (
    <div className="main-visual-box">
      <img
        src={data.storedPath}
        onClick={() => navigate(`/product/view?id=${data.productId}`)}
        alt="HOT 상품"
        className="main-visual-img"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.4s ease-in-out",
        }}
      />
      <div className="main-visual-text">
        <h2>보는 맛까지 잡은 나의 요거트볼 모음 🍓</h2>
        <p>by. KDH 쇼핑몰</p>
      </div>
    </div>
  );
}

export default LeftVisual;
