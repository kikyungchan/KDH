import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useParams} from "react-router";

export function OrderDetail() {
  const {orderToken} = useParams();
  const [order, setOrder] = useState(null);
  const [orderDetail, setOrderDetail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/product/order/detail/${orderToken}`)
      .then((res) => {
        setOrder(res.data);
        console.log("주문 정보 + ", res.data);
      })
      .catch((err) => {
        console.error("❌ 주문 상세 불러오기 실패", err.response?.status, err.response?.data);
      })
      .finally(() => {
      });
  }, [orderToken]);

  // useEffect(() => {
  //   console.log("✅ 주문 상세 DTO:", orderDetail);
  //   console.log("📦 상품 목록:", orderDetail.orderItems);
  // }, [orderDetail]);

  if (!order) {
    return <div className="text-center pt-10 text-gray-500">주문 정보를 불러오는 중...</div>;
  }


  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-center items-start pt-10">
        <div className="w-full max-w-[600px] mx-auto px-4">
          <div className="px-8 py-6 shadow rounded-2xl bg-white">
            <div className="mb-8">
              <h2 className="mb-6 text-center text-2xl font-bold">주문 상세</h2>
              <br/>
              <div>
                <div>주문일자 : {new Date(order.orderDate).toLocaleDateString()}</div>
                <div className="text-sm">주문번호 : {order.orderToken}</div>
              </div>
              <hr className="border-t border-gray-300 my-3"/>
              <div>
                <div>이름 : {order.memberName}</div>
                <div>연락처 : {order.phone}</div>
                <div>
                  <div>
                    우편번호 : {order.zipcode}
                  </div>
                  <div>
                    주소 : {order.shippingAddress}
                  </div>
                  <div>
                    상세주소 : {order.addressDetail}
                  </div>
                  <div>
                    배송메모 : {order.memo}
                  </div>
                </div>
              </div>
              <hr className="border-t border-gray-300 my-3"/>
              <div>
                <div className="mb-2">주문 상품 {order.orderItems.length}개</div>
                <div>
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="mb-2">
                        <img src={item.thumbnailUrl || "/default.png"}
                             alt={item.productName}
                             className="w-32 h-32"/>
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{item.productName}</div>
                        <div className="text-sm text-gray-600">옵션: {item.productOption}</div>
                        <div className="text-sm">수량: {item.quantity}</div>
                        <div className="text-sm">가격: {item.price.toLocaleString()}원</div>
                      </div>
                      <br/>
                    </div>

                  ))}
                </div>
              </div>
              <hr className="border-t border-gray-300 my-3"/>
              <div>
                <div>결제정보</div>
                <div>결제수단</div>
                <div>총 금액 : {order.totalPrice}</div>
              </div>
              <div className="text-end">
                <button className="btn btn-outline btn-neutral"
                onClick={() => {navigate("/product/order/list")}}>
                  목록으로
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}