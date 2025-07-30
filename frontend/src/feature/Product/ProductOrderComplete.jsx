import { useLocation, useNavigate } from "react-router";
import "./css/Order.css";

export function ProductOrderComplete() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderToken, items, orderer, receiver, memo } = state;
  const totalItemPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = totalItemPrice >= 100000 ? 0 : 3000;
  return (
    <div className="order-container">
      <h2>주문 완료</h2>
      <p>
        <strong>
          주문번호:
          {orderToken}
        </strong>
      </p>
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
              <div>배송비: {shippingFee.toLocaleString()}원</div>
            </div>
          </div>
        ))}
        <hr />
        <div style={{ textAlign: "right", fontWeight: "bold" }}>
          총 주문금액: {(totalItemPrice + shippingFee).toLocaleString()}원
        </div>
      </div>

      <div className="order-box">
        <h4>주문자 정보</h4>
        <div>이름: {orderer.name}</div>
        <div>연락처: {orderer.phone}</div>
        <div>주소: {orderer.address}</div>
      </div>

      <div className="order-box">
        <h4>배송 정보</h4>
        <div>수령인: {receiver.name}</div>
        <div>연락처: {receiver.phone}</div>
        <div>
          주소: ({receiver.postalCode}) {receiver.address}{" "}
          {receiver.detailedAddress}
        </div>
      </div>

      <div className="order-box">
        <h4>배송 메모</h4>
        <div>{memo || "없음"}</div>
      </div>

      <div className="order-buttons">
        <button onClick={() => navigate("/")} className="order-button confirm">
          홈으로
        </button>
      </div>
    </div>
  );
}
