import { Col, Row } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useCart } from "./CartContext.jsx";

function ProductCart(props) {
  const [selectedStock, setSelectedStock] = useState(null);
  const { setCartCount } = useCart();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [checkedIds, setCheckedIds] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const selectedItems = cartItems.filter((_, idx) => checkedIds.includes(idx));
  const totalItemPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee =
    checkedIds.length > 0 ? (totalItemPrice >= 100000 ? 0 : 3000) : 0;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // 로그인사용자
      axios
        .get("/api/product/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log("응답 데이터:", res.data);
          setCartItems(res.data);
        })
        .catch((err) => console.log(err));
    } else {
      // 비로그인 사용자 => localStorage 에서 guestCart 가져옴
      const localCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setCartItems(localCart);
    }
  }, []);

  function handleEditOption(item) {
    setSelectedItem(item);
    setSelectedOptionId(item.optionId); // 기존 선택된 옵션
    setSelectedQuantity(item.quantity); // 기존 수량

    if (item.options?.length > 0) {
      const selectedOpt = item.options.find(
        (opt) => Number(opt.id) === Number(item.optionId), // 여기로 수정
      );
      setSelectedStock(selectedOpt?.stockQuantity ?? Infinity); // 옵션 상품일 경우
    } else {
      setSelectedStock(item.stockQuantity ?? Infinity); // 옵션 없는 상품
    }

    setShowModal(true);
  }

  function handleCheckboxChange(index, checked) {
    if (checked) {
      setCheckedIds((prev) => [...prev, index]);
    } else {
      setCheckedIds((prev) => prev.filter((item) => item !== index));
    }
  }

  function handleSelectAllCheckboxChange(e) {
    const checked = e.target.checked;
    if (checked) {
      const all = cartItems.map((_, index) => index);
      setCheckedIds(all);
    } else {
      setCheckedIds([]);
    }
  }

  function handleDeleteSelected() {
    const token = localStorage.getItem("token");
    const deleteList = checkedIds.map((index) => {
      const item = cartItems[index];
      return {
        cartId: item.cartId,
      };
    });

    // 로그인 사용자인 경우
    if (token) {
      axios
        .delete("/api/product/cart/delete", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: deleteList,
        })
        .then(() => {
          // 삭제 성공하면 다시 장바구니 목록 불러오기
          return axios.get("/api/product/cart", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        })
        .then((res) => {
          setCartItems(res.data); //
          setCheckedIds([]);
          setCartCount(res.data.length);
        })
        .catch((err) => {
          console.error("삭제 실패:", err);
        });
    } else {
      // 비로그인 사용자 - localStorage 에서 삭제 처리
      const newCartItems = cartItems.filter(
        (_, idx) => !checkedIds.includes(idx),
      );
      setCartItems(newCartItems);
      setCheckedIds([]);
      localStorage.setItem("guestCart", JSON.stringify(newCartItems));
      setCartCount(newCartItems.length);
    }
  }

  function handleUpdateCartItem() {
    const token = localStorage.getItem("token");

    if (token) {
      // 회원
      const data = {
        cartId: selectedItem.cartId,
        optionId: selectedOptionId,
        quantity: selectedQuantity,
      };

      axios
        .put("/api/product/cart/update", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          return axios.get("/api/product/cart", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        })
        .then((res) => {
          setCartItems(res.data);
          setShowModal(false);
        })
        .catch((err) => {});
    } else {
      // 비회원
      const existingCart = JSON.parse(
        localStorage.getItem("guestCart") || "[]",
      );

      let updatedCart = [...existingCart];

      // 옵션이 있는 상품
      if ((selectedItem.options || []).length > 0) {
        const newOption = selectedItem.options.find(
          (opt) => opt.id === selectedOptionId,
        );
        if (!newOption) return;

        for (let i = 0; i < updatedCart.length; i++) {
          const item = updatedCart[i];

          const isEditingTarget =
            item.productName === selectedItem.productName &&
            item.optionName === selectedItem.optionName;

          const isTargetMerged =
            item.productName === selectedItem.productName &&
            item.optionName === newOption.optionName;

          if (isTargetMerged && !isEditingTarget) {
            item.quantity += selectedQuantity;

            updatedCart = updatedCart.filter(
              (it) =>
                !(
                  it.productName === selectedItem.productName &&
                  it.optionName === selectedItem.optionName
                ),
            );
            break;
          }

          if (isEditingTarget) {
            item.optionName = newOption.optionName;
            item.price = newOption.price;
            item.quantity = selectedQuantity;
            item.optionId = newOption.id;
            break;
          }
        }
      } else {
        // 옵션이 없는 상품 → 수량만 수정
        for (let i = 0; i < updatedCart.length; i++) {
          const item = updatedCart[i];
          if (item.productId === selectedItem.productId) {
            item.quantity = selectedQuantity;
            break;
          }
        }
      }

      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      setShowModal(false);
    }
  }

  function handleOrderButton() {
    if (checkedIds.length === 0) {
      alert("주문할 상품을 선택하세요.");
      return;
    }
    const selectedItems = cartItems.filter((_, idx) =>
      checkedIds.includes(idx),
    );
    navigate("/product/order", {
      state: {
        items: selectedItems.map((item) => ({
          ...item,
          productId: item.productId,
          optionId: item.optionId,
          cartId: item.cartId,
        })),
      },
    });
  }

  return (
    <div className="page-wrapper">
      <div className="center-top-container">
        <div className="w-full mx-auto px-4">
          {/* 메인: 장바구니 리스트 */}
          <main className="w-[800px] mx-auto">
            <div className="rounded-card">
              <h2 className="text-center text-3xl font-bold mb-6">장바구니</h2>

              {cartItems.length === 0 ? (
                <div className="text-center py-10">
                  <h4 className="text-lg font-semibold">
                    장바구니가 비어있습니다.
                  </h4>
                  <p>원하는 상품을 장바구니에 담아보세요.</p>
                </div>
              ) : (
                <>
                  {/* 헤더 */}
                  <div className="grid grid-cols-12 font-bold border-b py-3 items-center">
                    <div className="col-span-1 flex justify-center">
                      <input
                        type="checkbox"
                        checked={
                          checkedIds.length === cartItems.length &&
                          cartItems.length > 0
                        }
                        onChange={handleSelectAllCheckboxChange}
                      />
                    </div>
                    <div className="col-span-5 ml-10">상품 정보</div>
                    <div className="col-span-2 text-center">수량</div>
                    <div className="col-span-2 text-center">가격</div>
                    <div className="col-span-2 text-center">총 금액</div>
                  </div>

                  {/* 장바구니 아이템들 */}
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 items-center border-b border-gray-300 py-4"
                    >
                      <div className="col-span-1 flex justify-center">
                        <input
                          type="checkbox"
                          checked={checkedIds.includes(index)}
                          onChange={(e) =>
                            handleCheckboxChange(index, e.target.checked)
                          }
                        />
                      </div>

                      <div className="col-span-5 flex gap-4 items-center">
                        <img
                          src={item.imagePath || "/default.jpg"}
                          alt="상품이미지"
                          onClick={() =>
                            navigate(`/product/view?id=${item.productId}`)
                          }
                          className="w-28 h-24 object-cover cursor-pointer rounded"
                        />
                        <div>
                          <div className="font-bold">{item.productName}</div>
                          <div className="text-sm text-gray-500">
                            {item.optionName}
                          </div>
                        </div>
                      </div>

                      <div className="col-span-2 text-center">
                        {item.quantity}개
                        <div className="mt-2">
                          <button
                            onClick={() => handleEditOption(item)}
                            className="btn btn-sm btn-outline"
                          >
                            옵션/수량 변경
                          </button>
                        </div>
                      </div>

                      <div className="col-span-2 text-center">
                        {item.price?.toLocaleString() || "-"}원
                      </div>

                      <div className="col-span-2 text-center">
                        {item.price && item.quantity
                          ? (item.price * item.quantity).toLocaleString()
                          : "-"}
                        원
                      </div>
                    </div>
                  ))}

                  {/* 선택 삭제 / 유의사항 */}
                  <div className="flex items-center gap-2 mt-4">
                    <button
                      onClick={handleDeleteSelected}
                      className="btn btn-outline"
                    >
                      선택 삭제
                    </button>
                    <div className="ms-auto text-right text-sm text-gray-500">
                      <p>배송시 문제생겨도 책임안집니다.</p>
                      <p>어쩌구 저쩌구</p>
                    </div>
                  </div>
                  {/*<hr className="mt-4" />*/}
                </>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {/*옵션/수량 변경 모달*/}
                {showModal && selectedItem && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(0, 0, 0, 0.5)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 9999,
                    }}
                  >
                    <div
                      style={{
                        background: "white",
                        padding: 24,
                        width: 400,
                        borderRadius: 8,
                      }}
                    >
                      <h5 className="font-semibold text-center mb-3">
                        옵션 / 수량 변경
                      </h5>
                      {/* 상품 이미지 및 이름 */}
                      <div className="flex items-center gap-5 mb-3">
                        <img
                          src={selectedItem.imagePath}
                          alt="상품"
                          style={{
                            width: 80,
                            height: 80,
                            objectFit: "cover",
                          }}
                          className="rounded"
                        />
                        <span>{selectedItem.productName}</span>
                      </div>

                      {/* 옵션 선택 */}
                      {(selectedItem.options || []).length > 0 && (
                        <div className="flex items-center ">
                          <label className="block w-25 font-semibold me-4">
                            옵션 선택
                          </label>
                          <select
                            className=" select select-bordered w-full"
                            value={
                              selectedOptionId !== null
                                ? String(selectedOptionId)
                                : ""
                            }
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              setSelectedOptionId(value);

                              // 선택된 옵션의 재고 찾아서 갱신
                              const selectedOpt = selectedItem.options.find(
                                (opt) => Number(opt.id) === value,
                              );
                              if (selectedOpt) {
                                setSelectedStock(selectedOpt.stockQuantity); // 재고 갱신
                              } else {
                                setSelectedStock(Infinity);
                              }
                            }}
                          >
                            <option value="">옵션 선택</option>
                            {selectedItem.options.map((opt) => (
                              <option key={opt.id} value={String(opt.id)}>
                                {opt.optionName} (+{opt.price?.toLocaleString()}
                                원)
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* 수량 설정 */}
                      <div className="flex mt-4 items-center">
                        <label className="block w-25 font-semibold mr-9">
                          수량
                        </label>
                        <div className="join">
                          <button
                            className="join-item btn"
                            onClick={() =>
                              setSelectedQuantity((q) => Math.max(1, q - 1))
                            }
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={selectedQuantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (isNaN(value) || value < 1) return;

                              const maxQty = selectedStock ?? Infinity;
                              if (value > maxQty) {
                                alert(
                                  `재고 ${maxQty}개 이상 구매하실 수 없습니다.`,
                                );
                                setSelectedQuantity(maxQty);
                              } else {
                                setSelectedQuantity(value);
                              }
                            }}
                            className="input input-bordered join-item text-center"
                            style={{ width: 60, textAlign: "center" }}
                          />
                          <button
                            className="btn join-item"
                            onClick={() => {
                              const maxQty = selectedStock ?? Infinity;
                              if (selectedQuantity + 1 > maxQty) {
                                alert(
                                  `재고 ${maxQty}개 이상 구매하실 수 없습니다.`,
                                );
                                return;
                              }
                              setSelectedQuantity((q) => q + 1);
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* 버튼 영역 */}
                      <div className="mt-4 d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          className="btn btn-dark"
                          onClick={handleUpdateCartItem}
                        >
                          변경
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowModal(false)}
                          className="btn btn-secondary"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
          {/* 우측: 주문 요약 sticky */}
          <aside className="hidden xl:block fixed left-1/2 top-30 ml-[416px] w-[320px] z-30">
            <div className="rounded-card p-6 bg-white shadow">
              <h3 className="text-xl text-center font-semibold mb-4">
                주문 요약
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>상품금액</span>
                  <span>{totalItemPrice.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span>배송비</span>
                  <span>{shippingFee.toLocaleString()}원</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-base font-bold">
                  <span>총 주문금액</span>
                  <span>
                    {(totalItemPrice + shippingFee).toLocaleString()}원
                  </span>
                </div>
              </div>

              <button
                onClick={handleOrderButton}
                className="btn btn-neutral w-full mt-5"
              >
                {`주문하기${checkedIds?.length ? ` (${checkedIds.length}개)` : ""}`}
              </button>
              <button
                onClick={() => navigate("/home")}
                className="btn w-full mt-2"
              >
                쇼핑 계속하기
              </button>
            </div>
          </aside>
        </div>

        {/* 모바일: 하단 고정 CTA */}
        {cartItems.length > 0 && (
          <div className="xl:hidden fixed inset-x-0 bottom-0 z-50 border-t bg-white p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="text-base">
                <div className="text-gray-600 text-sm">총 주문금액</div>
                <div className="text-lg font-bold">
                  {(totalItemPrice + shippingFee).toLocaleString()}원
                </div>
              </div>
              <button onClick={handleOrderButton} className="btn btn-dark">
                주문하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCart;
