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
        <div className="w-full max-w-[600px] mx-auto px-4">
          <div className="rounded-card">
            <div className="mb-8">
              <h2 className="mb-6 text-center text-2xl font-bold">주문 상세</h2>
              <br />
              <div>
                <div>
                  주문일자 : {new Date(order.orderDate).toLocaleDateString()}
                </div>
                <div className="text-sm">주문번호 : {order.orderToken}</div>
              </div>
              <hr className="border-t border-gray-300 my-3" />
              <div>
                <table>
                  <tbody className="w-full table-fixed">
                    <tr>
                      <td className="w-1/4 text-left">이름</td>
                      <td className="text-left">{order.memberName}</td>
                    </tr>
                    <tr>
                      <td className="w-1/4">연락수 처</td>
                      <td className="td-left">{order.phone}</td>
                    </tr>
                    <tr>
                      <td className="w-1/4">우편번호</td>
                      <td className="td-left">{order.zipcode}</td>
                    </tr>
                    <tr>
                      <td>주소</td>
                      <td>{order.shippingAddress}</td>
                    </tr>
                    <tr>
                      <td>상세주소</td>
                      <td>{order.addressDetail}</td>
                    </tr>
                    <tr>
                      <td>배송메세지</td>
                      <td>{order.memo}</td>
                    </tr>
                  </tbody>
                </table>
                {/* TODO : 테이블로 정리해두기 */}
                <ul>
                  <li className="row">
                    <span className="cell">1행 1열</span>
                    <span className="cell">1행 2열</span>
                  </li>
                  <li className="row">
                    <span className="cell">2행 1열</span>
                    <span className="cell">2행 2열</span>
                  </li>
                  <li className="row">
                    <span className="cell">3행 1열</span>
                    <span className="cell">3행 2열</span>
                  </li>
                  <li>이름 : {order.memberName}</li>
                  <li>연락처 : {order.phone}</li>
                  <li>우편번호 : {order.zipcode}</li>
                  <li>주소 : {order.shippingAddress}</li>
                  <li>상세주소 : {order.addressDetail}</li>
                  <li>배송메모 : {order.memo}</li>
                </ul>
              </div>
              <hr className="border-t border-gray-300 my-3" />
              <div>
                <div className="mb-2">
                  주문 상품 {order.orderItems.length}개
                </div>
                <div>
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="mb-2">
                        <img
                          src={item.thumbnailUrl || "/default.png"}
                          alt={item.productName}
                          className="w-32 h-32"
                        />
                      </div>
                      <ul className="content-center">
                        <li>상품명: {item.productName}</li>
                        <li>옵션: {item.productOption}</li>
                        <li>수량: {item.quantity}</li>
                        <li>가격: {item.price.toLocaleString()}원</li>
                      </ul>
                      <br />
                    </div>
                  ))}
                </div>
              </div>
              <hr className="border-t border-gray-300 my-3" />
              <div>
                <div>결제정보</div>
                <div>결제수단</div>
                <div>총 금액 : {order.totalPrice}</div>
              </div>
              <div className="text-end">
                <button
                  className="btn btn-outline btn-neutral"
                  onClick={() => {
                    navigate("/product/order/list");
                  }}
                >
                  목록으로
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
