import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

export function OrderDetail() {
  const { orderToken } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/order/detail/${orderToken}`)
      .then((res) => {
        setOrder(res.data);
      })
      .catch((err) => {
        console.error(
          "❌ 주문 상세 불러오기 실패",
          err.response?.status,
          err.response?.data,
        );
      })
      .finally(() => {});
  }, [orderToken]);

  // useEffect(() => {
  //   console.log("✅ 주문 상세 DTO:", orderDetail);
  //   console.log("📦 상품 목록:", orderDetail.orderItems);
  // }, [orderDetail]);

  if (!order) {
    return (
      <div className="text-center pt-10 text-gray-500">
        주문 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="center-top-container">
        <div className="w-full max-w-[700px] mx-auto px-4">
          <div className="rounded-card">
            <div className="mb-8">
              <h2 className="mb-6 text-center text-2xl font-bold">주문 상세</h2>
              <div className="border border-gray-100 rounded px-3 py-2 mb-2">
                <div className="flex">
                  <div className="w-40">
                    <div>주문일자</div>
                    <div>주문번호</div>
                  </div>
                  <div className="w-full">
                    <div>{new Date(order.orderDate).toLocaleDateString()}</div>
                    <div>{order.orderToken}</div>
                  </div>
                </div>
              </div>
              <div className="border border-gray-100 rounded px-3 py-2 mb-2">
                <h4 className="font-semibold mb-2">주문 정보</h4>
                <div className="flex">
                  <div className="w-40 ">
                    <div>이름</div>
                    <div>연락처</div>
                  </div>
                  <div className="w-full">
                    <div>{order.ordererName}</div>
                    <div>{order.ordererPhone}</div>
                  </div>
                </div>
              </div>
              <div className="border border-gray-100 rounded px-3 py-2 mb-2">
                <h4 className="font-semibold mb-2">배송지 정보</h4>
                <div className="flex">
                  <div className="w-40">
                    <div>받는 사람</div>
                    <div>연락처</div>
                    <div>우편번호</div>
                    <div>주소</div>
                    <div>상세주소</div>
                    <div>배송메세지</div>
                  </div>
                  <div className="w-full">
                    <div>{order.receiverName}</div>
                    <div>{order.receiverPhone}</div>
                    <div>{order.receiverZipcode}</div>
                    <div>{order.receiverAddress}</div>
                    <div>{order.receiverAddressDetail}</div>
                    <div>{order.memo}</div>
                  </div>
                </div>
              </div>
              <div className="border border-gray-100 rounded px-3 py-2 mb-2">
                <h4 className="font-semibold mb-2">주문 상품</h4>
                <div>
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="mb-2">
                        <img
                          src={item.thumbnailUrl || "/default.png"}
                          alt={item.productName}
                          className="w-32 h-32 rounded"
                        />
                      </div>
                      <div className="flex items-center">
                        <div className="w-15">
                          <div>상품명 :</div>
                          <div>옵션 :</div>
                          <div>수량 :</div>
                          <div>가격 :</div>
                        </div>
                        <div>
                          <div>{item.productName}</div>
                          <div>{item.productOption}</div>
                          <div>{item.quantity}</div>
                          <div>{item.price.toLocaleString()}원</div>
                        </div>
                      </div>
                      <br />
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-white px-3 py-1">
                <div className="text-right py-2">
                  <div>상품금액 : {order.itemsSubtotal.toLocaleString()}원</div>
                  <div>배송비 : {order.shippingFee.toLocaleString()}원</div>
                  <div className="mt-2">
                    총 결제금액 : {order.totalPrice.toLocaleString()}원
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
