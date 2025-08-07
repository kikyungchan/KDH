import { useLocation, useNavigate } from "react-router";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/ProductOrder.css";
import { useCart } from "./CartContext.jsx";

function Order(props) {
  const [postalCode, setPostalCode] = useState("");
  const [memo, setMemo] = useState("");
  const [customMemo, setCustomMemo] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");
  const [receiverDetailAddress, setReceiverDetailAddress] = useState("");
  const [sameAsOrderer, setSameAsOrderer] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const { state } = useLocation();
  const { setCartCount } = useCart();
  // items가 배열이 아니더라도 자동으로 배열로 감싸줌.
  const items = state?.items ?? (state ? [state] : []);
  const totalItemPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = totalItemPrice >= 100000 ? 0 : 3000;
  const navigate = useNavigate();

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
          setAddress(res.data.address);
          setName(res.data.name);
          setPhone(res.data.phone);
        })
        .catch((err) => {});
    }
  }, []);

  if (!state || items.length === 0) {
    return <div>잘못된 접근입니다.</div>;
  }

  // const totalPrice = state.price * state.quantity;
  // const shippingFee = totalPrice >= 100000 ? 0 : 3000;

  function handleCancelButton() {
    alert("주문이 취소되었습니다.");
    navigate(-1);
  }

  function handleOrderButton() {
    // 입력값 유효성 검사
    // 주문자 정보
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("주문자 정보를 모두 입력해 주세요.");
      return;
    }
    // 배송 정보
    if (
      !receiverName.trim() ||
      !receiverPhone.trim() ||
      !receiverAddress.trim() ||
      !receiverDetailAddress.trim() ||
      !postalCode.trim()
    ) {
      alert("배송지 정보를 모두 입력해 주세요.");
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
      shippingAddress: address,
      memo: memo === "직접 작성" ? customMemo : memo,
      totalPrice: item.price * item.quantity,
      zipcode: postalCode,
      addressDetail: receiverDetailAddress,
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
          /*return new Promise((resolve) => {
            const checkoutWindow = window.open(
              "/pay/Checkout", // 새 창에서 열 주소
              "_blank", // 새 창
              "width=600,height=800",
            );
            console.log("checkoutWindow", checkoutWindow);
          });*/
        })
        .then((res) => {
          alert("주문이 완료되었습니다.");
          navigate("/product/order/complete", {
            state: {
              items,
              orderToken,
              orderer: { name, phone, address },
              receiver: {
                name: receiverName,
                phone: receiverPhone,
                address: receiverAddress,
                postalCode,
                receiverDetailAddress,
              },
              memo: memo === "직접 작성" ? customMemo : memo,
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
        shippingAddress: address,
        memo: memo === "직접 작성" ? customMemo : memo,
        totalPrice: item.price * item.quantity,
        guestName: name,
        guestPhone: phone,
        receiverName: receiverName,
        receiverPhone: receiverPhone,
        receiverAddress: receiverAddress,
        postalCode: postalCode,
        detailedAddress: receiverDetailAddress,
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
                cartItem.optionId === ordered.optionId &&
                cartItem.quantity === ordered.quantity &&
                cartItem.productName === ordered.productName,
            ),
        );
        setCartCount(updatedCart.length);
        navigate("/product/order/complete", {
          state: {
            items,
            orderToken: token,
            orderer: { name, phone, address },
            receiver: {
              name: receiverName,
              phone: receiverPhone,
              address: receiverAddress,
              postalCode,
              receiverDetailAddress,
            },
            memo: memo === "직접 작성" ? customMemo : memo,
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
      setPostalCode("");
      setReceiverDetailAddress("");
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
          setPostalCode(res.data.zipCode);
          setReceiverDetailAddress(res.data.addressDetail);
        });
    } else {
      setReceiverName(name);
      setReceiverPhone(phone);
      setReceiverAddress(address);
      setPostalCode("");
      setReceiverDetailAddress("");
    }
  }

  function handleSearchAddress() {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setReceiverAddress(data.address); // 도로명 주소
        setPostalCode(data.zonecode); // 우편번호 필요하면 이것도
        console.log("작동");
      },
    }).open();
  }

  return (
    <div className="container">
      <h2 style={{ fontSize: "2rem" }}>결제하기</h2>

      <div className="order-box" style={{ display: "flex", gap: "20px" }}>
        {/* 왼쪽: 주문 상품 목록 */}
        <div style={{ flex: 2 }}>
          <h4>주문 상품 정보</h4>
          {items.map((item, idx) => (
            <div key={idx} className="order-product">
              <img
                onClick={() =>
                  window.open(`/product/view?id=${item.productId}`, "_blank")
                }
                src={item.imagePath}
                alt="상품"
                style={{ width: "150px", height: "150px", cursor: "pointer" }}
              />
              <div className="order-product-info">
                <div>
                  <strong>{item.productName}</strong>
                </div>
                <div>
                  {item.optionName ?? item.option} / {item.quantity}개
                </div>
                <div>{(item.price * item.quantity).toLocaleString()}원</div>
              </div>
            </div>
          ))}
        </div>
        {/* 오른쪽: 주문 요약 */}
        <div
          style={{
            flex: 1,
            background: "#f9f9f9",
            padding: "16px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            height: "fit-content",
          }}
        >
          <h5 style={{ marginBottom: "12px" }}>주문 요약</h5>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>상품가격</span>
            <span>{totalItemPrice.toLocaleString()}원</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "6px",
            }}
          >
            <span>배송비</span>
            <span>+{shippingFee.toLocaleString()}원</span>
          </div>
          <hr />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
            }}
          >
            <span>총 주문금액</span>
            <span>{(totalItemPrice + shippingFee).toLocaleString()}원</span>
          </div>
        </div>
      </div>
      {/* 주문자 정보 */}
      <div className="order-box">
        <h4>주문자 정보</h4>
        <div className="order-input-row">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름"
            className="order-input-half"
          />
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="연락처"
            className="order-input-half"
          />
        </div>
        <input
          type="text"
          value={address}
          placeholder="주소"
          onChange={(e) => setAddress(e.target.value)}
          className="order-input-full"
        />
      </div>

      {/* 배송 정보 */}
      <div className="order-box">
        <h4>배송 정보</h4>
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
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />
          <button onClick={handleSearchAddress} className="order-input-full">
            주소찾기
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
          value={receiverDetailAddress}
          onChange={(e) => setReceiverDetailAddress(e.target.value)}
        />
      </div>

      {/* 배송 메모 */}
      <div className="order-box">
        <h4>배송 메모</h4>
        <select
          className="order-select"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        >
          <option value="">배송메모를 선택해 주세요.</option>
          <option value="문 앞에 두고 가주세요">문 앞에 두고 가주세요</option>
          <option value="부재 시 전화주세요">부재 시 전화주세요</option>
          <option value="경비실에 맡겨주세요">경비실에 맡겨주세요</option>
          <option value="직접 작성">직접 작성</option>
        </select>
        {memo === "직접 작성" && (
          <input
            type="text"
            className="order-input-full"
            placeholder="배송 메모를 직접 입력하세요"
            value={customMemo}
            onChange={(e) => setCustomMemo(e.target.value)}
          />
        )}
      </div>

      {/* 버튼 영역 */}
      <div className="order-buttons">
        <button onClick={handleOrderButton} className="order-button confirm">
          결제하기
        </button>
        <button onClick={handleCancelButton} className="order-button cancel">
          취소
        </button>
        <button
          className={"btn btn-primary"}
          onClick={() => {
            const checkoutWindow = window.open(
              "/pay/Checkout", // 새 창에서 열 주소
              "_blank", // 새 창
              "width=600,height=800",
            );
            console.log(checkoutWindow);
          }}
        >
          토스 페이먼츠
        </button>
      </div>
    </div>
  );
}

export default Order;
