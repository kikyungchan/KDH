import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import axios from "axios";

export function OrderList() {
  const [orderList, setOrderList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [orderItems, setOrderItems] = useState([])

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/product/order/list?page=${page}`)
      .then((res) => {
        setOrderList(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
      })
      .finally(() => {
      })
  }, [page]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-center items-start pt-10">
        <div className="w-full max-w-[800px] mx-auto px-4">
          <div className="px-8 py-6 shadow rounded-2xl bg-white">
            <div>
              <h2 className="mb-6 text-center text-2xl font-semibold">주문 목록</h2>
            </div>
            <div>
              {orderList.map((order) => (
                <>
                  <div key={order.orderId}>
                    <div>
                      {order.orderDate} | {order.orderToken}
                    </div>
                    {order.orderItems.map((item, index) => (
                      <>
                        <div key={index}>
                          <div>
                            <div>{item.productName}</div>
                            <div>
                              옵션: {order.optionName || "기본"} / 수량: {item.quantity}
                            </div>
                          </div>
                          <div>
                            {item.price.toLocaleString()} 원
                          </div>
                        </div>
                      </>
                    ))}
                    <div>{order.totalPrice.toLocaleString()}원</div>
                  </div>
                </>
              ))}
            </div>
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

          </div>
        </div>
      </div>
    </div>
  );
}