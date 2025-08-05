import React, { useEffect, useState } from "react";
import "./BestProductSection.css";
import axios from "axios";
import { useNavigate } from "react-router";

function BestProductSection() {
  const [bestProducts, setBestProducts] = useState([]);
  const navigate = useNavigate();
  // 일단 더미 데이터로 시작
  useEffect(() => {
    axios
      .get("/api/product/best")
      .then((res) => {
        setBestProducts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="best-product-section">
      <h3 className="best-title">베스트</h3>
      <div className="best-product-list">
        {bestProducts.map((product) => (
          <div
            className="best-product-card"
            key={product.id}
            onClick={() => navigate(`/product/view?id=${product.id}`)}
          >
            <img
              src={product.thumbnailUrl}
              alt={product.productName}
              className="best-product-img"
            />
            <div className="best-product-name">{product.productName}</div>
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
