import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";

function ProductCart(props) {
  const [checkedIds, setCheckedIds] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const selectedItems = cartItems.filter((_, idx) => checkedIds.includes(idx));
  const totalItemPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = totalItemPrice >= 100000 ? 0 : 3000;

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
          console.log(res.data);
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

  function handleDeleteSelected() {
    const token = localStorage.getItem("token");
    const deleteList = checkedIds.map((index) => {
      const item = cartItems[index];
      return {
        cartId: item.cartId,
      };
    });

    // 로그인 사용자인 경우
    console.log("🧾 삭제 요청 보낼 데이터:", deleteList);
    if (token) {
      axios
        .delete("/api/product/cart/delete", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: deleteList,
        })
        .then(() => {
          // 삭제 성공하면 다시 장바구니 목록 불러오기
          return axios.get("/api/product/cart", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        })
        .then((res) => {
          setCartItems(res.data); //
          setCheckedIds([]);
        })
        .catch((err) => {
          console.error("삭제 실패:", err);
        });
    } else {
      // 비로그인 사용자 - localStorage 에서 삭제 처리
      const newCartItems = cartItems.filter(
        (_, idx) => !checkedIds.includes(idx),
      );
      setCartItems(newCartItems);
      setCheckedIds([]);
      localStorage.setItem("guestCart", JSON.stringify(newCartItems));
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
      <div className="mt-1 d-flex gap-1 ">
        <button onClick={handleDeleteSelected} style={{ height: "40px" }}>
          선택 삭제
        </button>
        <button style={{ height: "40px" }}>구매</button>
        <div
          className="ms-auto"
          style={{ textAlign: "right", fontSize: "0.8rem" }}
        >
          <p>배송시 문제생겨도 책임안집니다.</p>
          <p>어쩌구 저쩌구</p>
        </div>
      </div>

      <hr />
      {/*  주문요약정보*/}
      <div className="py-2 text-center">
        <div style={{ fontSize: "1.5em", fontWeight: "bold" }}>
          {totalItemPrice.toLocaleString()}원
          <span style={{ margin: "0 10px" }}>+</span>
          {shippingFee.toLocaleString()}원
          <span style={{ margin: "0 10px" }}>=</span>
          {(totalItemPrice + shippingFee).toLocaleString()}원
        </div>
        <div
          className="text-secondary d-flex justify-content-center gap-5 mt-2"
          style={{ fontSize: "0.9em" }}
        >
          <div>상품금액</div>
          <div>배송비</div>
          <div>총 주문금액</div>
        </div>
      </div>
    </Container>
  );
}

export default ProductCart;
