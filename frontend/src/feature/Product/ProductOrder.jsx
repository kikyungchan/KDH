import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";

function Order(props) {
  const [address, setAddress] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/product/member/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setAddress(res.data.address);
        })
        .catch((err) => {});
    }
  }, []);

  if (!state) {
    return <div>잘못된 접근입니다.</div>;
  }

  const totalPrice = state.price * state.quantity;

  function handleCancleButton() {
    alert("주문이 취소되었습니다.");
    navigate(-1);
  }

  function handleOrderButton() {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = {
        productId: state.productId,
        quantity: state.quantity,
        optionId: state.optionId, //
        price: state.price,
        shippingAddress: address, // 추후 회원가입시 작성한 주소로 대체
      };
      axios
        .post("/api/product/order", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          alert("주문이 완료되었습니다.");
        })
        .catch((err) => {
          console.log(err);
          alert("주문 실패");
        });
    } else {
      alert("비회원은 아직 미구현");
    }
  }

  return (
    <div>
      <h2>결제 하기</h2>
      <img src={state.imagePath} width={200} alt="상품 이미지" />
      <p>상품명 : {state.productName}</p>
      <p>가격 : {state.price.toLocaleString()}원</p>
      <p>수량 : {state.quantity}개</p>
      <p>총 금액 : {totalPrice.toLocaleString()}원</p>

      <div>
        <label>배송지 주소:</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: "400px", padding: "5px", marginLeft: "10px" }}
        />
      </div>
      <button onClick={handleOrderButton}>결제하기</button>
      <button onClick={handleCancleButton}>취소</button>
    </div>
  );
}

export default Order;
