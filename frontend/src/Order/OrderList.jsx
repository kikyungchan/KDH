import { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "sonner";

export function OrderList() {
  const [orderList, setOrderList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isProcessing, setIsProcessing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsProcessing(true);
    axios
      .get(`/api/order/list?page=${page}`)
      .then((res) => {
        setOrderList(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        toast("❌ 주문 목록 불러오기 실패", { type: "error" });
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }, [page]);

  return (
    <div className="page-wrapper">
      <div className="center-top-container">
        <div className="w-full max-w-[700px] mx-auto px-4">
          <div className="rounded-card">
            <div className="mb-8">
              <h2 className="mb-6 text-center text-3xl font-bold">주문 목록</h2>
              <br />
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
                        <div className="font-semibold">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </div>
                        <div
                          className="cursor-pointer not-hover:underline"
                          onClick={() =>
                            navigate(`/order/detail/${order.orderToken}`)
                          }
                        >
                          주문상세
                        </div>
                      </div>
                      <div className="text-sm text-gray-700">
                        주문번호 : {order.orderToken}
                      </div>
                    </div>
                    {order.orderItems.map((item, index) => (
                      <div
                        key={`${order.orderId}-${index}`}
                        className="flex gap-3 items-center"
                      >
                        <div className="mb-2">
                          <img
                            src={item.thumbnailUrl || "/default.png"}
                            alt={item.productName}
                            onClick={() =>
                              navigate(`/product/view?id=${item.productId}`)
                            }
                            className="w-32 h-32 rounded"
                          />
                        </div>
                        <div>
                          <div className="mb-1">상품명: {item.productName}</div>
                          <div className="text-sm mb-1">
                            <div>커밋</div>
                            {/* 커밋용 주석
                             */}
                            옵션: {item.productOption || "기본"} /{" "}
                            {item.quantity}개
                          </div>
                          <div>{item.price.toLocaleString()} 원</div>
                        </div>
                        <br />
                      </div>
                    ))}

                    {order.totalPrice != null && (
                      <div className="text-right">
                        <div>
                          상품 금액: {order.itemsSubtotal.toLocaleString()}
                        </div>
                        <div>배송료 : {order.shippingFee.toLocaleString()}</div>
                        <div className="font-semibold mt-1">
                          총 결제금액: {order.totalPrice.toLocaleString()}원
                        </div>
                      </div>
                    )}
                  </div>
                  <hr className="border-t border-gray-300 my-4" />
                </Fragment>
              ))
            )}
            {!isProcessing && orderList.length > 0 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`btn btn-sm ${i === page ? "btn-neutral" : "btn-outline"}`}
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
