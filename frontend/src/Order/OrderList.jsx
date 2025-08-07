import {Fragment, useEffect, useState} from "react";
import {useNavigate} from "react-router";
import axios from "axios";

export function OrderList() {
  const [orderList, setOrderList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isProcessing, setIsProcessing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsProcessing(true);
    axios.get(`/api/product/order/list?page=${page}`)
      .then((res) => {
        setOrderList(res.data.content);
      })
      .catch((err) => {
        console.error("❌ 주문 목록 불러오기 실패:", err);
      })
      .finally(() => {
        setIsProcessing(false);
      })
  }, [page]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-center items-start pt-10">
        <div className="w-full max-w-[600px] mx-auto px-4">
          <div className="px-8 py-6 shadow rounded-2xl bg-white">
            <div className="mb-8">
              <h2 className="mb-6 text-center text-2xl font-bold">주문 목록</h2>
              <br/>
              <div className="flex justify-content-between text-lg font-semibold">
                <div>주문일자</div>
                <div>주문번호</div>
              </div>
            </div>
            {!isProcessing && orderList.length === 0 ? (
              <div className="border border-gray-300 rounded-xl p-6 text-center text-gray-500">
                주문내역이 없습니다.
              </div>
            ) : (
              orderList.map((order) => (
                <Fragment key={order.orderId}>
                  <div>
                    <div className="mb-4">
                    <div className="flex justify-content-between mb-2">
                      <div>{new Date(order.orderDate).toLocaleDateString()}</div>
                      <div
                        className="cursor-pointer not-hover:underline"
                        onClick={() => navigate(`/product/order/detail/${order.orderToken}`)}
                      >
                        주문상세
                      </div>
                    </div>
                      <div className="text-sm text-gray-700">
                        주문번호 : {order.orderToken}
                      </div>
                  </div>
                    {order.orderItems.map((item, index) => (
                      <div key={`${order.orderId}-${index}`}>
                        <div className="mb-1">상품명: {item.productName}</div>
                        <div className="text-sm mb-1">옵션: {item.productOption || "기본"} / {item.quantity}개</div>
                        <div>{item.price.toLocaleString()} 원</div>
                      </div>
                    ))}

                    {order.totalPrice != null && (
                      <div className="text-right font-semibold">
                        총 결제금액: {order.totalPrice.toLocaleString()}원
                      </div>
                    )}
                  </div>
                  <hr className="border-t border-gray-300 my-4" />
                </Fragment>
              ))
            )}
            {!isProcessing && orderList.length > 0 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({length: totalPages}, (_, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm ${i === page ? 'btn-neutral' : 'btn-outline'}`}
                    onClick={() => setPage(i)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}