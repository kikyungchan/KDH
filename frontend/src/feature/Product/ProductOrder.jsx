import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";

function Order(props) {
  const { state } = useLocation();
  // const navigate = useNavigate();
  const [quantity, setQuantity] = useState(state?.quantity || 1);

  if (!state) {
    return <div>잘못된 접근입니다.</div>;
  }

  const totalPrice = state.price * quantity;

  return (
    <div>
      <h2>주문 확인</h2>
      <img src={state.imagePath} width={200} alt="상품 이미지" />
      <p>상품명 : {state.productName}</p>
      <p>가격 : {state.price.toLocaleString()}원</p>
      <p>
        수량 :
        <input
          onChange={(e) => setQuantity(Number(e.target.value))}
          value={quantity}
          min={1}
          max={99}
          type="text"
        />
      </p>
      <p>총 금액 : {totalPrice.toLocaleString()}원</p>
    </div>
  );
}

export default Order;
