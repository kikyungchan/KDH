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
        console.log(res.data);
        setBestProducts(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="best-product-section">
      <h3 className="best-title">베스트</h3>
      <div className="best-product-list">
        {bestProducts.map((product) => {
          const rating = Number(product.averageRating ?? 0).toFixed(1);
          const reviews = product.reviewCount ?? 0;
          return (
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
              <div className="best-product-rating">
                ⭐ {rating}점 ({reviews}개)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BestProductSection;
