import { Col, Container, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useCart } from "./CartContext.jsx";

function ProductCart(props) {
  const { setCartCount } = useCart();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
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
          setCartItems(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      // 비로그인 사용자 => localStorage 에서 guestCart 가져옴
      const localCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCartItems(localCart);
    }
  }, []);

  function handleEditOption(item) {
    setSelectedItem(item);
    setSelectedOptionId(item.optionId); // 기본 선택
    setSelectedQuantity(item.quantity); // 기존 수량
    setShowModal(true); // 로그인 사용자는 이미 옵션 있음
  }

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
          setCartCount(res.data.length);
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
      setCartCount(newCartItems.length);
    }
  }

  function handleUpdateCartItem() {
    const token = localStorage.getItem("token");

    if (token) {
      // 회원
      const data = {
        cartId: selectedItem.cartId,
        optionId: selectedOptionId,
        quantity: selectedQuantity,
      };

      axios
        .put("/api/product/cart/update", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          return axios.get("/api/product/cart", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        })
        .then((res) => {
          setCartItems(res.data);
          setShowModal(false);
        })
        .catch((err) => {});
    } else {
      // 비회원
      const existingCart = JSON.parse(
        localStorage.getItem("guestCart") || "[]",
      );

      let updatedCart = [...existingCart];

      // 옵션이 있는 상품
      if ((selectedItem.options || []).length > 0) {
        const newOption = selectedItem.options.find(
          (opt) => opt.id === selectedOptionId,
        );
        if (!newOption) return;

        for (let i = 0; i < updatedCart.length; i++) {
          const item = updatedCart[i];

          const isEditingTarget =
            item.productName === selectedItem.productName &&
            item.optionName === selectedItem.optionName;

          const isTargetMerged =
            item.productName === selectedItem.productName &&
            item.optionName === newOption.optionName;

          if (isTargetMerged && !isEditingTarget) {
            item.quantity += selectedQuantity;

            updatedCart = updatedCart.filter(
              (it) =>
                !(
                  it.productName === selectedItem.productName &&
                  it.optionName === selectedItem.optionName
                ),
            );
            break;
          }

          if (isEditingTarget) {
            item.optionName = newOption.optionName;
            item.price = newOption.price;
            item.quantity = selectedQuantity;
            item.optionId = newOption.id;
            break;
          }
        }
      } else {
        // 옵션이 없는 상품 → 수량만 수정
        for (let i = 0; i < updatedCart.length; i++) {
          const item = updatedCart[i];
          if (item.productId === selectedItem.productId) {
            item.quantity = selectedQuantity;
            break;
          }
        }
      }

      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      setShowModal(false);
    }
  }

  function handleOrderButton() {
    if (checkedIds.length === 0) {
      alert("주문할 상품을 선택하세요.");
      return;
    }
    const selectedItems = cartItems.filter((_, idx) =>
      checkedIds.includes(idx),
    );
    navigate("/product/order", {
      state: {
        items: selectedItems.map((item) => ({
          ...item,
          productId: item.productId,
          optionId: item.optionId,
        })),
      },
    });
  }

  return (
    <Container>
      <h2>장바구니</h2>
      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <h4>장바구니가 비어있습니다.</h4>
          <p>원하는 상품을 장바구니에 담아보세요.</p>
        </div>
      ) : (
        <>
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
                  onChange={(e) =>
                    handleCheckboxChange(index, e.target.checked)
                  }
                />
              </Col>

              {/* 이미지 + 상품명/옵션 */}
              <Col>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
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
              <Col xs="2">
                {item.quantity}개
                <div className="mt-2">
                  <button
                    onClick={() => handleEditOption(item)}
                    style={{
                      padding: "4px 8px",
                      fontSize: "0.85em",
                      backgroundColor: "#eee",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    옵션/수량 변경
                  </button>
                </div>
              </Col>
              <Col xs="2">{item.price?.toLocaleString() || "-"}원</Col>
              <Col xs="2">
                {item.price && item.quantity
                  ? (item.price * item.quantity).toLocaleString()
                  : "-"}
                원
              </Col>
            </Row>
          ))}
          <hr />
          <div className="mt-1 d-flex gap-1 ">
            <button onClick={handleDeleteSelected} style={{ height: "40px" }}>
              선택 삭제
            </button>

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
          <hr />
          <div className="text-center">
            <button onClick={handleOrderButton} className="btn btn-dark mt-2">
              주문하기
            </button>
          </div>
        </>
      )}
      {/*옵션/수량 변경 모달*/}
      {showModal && selectedItem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: 24,
              width: 400,
              borderRadius: 8,
            }}
          >
            <h5>옵션 변경</h5>

            {/* 상품 이미지 및 이름 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: 16,
              }}
            >
              <img
                src={selectedItem.imagePath}
                alt="상품"
                style={{ width: 80, height: 80, objectFit: "cover" }}
              />
              <span>{selectedItem.productName}</span>
            </div>

            {/* 옵션 선택 */}
            {(selectedItem.options || []).length > 0 && (
              <div>
                <label>옵션 선택</label>
                <select
                  className="form-select"
                  value={
                    selectedOptionId !== null ? String(selectedOptionId) : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedOptionId(Number(value));
                  }}
                >
                  <option value="">옵션 선택</option>
                  {selectedItem.options.map((opt) => (
                    <option key={opt.id} value={String(opt.id)}>
                      {opt.optionName} (+{opt.price?.toLocaleString()}원)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 수량 설정 */}
            <div className="mt-3 d-flex align-items-center">
              <label>수량</label>
              <button
                onClick={() => setSelectedQuantity((q) => Math.max(1, q - 1))}
              >
                -
              </button>
              <input
                type="text"
                value={selectedQuantity}
                readOnly
                className="mx-2"
                style={{ width: 40, textAlign: "center" }}
              />
              <button onClick={() => setSelectedQuantity((q) => q + 1)}>
                +
              </button>
            </div>

            {/* 버튼 영역 */}
            <div className="mt-4 d-flex justify-content-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary"
              >
                취소
              </button>
              <button className="btn btn-dark" onClick={handleUpdateCartItem}>
                변경
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default ProductCart;
