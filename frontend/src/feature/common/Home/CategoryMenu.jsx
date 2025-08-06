import React from "react";
import "./CategoryMenu.css";
import { useNavigate } from "react-router";

const categories = [
  { name: "모자", value: "hat", image: "/CategoryImage/hat.png" },
  { name: "겉옷", value: "outer", image: "/CategoryImage/outer.png" },
  { name: "상의", value: "top", image: "/CategoryImage/top.png" },
  { name: "하의", value: "bottom", image: "/CategoryImage/bottom.png" },
  { name: "신발", value: "shoes", image: "/CategoryImage/shoes.png" },
  { name: "가방", value: "shoes", image: "/CategoryImage/bag.png" },
  { name: "양말", value: "shoes", image: "/CategoryImage/socks.png" },
  { name: "벨트", value: "shoes", image: "/CategoryImage/belt.png" },
];

function CategoryMenu() {
  const navigate = useNavigate();

  const handleClick = (categoryValue) => {
    navigate(`/product/list?category=${encodeURIComponent(categoryValue)}`);
  };

  return (
    <div className="category-menu-wrapper">
      <h3 className="category-title">카테고리별 상품 찾기</h3>
      <div className="category-list-scroll">
        {categories.map((cat, idx) => (
          <div
            className="category-item"
            key={idx}
            onClick={() => handleClick(cat.value)}
          >
            <img src={cat.image} alt={cat.name} className="category-img" />
            <div className="category-label">{cat.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryMenu;
