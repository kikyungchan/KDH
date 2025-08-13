import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasCalled = useRef(false);

  useEffect(() => {
    // 쿼리 파라미터 값이 결제 요청할 때 보낸 데이터와 동일한지 반드시 확인하세요.
    // 클라이언트에서 결제 금액을 조작하는 행위를 방지할 수 있습니다.
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
    };

    async function confirm() {
      // todo : fetch -> axios 로 바꾸기
      // StrictMode로 인한 api 두번 보내는 현상 방지
      if (!hasCalled.current) {
        hasCalled.current = true;
        axios
          .post("/api/pay/confirm", requestData, {
            headers: { "Content-Type": "application/json" },
          })
          .then((res) => {
            toast("결제가 완료되었습니다", { type: "success" });
            window.opener.postMessage(
              {
                type: "PAY_SUCCESS",
                data: res.data,
              },
              window.location.origin,
            );
          })
          .catch((err) => {
            console.log("err : ", err);
            const message = err.response.data.message ?? err.message;
            window.opener.postMessage(
              { type: "PAY_FAIL", data: err.data },
              window.location.origin,
            );
          })
          .finally(() => {
            console.log("always");
            hasCalled.current = false;
            setTimeout(() => window.close(), 10);
          });
      }
    }

    confirm();
  }, []);

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 성공</h2>
        <p>{`주문번호: ${searchParams.get("orderId")}`}</p>
        <p>{`결제 금액: ${Number(
          searchParams.get("amount"),
        ).toLocaleString()}원`}</p>
        <p>{`paymentKey: ${searchParams.get("paymentKey")}`}</p>
      </div>
    </div>
  );
}
