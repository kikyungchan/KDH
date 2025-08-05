import React from "react";
import "./BestProductSection.css";

function BestProductSection() {
  // 일단 더미 데이터로 시작
  const bestProducts = [
    {
      id: 1,
      image: "/CategoryImage/top.png", // 실제 썸네일로 교체 예정
      name: "상품명 1",
      price: 34900,
    },
    {
      id: 2,
      image: "/CategoryImage/bottom.png",
      name: "상품명 2",
      price: 16800,
    },
    {
      id: 3,
      image: "/CategoryImage/shoes.png",
      name: "상품명 3",
      price: 32900,
    },
  ];

  return (
    <div className="best-product-section">
      <h3 className="best-title">베스트</h3>
      <div className="best-product-list">
        {bestProducts.map((product, idx) => (
          <div className="best-product-card" key={product.id}>
            <img
              src={product.image}
              alt={product.name}
              className="best-product-img"
            />
            <div className="best-product-name">{product.name}</div>
            <div className="best-product-price">
              {product.price.toLocaleString()}원
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BestProductSection;
