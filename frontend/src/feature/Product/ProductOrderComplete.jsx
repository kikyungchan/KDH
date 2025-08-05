import { useLocation, useNavigate } from "react-router";
import "./css/ProductOrder.css";
import { useCart } from "./CartContext.jsx";
import { useEffect } from "react";
import axios from "axios";

export function ProductOrderComplete() {
  const { setCartCount } = useCart();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderToken, items, orderer, receiver, memo } = state;
  const totalItemPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = totalItemPrice >= 100000 ? 0 : 3000;

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // 로그인 사용자: 주문한 상품들 cartId 기반 삭제
      const deleteList = items.map((item) => ({
        cartId: item.cartId,
      }));

      axios
        .delete("/api/product/cart/delete", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: deleteList,
        })
        .then(() => {
          return axios.get("/api/product/cart", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        })
        .then((res) => {
          setCartCount(res.data.length);
        })
        .catch((err) => {
          console.error("장바구니 삭제 및 갱신 실패", err);
        });
    } else {
      // 비회원: localStorage 에서 삭제
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

      const updatedCart = guestCart.filter(
        (cartItem) =>
          !items.some(
            (ordered) =>
              cartItem.productId === ordered.productId &&
              cartItem.optionId === ordered.optionId &&
              cartItem.quantity === ordered.quantity &&
              cartItem.productName === ordered.productName,
          ),
      );

      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setCartCount(updatedCart.length);
    }
  }, []);

  return (
    <div className="container order-container">
      <h2 style={{ fontSize: "2rem" }} className="mb-3">
        주문 완료
      </h2>
      <p className="mb-4">
        <strong>주문번호: {orderToken}</strong>
      </p>

      {/* 주문 상품 정보 */}
      <div className="order-box">
        <h4 className="mb-3">주문 상품 정보</h4>
        {items.map((item, idx) => (
          <div key={idx} className="order-product mb-3">
            <img
              src={item.imagePath}
              alt="상품"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
            <div className="order-product-info">
              <div className="font-bold">{item.productName}</div>
              <div className="text-sm text-gray-700">
                {item.optionName ?? item.option} / {item.quantity}개
              </div>
              <div className="text-sm">
                {(item.price * item.quantity).toLocaleString()}원
              </div>
              <div className="text-sm text-gray-500">
                배송비: {shippingFee.toLocaleString()}원
              </div>
            </div>
          </div>
        ))}
        <hr />
        <div className="text-end fw-bold mt-2 text-lg">
          총 주문금액: {(totalItemPrice + shippingFee).toLocaleString()}원
        </div>
      </div>

      {/* 주문자 정보 */}
      <div className="order-box">
        <h4 className="mb-3">주문자 정보</h4>
        <div>이름: {orderer.name}</div>
        <div>연락처: {orderer.phone}</div>
        <div>주소: {orderer.address}</div>
      </div>

      {/* 배송 정보 */}
      <div className="order-box">
        <h4 className="mb-3">배송 정보</h4>
        <div>수령인: {receiver.name}</div>
        <div>연락처: {receiver.phone}</div>
        <div>
          주소: ({receiver.postalCode}) {receiver.address}{" "}
          {receiver.detailedAddress}
        </div>
      </div>

      {/* 배송 메모 */}
      <div className="order-box">
        <h4 className="mb-3">배송 메모</h4>
        <div>{memo || "없음"}</div>
      </div>

      {/* 버튼 */}
      <div className="order-buttons">
        <button onClick={() => navigate("/")} className="order-button confirm">
          홈으로
        </button>
      </div>
    </div>
  );
}
