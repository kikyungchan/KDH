import {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router";

export function OrderDetail() {
  const {orderToken} = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios.get(`/api/product/order/detail/${orderToken}`)
      .then((res) => {
        setOrder(res.data);
      })
      .catch((err) => {
        console.error("❌ 주문 상세 불러오기 실패", err.response?.status, err.response?.data);
      })
      .finally(() => {
      });
  }, [orderToken]);


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
                <div>주문일자{order.orderDate}</div>
                <div className="text-sm">주문번호</div>
              </div>
              <hr className="border-t border-gray-300 my-3"/>
              <div>
                <div>이름</div>
                <div>주소</div>
                <div>핸드폰번호</div>
              </div>
              <hr className="border-t border-gray-300 my-3"/>
              <div>
                <div>주문 상품 @개</div>
                <div>상품 내역</div>
              </div>
              <hr className="border-t border-gray-300 my-3"/>
              <div>
                <div>결제정보</div>
                <div>결제수단</div>
                <div>총 금액</div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}