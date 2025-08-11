import React from "react";
import { useNavigate } from "react-router";

function LeftVisual({ data }) {
  const navigate = useNavigate();

  if (!data || !data.storedPath) {
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
        style={{ opacity: 1 }}
      />
      <div className="main-visual-text">
        <h2>보는 맛까지 잡은 나의 요거트볼 모음 🍓</h2>
        <p>by. KDH 쇼핑몰</p>
      </div>
    </div>
  );
}

export default LeftVisual;
