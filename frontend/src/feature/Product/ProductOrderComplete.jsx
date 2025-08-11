import { useLocation, useNavigate } from "react-router";
import "./css/ProductOrder.css";
import React from "react";

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
    <div className="page-wrapper">
      <div className="center-top-container">
        <div className="w-full max-w-[800px]">
          <div className="rounded-card">
            <h2 className="text-center text-3xl font-bold mb-6">주문 완료</h2>
            <p className="text-lg mb-4">
              <strong>주문번호: {orderToken}</strong>
            </p>

            {/* 주문자 정보 */}
            <div className="order-box rounded">
              <h4 className="font-semibold mb-2">주문자 정보</h4>
              <div className="flex">
                <div className="w-40 mt-1 space-y-1">
                  <div>이름</div>
                  <div>연락처</div>
                  <div>주소</div>
                </div>
                <div className="space-y-1">
                  <div>{orderer.name}</div>
                  <div>{orderer.phone}</div>
                  <div>{orderer.address}</div>
                </div>
              </div>
            </div>

            {/* 배송 정보 */}
            <div className="order-box rounded">
              <h4 className="font-semibold mb-2">배송 정보</h4>
              <div className="flex">
                <div className="w-40 space-y-1">
                  <div>받는사람</div>
                  <div>연락처</div>
                  <div>주소</div>
                  <div>배송메모</div>
                </div>
                <div className="space-y-1">
                  <div>{receiver.name}</div>
                  <div>{receiver.phone}</div>
                  <div>
                    {receiver.address} {receiver.detailedAddress}({" "}
                    {receiver.postalCode} )
                  </div>
                  <div>{memo || "없음"}</div>
                </div>
              </div>
            </div>

            {/* 주문 상품 정보 */}
            <div className="order-box rounded">
              <h4 className="font-semibold mb-3">주문 상품 정보</h4>
              {items.map((item, idx) => (
                <div key={idx} className="order-product mb-3">
                  <img
                    src={item.imagePath}
                    alt="상품"
                    className="rounded"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="order-product-info">
                    <div className="font-bold">{item.productName}</div>
                    <div className="text-sm text-gray-700">
                      {(item.optionName ?? item.option)
                        ? `${item.optionName ?? item.option} / ${item.quantity}개`
                        : `${item.quantity}개`}
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
              <hr className="border-t border-gray-300 my-4" />
              <div className="text-end fw-bold mt-2 text-lg">
                총 주문금액: {(totalItemPrice + shippingFee).toLocaleString()}원
              </div>
            </div>

            {/* 버튼 */}
            <div className="order-buttons">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="order-button btn w-40 confirm"
              >
                홈으로
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
