import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// 이거 하드코딩 괜찮나..?
const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "kCGTAUtheqwIR-I7TEkum";

export function CheckoutPage() {
  const [amount, setAmount] = useState({
    currency: "KRW",
    // value: 50_000,
    value: 200,
  });
  const [paymentData, setPaymentData] = useState(null);
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);
  // const orderId = crypto.randomUUID();
  const orderId = uuidv4();

  useEffect(() => {
    async function fetchPaymentWidgets() {
      // ------  결제위젯 초기화 ------
      const tossPayments = await loadTossPayments(clientKey);
      // 회원 결제
      const widgets = tossPayments.widgets({
        customerKey,
      });
      // 비회원 결제
      // const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });

      setWidgets(widgets);
    }

    fetchPaymentWidgets();
  }, [clientKey, customerKey]);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) {
        return;
      }
      // ------ 주문의 결제 금액 설정 ------
      await widgets.setAmount(amount);

      await Promise.all([
        // ------  결제 UI 렌더링 ------
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        // ------  이용약관 UI 렌더링 ------
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);

      setReady(true);
    }

    renderPaymentWidgets();
  }, [widgets]);

  useEffect(() => {
    if (widgets == null) {
      return;
    }

    widgets.setAmount(amount);

    const handleMessage = (event) => {
      // 보안: 출처 확인
      /*if (
        event.origin !== window.location.origin ||
        event.origin !== "https://payment-widget.tosspayments.com"
      ) {
        console.warn("신뢰할 수 없는 출처:", event.origin);
        return;
      }*/

      // 메시지 타입별 처리
      switch (event.data.type) {
        case "CHECKOUT_DATA":
          console.log("결제 데이터 받음:", event.data.data);
          setPaymentData(event.data.data); // state 업데이트
          widgets.setAmount(event.data.data.amount);

          break;
        case "CLOSE_POPUP":
          window.close();
          break;
      }
    };

    // 이벤트 리스너 등록
    window.addEventListener("message", handleMessage);

    console.log("이벤트 받음");
    // 부모에게 "준비됐어!" 신호 보내기
    if (window.opener) {
      window.opener.postMessage(
        {
          type: "POPUP_READY",
        },
        window.location.origin,
      );
    }

    // 클린업: 컴포넌트 언마운트시 리스너 제거
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [widgets, amount]);

  return (
    <div className="wrapper">
      <div className="box_section">
        {/* 결제 UI */}
        <div id="payment-method" />
        {/* 이용약관 UI */}
        <div id="agreement" />
        {/* 쿠폰 체크박스 */}
        {/*<div>
          <div>
            <label htmlFor="coupon-box">
              <input
                id="coupon-box"
                type="checkbox"
                aria-checked="true"
                disabled={!ready}
                onChange={(event) => {
                  // ------  주문서의 결제 금액이 변경되었을 경우 결제 금액 업데이트 ------
                  setAmount(
                    event.target.checked ? amount - 5_000 : amount + 5_000,
                  );
                }}
              />
              <span>5,000원 쿠폰 적용</span>
            </label>
          </div>
        </div>*/}
        {/* 결제하기 버튼 */}
        {/*todo : 결제 처리하기 (현재 기존요청을 처리중이라며 결제가 안됨 서버에도 접속 못하는것 같음)*/}
        <button
          className="button btn primary w-full"
          disabled={!ready}
          onClick={async () => {
            try {
              // ------ '결제하기' 버튼 누르면 결제창 띄우기 ------
              // 결제를 요청하기 전에 orderId, amount를 서버에 저장하세요.
              // 결제 과정에서 악의적으로 결제 금액이 바뀌는 것을 확인하는 용도입니다.
              await widgets.requestPayment({
                orderId: orderId,
                orderName: "토스 티셔츠 외 2건",
                successUrl: window.location.origin + "/pay/success",
                failUrl: window.location.origin + "/pay/fail",
                customerEmail: "customer123@gmail.com",
                customerName: "김토스",
                customerMobilePhone: "01012341234",
              });
            } catch (error) {
              // 에러 처리하기
              console.error(error);
            }
          }}
        >
          결제하기
        </button>
      </div>
    </div>
  );
}
