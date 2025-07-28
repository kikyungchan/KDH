import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import "./css/Order.css";

function Order(props) {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
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
          setName(res.data.name);
          setPhone(res.data.phone);
        })
        .catch((err) => {});
    }
  }, []);

  if (!state) {
    return <div>잘못된 접근입니다.</div>;
  }

  const totalPrice = state.price * state.quantity;
  const shippingFee = totalPrice >= 100000 ? 0 : 3000;

  function handleCancelButton() {
    alert("주문이 취소되었습니다.");
    navigate(-1);
  }

  function handleOrderButton() {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = {
        productId: state.productId,
        quantity: state.quantity,
        optionId: state.optionId,
        price: state.price,
        shippingAddress: address,
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
    <div className="order-container">
      <h2>결제하기</h2>

      {/* 주문 상품 정보 */}
      <div className="order-box">
        <h4>주문 상품 정보</h4>
        <div className="order-product">
          <img src={state.imagePath} width={100} alt="상품" />
          <div className="order-product-info">
            <div>
              <strong>{state.productName}</strong>
            </div>
            <div>
              {state.option} / {state.quantity}개
            </div>
            <div>{state.price.toLocaleString()}원</div>
            <div className="delivery-fee">
              배송비 {shippingFee.toLocaleString()}원
            </div>
          </div>
        </div>
      </div>

      {/* 주문자 정보 */}
      <div className="order-box">
        <h4>주문자 정보</h4>
        <div className="order-input-row">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            className="order-input-half"
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="연락처"
            className="order-input-half"
          />
        </div>
        <input
          type="text"
          value={address}
          placeholder="주소"
          onChange={(e) => setAddress(e.target.value)}
          className="order-input-full"
        />
      </div>

      {/* 배송 정보 */}
      <div className="order-box">
        <h4>배송 정보</h4>
        <div style={{ marginBottom: "10px" }}>
          <input type="checkbox" />
          <label style={{ marginLeft: "6px" }}>주문자 정보와 동일</label>
        </div>
        <div className="order-input-row">
          <input placeholder="수령인" className="order-input-half" />
          <input placeholder="연락처" className="order-input-half" />
        </div>
        <div className="order-input-zipcode">
          <input placeholder="우편번호" className="order-input-full" />
          <button className="order-input-full">주소찾기</button>
        </div>
        <input placeholder="주소" className="order-input-full" />
        <input placeholder="상세주소" className="order-input-full" />
      </div>

      {/* 배송 메모 */}
      <div className="order-box">
        <h4>배송 메모</h4>
        <select className="order-select">
          <option>배송메모를 선택해 주세요.</option>
          <option>문 앞에 두고 가주세요</option>
          <option>부재 시 전화주세요</option>
          <option>경비실에 맡겨주세요</option>
        </select>
      </div>

      {/* 버튼 영역 */}
      <div className="order-buttons">
        <button onClick={handleOrderButton} className="order-button confirm">
          결제하기
        </button>
        <button onClick={handleCancelButton} className="order-button cancel">
          취소
        </button>
      </div>
    </div>
  );
}

export default Order;
