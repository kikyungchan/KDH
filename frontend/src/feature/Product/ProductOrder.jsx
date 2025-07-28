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
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "20px" }}>
      <h2>결제하기</h2>

      {/* 주문 상품 정보 */}
      <div
        style={{ border: "1px solid #ddd", padding: "16px", marginTop: "20px" }}
      >
        <h4>주문 상품 정보</h4>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img src={state.imagePath} width={100} alt="상품" />
          <div>
            <div style={{ fontWeight: "bold" }}>{state.productName}</div>
            <div>
              {state.option} / {state.quantity}개
            </div>
            <div>{state.price.toLocaleString()}원</div>
            <div style={{ color: "#666", fontSize: "0.9em" }}>
              배송비 {shippingFee.toLocaleString()}원
            </div>
          </div>
        </div>
      </div>

      {/* 주문자 정보 */}
      {/* 주문자 정보 */}
      <div
        style={{ border: "1px solid #ddd", padding: "16px", marginTop: "20px" }}
      >
        <h4>주문자 정보</h4>

        {/* 이름 + 연락처 */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <input placeholder="이름" style={{ flex: 1, padding: "8px" }} />
          <input placeholder="연락처" style={{ flex: 1, padding: "8px" }} />
        </div>

        {/*주소*/}
        <input
          type="text"
          value={address}
          readOnly
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      {/* 배송 정보 */}
      <div
        style={{ border: "1px solid #ddd", padding: "16px", marginTop: "20px" }}
      >
        <h4>배송 정보</h4>
        <div style={{ marginBottom: "10px" }}>
          <input type="checkbox" />
          <label style={{ marginLeft: "6px" }}>주문자 정보와 동일</label>
        </div>
        <input
          placeholder="수령인"
          style={{ width: "49%", padding: "8px", marginBottom: "8px" }}
        />
        <input
          placeholder="연락처"
          style={{ width: "49%", padding: "8px", marginLeft: "2%" }}
        />
        <div style={{ display: "flex", marginTop: "8px", gap: "8px" }}>
          <input placeholder="우편번호" style={{ flex: 1, padding: "8px" }} />
          <button style={{ padding: "8px" }}>주소찾기</button>
        </div>
        <input
          placeholder="주소"
          style={{ width: "100%", marginTop: "8px", padding: "8px" }}
        />
        <input
          placeholder="상세주소"
          style={{ width: "100%", marginTop: "8px", padding: "8px" }}
        />
      </div>

      {/* 배송 메모 */}
      <div
        style={{ border: "1px solid #ddd", padding: "16px", marginTop: "20px" }}
      >
        <h4>배송 메모</h4>
        <select style={{ width: "100%", padding: "8px" }}>
          <option>배송메모를 선택해 주세요.</option>
          <option>문 앞에 두고 가주세요</option>
          <option>부재 시 전화주세요</option>
          <option>경비실에 맡겨주세요</option>
        </select>
      </div>

      {/* 버튼 영역 */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <button
          onClick={handleOrderButton}
          style={{
            padding: "10px 20px",
            background: "black",
            color: "white",
            border: "none",
          }}
        >
          결제하기
        </button>
        <button
          onClick={handleCancelButton}
          style={{ padding: "10px 20px", background: "#ccc", border: "none" }}
        >
          취소
        </button>
      </div>
    </div>
  );
}

export default Order;
