import { useLocation, useNavigate } from "react-router";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import "./css/ProductOrder.css";
import { useCart } from "./CartContext.jsx";
import { AuthenticationContext } from "../common/AuthenticationContextProvider.jsx";

function Order(props) {
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverZipcode, setReceiverZipcode] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverAddressDetail, setReceiverAddressDetail] = useState("");
  const [memo, setMemo] = useState("");
  const [customMemo, setCustomMemo] = useState("");
  const [sameAsOrderer, setSameAsOrderer] = useState(false);
  const [ordererName, setOrdererName] = useState("");
  const [ordererAddress, setOrdererAddress] = useState("");
  const [ordererPhone, setOrdererPhone] = useState("");
  const [ordererAddressDetail, setOrdererAddressDetail] = useState("");
  const [ordererEmail, setOrdererEmail] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { state } = useLocation();
  const { setCartCount } = useCart();
  // items가 배열이 아니더라도 자동으로 배열로 감싸줌.
  const items = state?.items ?? (state ? [state] : []);
  const totalItemPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const navigate = useNavigate();
  const checkoutWindow = useRef(null);
  const formDataRef = useRef({});

  useEffect(() => {
    const fee = totalItemPrice >= 100000 ? 0 : 3000;
    setShippingFee(fee);
  }, [totalItemPrice]);

  useEffect(() => {
    formDataRef.current = {
      receiverName,
      receiverPhone,
      receiverAddress,
      receiverAddressDetail,
      receiverZipcode,
      memo,
      customMemo,
    };
  }, [
    receiverName,
    receiverPhone,
    receiverAddress,
    receiverAddressDetail,
    receiverZipcode,
    memo,
    customMemo,
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/product/member/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setOrdererAddress(res.data.address);
          setOrdererName(res.data.name);
          setOrdererPhone(res.data.phone);
          setOrdererEmail(res.data.email);
          setOrdererAddressDetail(res.data.addressDetail);
        })
        .catch((err) => {});
    }
  }, []);

  useEffect(() => {
    if (ordererEmail != null) {
      const handlePopupMessage = (event) => {
        switch (event.data.type) {
          case "POPUP_READY":
            console.log("팝업 준비 완료!");
            // 팝업이 준비되면 데이터 전송
            sendDataToPopup();
            break;

          case "PAY_SUCCESS":
            // 결제 완료 처리
            handleOrderButton();
            setIsProcessing(false);
            break;

          case "PAY_FAIL":
            // 결제 실패 처리
            alert("결제에 실패하였습니다 다시 시도해 주세요");
            setIsProcessing(false);
            break;
        }
      };
      window.addEventListener("message", handlePopupMessage);

      // cleanup 함수로 이벤트 리스너 제거
      return () => {
        window.removeEventListener("message", handlePopupMessage);
      };
    }
  }, [ordererEmail]);

  function handlePaymentConnection() {
    // 폼 검증
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    if (!isProcessing) {
      checkoutWindow.current = window.open(
        "/pay/Checkout", // 새 창에서 열 주소
        "_blank", // 새 창
        "width=600,height=800",
      );

      // 팝업 창 확인
      if (!checkoutWindow.current) {
        alert("팝업이 차단되었습니다. 팝업 차단을 해제해 주세요.");
        setIsProcessing(false);
        return;
      }

      // 팝업이 닫혔을 때를 감지 (혹시 사용자가 직접 닫을 경우 대비)
      // setinterval (일정 시간 간격으로 함수를 반복해서 실행)
      const checkClosed = setInterval(() => {
        if (checkoutWindow.current && checkoutWindow.current.closed) {
          setIsProcessing(false);
          checkoutWindow.current = null;
          clearInterval(checkClosed);
        }
      }, 1000);

      // 10분 뒤 인터벌 정리 (메모리 누수 방지)
      const forceCloseTimeout = setTimeout(() => {
        // 팝업이 아직 열려있다면 강제로 닫기
        if (checkoutWindow.current && !checkoutWindow.current.closed) {
          checkoutWindow.current.close(); // 팝업 강제 종료!
          checkoutWindow.current = null;
        }

        // 사용자에게 알림
        alert("결제 시간이 초과되었습니다. 다시 시도해 주세요.");

        // 상태 정리
        setIsProcessing(false);
        clearInterval(checkClosed); // 인터벌도 정리
      }, 600000); // 10분 = 3,600,000ms

      // 팝업이 정상적으로 닫혔을 때는 강제 종료 타이머도 취소
      // const originalInterval = checkClosed;
      const enhancedCheckClosed = setInterval(() => {
        if (checkoutWindow.current && checkoutWindow.current.closed) {
          setIsProcessing(false);
          checkoutWindow.current = null;
          clearInterval(enhancedCheckClosed);
          clearTimeout(forceCloseTimeout); // 강제 종료 타이머 취소
        }
      }, 1000);
    }
  }

  function sendDataToPopup() {
    console.log("items : ", items);
    console.log("items length", items.length);
    if (checkoutWindow.current && !checkoutWindow.current.closed) {
      const fee = Number(shippingFee) || 0;
      const amount = totalItemPrice + fee;

      checkoutWindow.current.postMessage(
        {
          type: "CHECKOUT_DATA",
          data: {
            orderId: "12345",
            amount,
            productName:
              items[0].productName +
              (items.length > 1 ? ` 외 ${items.length - 1}건` : ""),
            username: ordererName,
            phoneNum: ordererPhone,
            emailAddr: ordererEmail ?? "",
          },
        },
        window.location.origin,
      );
    }
  }

  if (!state || items.length === 0) {
    return <div>잘못된 접근입니다.</div>;
  }

  // const totalPrice = state.price * state.quantity;
  // const shippingFee = totalPrice >= 100000 ? 0 : 3000;

  function handleCancelButton() {
    alert("주문이 취소되었습니다.");
    navigate(-1);
  }

  function validateForm() {
    // 입력값 유효성 검사
    // 주문자 정보
    if (!ordererName.trim() || !ordererPhone.trim() || !ordererAddress.trim()) {
      alert("주문자 정보를 모두 입력해 주세요.");
      return false;
    }

    const currentData = formDataRef.current;
    // 배송 정보
    if (
      !currentData.receiverName.trim() ||
      !currentData.receiverPhone.trim() ||
      !currentData.receiverAddress.trim() ||
      !currentData.receiverAddressDetail.trim() ||
      !currentData.receiverZipcode.trim()
    ) {
      alert("배송지 정보를 모두 입력해 주세요.");

      return false;
    }
    return true;
  }

  function handleOrderButton() {
    const currentData = formDataRef.current;
    if (!validateForm()) {
      return;
    }
    const token = localStorage.getItem("token");
    // const orderMemo = memo === "직접 작성" ? customMemo : memo;
    // const totalPrice = state.price * state.quantity;
    console.log(items);
    const payloadList = items.map((item) => ({
      productId: item.productId ?? item.product?.id,
      optionId: item.optionId ?? item.option?.id,
      productName: item.productName,
      optionName: item.optionName ?? item.option,
      quantity: item.quantity,
      price: item.price,

      // 주문자 정보
      ordererName: ordererName,
      ordererPhone: ordererPhone,

      // 수령인 정보
      receiverName: currentData.receiverName,
      receiverPhone: currentData.receiverPhone,
      receiverZipcode: currentData.receiverZipcode,
      receiverAddress: currentData.receiverAddress,
      receiverAddressDetail: currentData.receiverAddressDetail,

      memo:
        currentData.memo === "직접 작성"
          ? currentData.customMemo
          : currentData.memo,
      totalPrice: item.price * item.quantity,
    }));

    if (token) {
      // 회원 주문
      let orderToken = "";
      axios
        .post("/api/product/order", payloadList, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          orderToken = res.data.orderToken;

          // 구매한 상품들의 cartId 목록
          const cartIdsToDelete = items
            .map((item) => ({ cartId: item.cartId }))
            .filter((id) => id.cartId != null);

          if (cartIdsToDelete.length === 0) return;
          return axios.delete("/api/product/cart/delete", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: cartIdsToDelete,
          });
        })
        .then(() => {
          return axios.get("/api/product/cart", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        })
        .then((res) => {
          setCartCount(res.data);
        })
        .then((res) => {
          alert("주문이 완료되었습니다.");
          navigate("/product/order/complete", {
            state: {
              items,
              orderToken,
              orderer: {
                name: ordererName,
                phone: ordererPhone,
                address: ordererAddress,
              },
              receiver: {
                name: currentData.receiverName,
                phone: currentData.receiverPhone,
                address: currentData.receiverAddress,
                zipcode: currentData.receiverZipcode,
                addressDetail: currentData.receiverAddressDetail,
              },
              memo:
                currentData.memo === "직접 작성"
                  ? currentData.customMemo
                  : currentData.memo,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          alert("주문 실패");
        });
    } else {
      // 비회원
      const payloadList = items.map((item) => ({
        productId: item.productId ?? item.product?.id,
        optionId: item.optionId ?? item.option?.id,
        productName: item.productName,
        optionName: item.optionName ?? item.option,
        quantity: item.quantity,
        price: item.price,
        memo:
          currentData.memo === "직접 작성"
            ? currentData.customMemo
            : currentData.memo,
        totalPrice: item.price * item.quantity,
        guestName: ordererName,
        guestPhone: ordererPhone,
        receiverName: currentData.receiverName,
        receiverPhone: currentData.receiverPhone,
        receiverAddress: currentData.receiverAddress,
        receiverZipcode: currentData.receiverZipcode,
        addressDetail: currentData.receiverAddressDetail,
      }));
      axios.post("/api/product/order/guest", payloadList).then((res) => {
        const token = res.data.guestOrderToken;
        alert("주문이 완료되었습니다.");
        const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

        const updatedCart = guestCart.filter(
          (cartItem) =>
            !items.some(
              (ordered) =>
                cartItem.productId === ordered.productId &&
                cartItem.optionId === ordered.optionId,
            ),
        );
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
        setCartCount(updatedCart.length);
        navigate("/product/order/complete", {
          state: {
            items,
            orderToken: token,
            orderer: {
              name: ordererName,
              phone: ordererPhone,
              address: ordererAddress,
            },
            receiver: {
              name: currentData.receiverName,
              phone: currentData.receiverPhone,
              address: currentData.receiverAddress,
              zipcode: currentData.receiverZipcode,
              addressDetail: currentData.receiverAddressDetail,
            },
            memo:
              currentData.memo === "직접 작성"
                ? currentData.customMemo
                : currentData.memo,
          },
        });
      });
    }
  }

  // 주문자 정보와 동일 체크박스
  function handleSameAsOrdererChange(e) {
    const checked = e.target.checked;
    setSameAsOrderer(checked);
    const token = localStorage.getItem("token");
    if (!checked) {
      setReceiverName("");
      setReceiverPhone("");
      setReceiverAddress("");
      setReceiverZipcode("");
      setReceiverAddressDetail("");
      return;
    }
    if (token) {
      // 회원: DB에서 배송정보 불러오기
      axios
        .get("/api/product/member/info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setReceiverName(res.data.name);
          setReceiverPhone(res.data.phone);
          setReceiverAddress(res.data.address);
          setReceiverZipcode(res.data.zipCode);
          setReceiverAddressDetail(res.data.addressDetail);
        });
    } else {
      setReceiverName(ordererName);
      setReceiverPhone(ordererPhone);
      setReceiverAddress(ordererAddress);
      setReceiverZipcode((prev) => prev || "");
      setReceiverAddressDetail(ordererAddressDetail || "");
    }
  }

  function handleSearchAddress() {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setReceiverAddress(data.address); // 도로명 주소
        setReceiverZipcode(data.zonecode); // 우편번호 필요하면 이것도
        console.log("작동");
      },
    }).open();
  }

  if (!ordererEmail) {
    return <span className="loading loading-spinner"></span>;
  }

  return (
    <div className="page-wrapper">
      <div className="center-top-container">
        <div className="w-full max-w-[800px]">
          <div className="rounded-card">
            <h2 className="text-center text-3xl font-bold mb-6">결제하기</h2>

            <div
              className="order-box rounded"
              style={{ display: "flex", gap: "20px" }}
            >
              {/* 왼쪽: 주문 상품 목록 */}
              <div style={{ flex: 2 }}>
                <h4 className="mb-1 font-semibold text-lg">주문 상품 정보</h4>
                {items.map((item, idx) => (
                  <div key={idx} className="order-product mb-1">
                    <img
                      onClick={() =>
                        window.open(
                          `/product/view?id=${item.productId}`,
                          "_blank",
                        )
                      }
                      src={item.imagePath}
                      alt="상품"
                      className="rounded"
                      style={{
                        width: "150px",
                        height: "150px",
                        cursor: "pointer",
                      }}
                    />
                    <div className="order-product-info">
                      <div>
                        <strong>{item.productName}</strong>
                      </div>
                      <div>
                        {(item.optionName ?? item.option)
                          ? `${item.optionName ?? item.option} / ${item.quantity}개`
                          : `${item.quantity}개`}
                      </div>
                      <div>
                        {(item.price * item.quantity).toLocaleString()}원
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* 오른쪽: 주문 요약 */}
              <div
                className="mt-3"
                style={{
                  flex: 1,
                  background: "#f9f9f9",
                  padding: "16px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  height: "fit-content",
                }}
              >
                <h5 className="block text-center font-semibold mb-3">
                  주문 요약
                </h5>
                <div className="flex justify-content-between">
                  <span>상품가격</span>
                  <span>{totalItemPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-content-between mt-2">
                  <span>배송비</span>
                  <span>+{shippingFee.toLocaleString()}원</span>
                </div>
                <hr className="border-t border-gray-300 my-2" />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                  }}
                >
                  <span>총 주문금액</span>
                  <span>
                    {(totalItemPrice + shippingFee).toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
            {/* 주문자 정보 */}
            <div className="order-box rounded">
              <h4 className="mb-1 font-semibold text-lg">주문자 정보</h4>
              <div className="order-input-row">
                <input
                  type="text"
                  value={ordererName}
                  onChange={(e) => setOrdererName(e.target.value)}
                  placeholder="이름"
                  className="order-input-half"
                />
                <input
                  type="text"
                  value={ordererPhone}
                  onChange={(e) => setOrdererPhone(e.target.value)}
                  placeholder="연락처"
                  className="order-input-half"
                />
              </div>
              <input
                type="text"
                value={ordererAddress}
                placeholder="주소"
                onChange={(e) => setOrdererAddress(e.target.value)}
                className="order-input-full"
              />
              <input
                type="text"
                value={ordererAddressDetail}
                placeholder="상세주소"
                onChange={(e) => setOrdererAddressDetail(e.target.value)}
                className="order-input-full"
              />
            </div>

            {/* 배송 정보 */}
            <div className="order-box rounded">
              <h4 className="mb-1 font-semibold text-lg">배송 정보</h4>
              <div style={{ marginBottom: "10px" }}>
                <input
                  type="checkbox"
                  checked={sameAsOrderer}
                  onChange={handleSameAsOrdererChange}
                />
                <label style={{ marginLeft: "6px" }}>주문자 정보와 동일</label>
              </div>

              <div className="order-input-row">
                <input
                  placeholder="수령인"
                  className="order-input-half"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                />
                <input
                  placeholder="연락처"
                  className="order-input-half"
                  value={receiverPhone}
                  onChange={(e) => setReceiverPhone(e.target.value)}
                />
              </div>

              <div className="order-input-zipcode">
                <input
                  placeholder="우편번호"
                  className="order-input-full"
                  value={receiverZipcode}
                  onChange={(e) => setReceiverZipcode(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleSearchAddress}
                  className="order-input-full order-search-btn"
                >
                  주소 검색
                </button>
              </div>
              <input
                placeholder="주소"
                className="order-input-full"
                value={receiverAddress}
                onChange={(e) => setReceiverAddress(e.target.value)}
              />
              <input
                placeholder="상세주소"
                className="order-input-full"
                value={receiverAddressDetail}
                onChange={(e) => setReceiverAddressDetail(e.target.value)}
              />
            </div>

            {/* 배송 메모 */}
            <div className="order-box rounded">
              <h4 className="mb-1 font-semibold">배송 메모</h4>
              <select
                className="order-select"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
              >
                <option value="">배송메모를 선택해 주세요.</option>
                <option value="문 앞에 두고 가주세요">
                  문 앞에 두고 가주세요
                </option>
                <option value="부재 시 전화주세요">부재 시 전화주세요</option>
                <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
                <option value="직접 작성">직접 작성</option>
              </select>
              {memo === "직접 작성" && (
                <input
                  type="text"
                  className="order-input-full mt-2"
                  placeholder="배송 메모를 직접 입력하세요"
                  value={customMemo}
                  onChange={(e) => setCustomMemo(e.target.value)}
                />
              )}
            </div>

            {/* 버튼 영역 */}
            <div className="order-buttons justify-content-end">
              {/*<button onClick={handleOrderButton} className="order-button confirm">
          결제하기
        </button>*/}
              {isProcessing ? (
                <button className={"order-button confirm"}>
                  <span className="loading loading-spinner"></span>
                </button>
              ) : (
                <button
                  className="order-button confirm"
                  onClick={() => {
                    validateForm() && handlePaymentConnection();
                  }}
                >
                  결제하기
                </button>
              )}
              <button
                onClick={handleCancelButton}
                className="order-button cancel"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Order;
