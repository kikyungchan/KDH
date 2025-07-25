import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router";

function Order(props) {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(state?.quantity || 1);

  if (!state) {
    return <div>잘못된 접근입니다.</div>;
  }

  const totalPrice = state.price * quantity;

  function handleCancleButton() {
    alert("주문이 취소되었습니다.");
    navigate(-1);
  }

  return (
    <div>
      <h2>결제 하기</h2>
      <img src={state.imagePath} width={200} alt="상품 이미지" />
      <p>상품명 : {state.productName}</p>
      <p>가격 : {state.price.toLocaleString()}원</p>
      <p>수량 : {state.quantity}개</p>
      <p>총 금액 : {totalPrice.toLocaleString()}원</p>
      <button>결제하기</button>
      <button onClick={handleCancleButton}>취소</button>
    </div>
  );
}

export default Order;
