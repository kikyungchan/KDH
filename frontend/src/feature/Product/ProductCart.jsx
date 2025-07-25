import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";

function ProductCart(props) {
  const [checkedIds, setCheckedIds] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // 로그인사용자
      axios
        .get("/api/product/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setCartItems(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      // 비로그인 사용자 => localStorage 에서 guestCart 가져옴
      const localCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCartItems(localCart);
    }
  }, []);

  function handleCheckboxChange(index, checked) {
    if (checked) {
      setCheckedIds((prev) => [...prev, index]);
    } else {
      setCheckedIds((prev) => prev.filter((item) => item !== index));
    }
  }

  function handleSelectAllCheckboxChange(e) {
    const checked = e.target.checked;
    if (checked) {
      const all = cartItems.map((_, index) => index);
      setCheckedIds(all);
    } else {
      setCheckedIds([]);
    }
  }

  return (
    <Container>
      <h2>장바구니</h2>
      <Row className="align-items-center border-bottom py-2 fw-bold">
        <Col xs="auto">
          <input
            type="checkbox"
            checked={
              checkedIds.length === cartItems.length && cartItems.length > 0
            }
            onChange={handleSelectAllCheckboxChange}
          />
        </Col>
        <Col>상품 정보</Col>
        <Col xs="2">수량</Col>
        <Col xs="2">가격</Col>
        <Col xs="2">총 금액</Col>
      </Row>
      {cartItems.map((item, index) => (
        <Row key={index} className="align-items-center border-bottom py-2">
          {/*체크박스*/}
          <Col xs="auto">
            <input
              type="checkbox"
              checked={checkedIds.includes(index)}
              onChange={(e) => handleCheckboxChange(index, e.target.checked)}
            />
          </Col>

          {/* 이미지 + 상품명/옵션 */}
          <Col>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <img
                src={item.imagePath}
                alt="상품이미지"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ fontWeight: "bold" }}>{item.productName}</div>
                <div style={{ fontSize: "0.85em", color: "#555" }}>
                  {item.optionName}
                </div>
              </div>
            </div>
          </Col>

          {/* 수량 / 가격 / 총금액 */}
          <Col xs="2">{item.quantity}개</Col>
          <Col xs="2">{item.price?.toLocaleString() || "-"}원</Col>
          <Col xs="2">
            {item.price && item.quantity
              ? (item.price * item.quantity).toLocaleString()
              : "-"}
            원
          </Col>
        </Row>
      ))}
      <div className="mt-4 d-flex gap-2">
        <button>선택 삭제</button>
        <button>구매</button>
      </div>
    </Container>
  );
}

export default ProductCart;
