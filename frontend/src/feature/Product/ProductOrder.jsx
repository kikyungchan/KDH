import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import "./css/Order.css";

function Order(props) {
  const [memo, setMemo] = useState("");
  const [customMemo, setCustomMemo] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [sameAsOrderer, setSameAsOrderer] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const { state } = useLocation();
  // items가 배열이 아니더라도 자동으로 배열로 감싸줌.
  const items = state?.items ?? (state ? [state] : []);
  const navigate = useNavigate();
  // TODO: 우편번호 상세주소 회원가입시 받을것인지?
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

  if (!state || items.length === 0) {
    return <div>잘못된 접근입니다.</div>;
  }

  // const totalPrice = state.price * state.quantity;
  // const shippingFee = totalPrice >= 100000 ? 0 : 3000;

  function handleCancelButton() {
    alert("주문이 취소되었습니다.");
    navigate(-1);
  }

  function handleOrderButton() {
    const token = localStorage.getItem("token");
    // const orderMemo = memo === "직접 작성" ? customMemo : memo;
    // const totalPrice = state.price * state.quantity;
    console.log(items);
    const payloadList = items.map((item) => ({
      productId: item.productId ?? item.product?.id,
      optionId: item.optionId ?? item.option?.id,
      productName: item.productName,
      optionName: item.optionName ?? item.option,
      quantity: item.quantity,
      price: item.price,
      shippingAddress: address,
      memo: memo === "직접 작성" ? customMemo : memo,
      totalPrice: item.price * item.quantity,
    }));
    console.log(payloadList);

    if (token) {
      // 회원 주문
      axios
        .post("/api/product/order", payloadList, {
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
      // 비회원
      const payloadList = items.map((item) => ({
        productId: item.productId ?? item.product?.id,
        optionId: item.optionId ?? item.option?.id,
        productName: item.productName,
        optionName: item.optionName ?? item.option,
        quantity: item.quantity,
        price: item.price,
        shippingAddress: address,
        memo: memo === "직접 작성" ? customMemo : memo,
        totalPrice: item.price * item.quantity,
        guestName: name,
        guestPhone: phone,
        receiverName: receiverName,
        receiverPhone: receiverPhone,
        receiverAddress: receiverAddress,
        postalCode: "",
        detailedAddress: "",
      }));
      axios
        .post("/api/product/order/guest", payloadList)
        .then((res) => {
          const token = res.data.guestOrderToken;
          alert("비회원 주문 완료\n주문번호: " + token);
          localStorage.setItem("guestOrderToken", token);
        })
        .catch((err) => {
          console.log(err);
          alert("주문 실패");
        });
    }
  }

  // 체크박스 핸들러
  function handleSameAsOrdererChange(e) {
    const checked = e.target.checked;
    setSameAsOrderer(checked);
    if (checked) {
      setReceiverName(name);
      setReceiverPhone(phone);
      setReceiverAddress(address);
    } else {
      setReceiverName("");
      setReceiverPhone("");
      setReceiverAddress("");
    }
  }

  return (
    <div className="order-container">
      <h2>결제하기</h2>

      {/* 주문 상품 정보 */}
      <div className="order-box">
        <h4>주문 상품 정보</h4>
        {items.map((item, idx) => (
          <div key={idx} className="order-product">
            <img src={item.imagePath} width={100} alt="상품" />
            <div className="order-product-info">
              <div>
                <strong>{item.productName}</strong>
              </div>
              <div>
                {item.optionName ?? item.option} / {item.quantity}개
              </div>
              <div>{(item.price * item.quantity).toLocaleString()}원</div>
            </div>
          </div>
        ))}
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
          <input
            type="checkbox"
            checked={sameAsOrderer}
            onChange={handleSameAsOrdererChange}
          />
          <label style={{ marginLeft: "6px" }}>주문자 정보와 동일</label>
        </div>

        <div className="order-input-row">
          <input
            placeholder="수령인"
            className="order-input-half"
            value={receiverName}
            onChange={(e) => setReceiverName(e.target.value)}
          />
          <input
            placeholder="연락처"
            className="order-input-half"
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
          />
        </div>

        <div className="order-input-zipcode">
          <input placeholder="우편번호" className="order-input-full" />
          <button className="order-input-full">주소찾기</button>
        </div>
        <input
          placeholder="주소"
          className="order-input-full"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
        />
        <input placeholder="상세주소" className="order-input-full" />
      </div>

      {/* 배송 메모 */}
      <div className="order-box">
        <h4>배송 메모</h4>
        <select
          className="order-select"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        >
          <option value="">배송메모를 선택해 주세요.</option>
          <option value="문 앞에 두고 가주세요">문 앞에 두고 가주세요</option>
          <option value="부재 시 전화주세요">부재 시 전화주세요</option>
          <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
          <option value="직접 작성">직접 작성</option>
        </select>
        {memo === "직접 작성" && (
          <input
            type="text"
            className="order-input-full"
            placeholder="배송 메모를 직접 입력하세요"
            value={customMemo}
            onChange={(e) => setCustomMemo(e.target.value)}
          />
        )}
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
