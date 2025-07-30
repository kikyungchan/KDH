import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router";
import NoticeSection from "./NoticeSection.jsx";
import { useEffect, useState } from "react";
import BuyButton from "./BuyButton.jsx";
import CartAdded from "./CartAdded.jsx";
import "../css/ProductDetail.css";
import axios from "axios";

export function ProductDetail() {
  const [showCartConfirmModal, setShowCartConfirmModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/product/view?id=${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  if (!product) {
    return <Spinner />;
  }

  function handleDeleteButton() {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    axios
      .delete(`/api/product/delete?id=${id}`)
      .then((res) => {
        alert("삭제되었습니다.");
        navigate("/product/list");
      })
      .catch((err) => {
        alert("삭제 실패");
      })
      .finally(() => {});
  }

  function handleEditButton() {
    navigate(`/product/edit?id=${id}`);
  }

  const thumbnail = product.imagePath?.[0];
  const detailImages = product.imagePath?.slice(1);

  function handleBuyButton() {
    if (product.options?.length > 0 && !selectedOption) {
      alert("옵션을 선택해주세요.");
      return;
    }

    if (quantity > product.quantity) {
      alert(`재고가 부족합니다.`);
      return;
    }

    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get("/api/product/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.length > 0) {
            setCartItems(res.data);
            setShowCartConfirmModal(true);
          } else {
            navigate("/product/order", {
              state: {
                productId: product.id,
                productName: product.productName,
                price: selectedOption ? selectedOption.price : product.price,
                quantity: quantity,
                imagePath: thumbnail,
                option: selectedOption?.optionName || null,
                optionId: selectedOption?.id || null,
              },
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");

      if (guestCart.length > 0) {
        setCartItems(guestCart);
        setShowCartConfirmModal(true);
      } else {
        navigate("/product/order", {
          state: {
            productId: product.id,
            productName: product.productName,
            price: selectedOption ? selectedOption.price : product.price,
            quantity: quantity,
            imagePath: thumbnail,
            option: selectedOption?.optionName || null,
            optionId: selectedOption?.id || null,
          },
        });
      }
    }
  }

  function handleCartButton() {
    if (product.options?.length > 0 && !selectedOption) {
      alert("옵션을 선택해주세요.");
      return;
    }

    if (quantity > product.quantity) {
      alert(`재고가 부족합니다.`);
      return;
    }

    const token = localStorage.getItem("token");
    // 로그인유저
    if (token) {
      const cartItem = {
        productId: product.id,
        optionName: selectedOption ? selectedOption.optionName : null,
        quantity: quantity,
      };
      axios
        .post("/api/product/cart", cartItem, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setShowModal(true);
        })
        .catch((err) => {})
        .finally(() => {});
    } else {
      //
      if (product.options?.length > 0) {
        // 옵션 있는 상품
        const enrichedOptions = (product.options || []).map((opt, idx) => ({
          ...opt,
          id: idx + 1,
        }));

        const selectedId = enrichedOptions.find(
          (opt) => opt.optionName === selectedOption.optionName,
        )?.id;

        const cartItem = {
          productId: product.id,
          optionId: selectedId,
          productName: product.productName,
          optionName: selectedOption.optionName,
          price: selectedOption.price,
          quantity: quantity,
          imagePath: thumbnail,
          options: enrichedOptions,
        };

        const existingCart = JSON.parse(
          localStorage.getItem("guestCart") || "[]",
        );
        const existingIndex = existingCart.findIndex(
          (item) =>
            item.productId === cartItem.productId &&
            item.optionName === cartItem.optionName,
        );
        if (existingIndex > -1) {
          existingCart[existingIndex].quantity += cartItem.quantity;
        } else {
          existingCart.push(cartItem);
        }
        localStorage.setItem("guestCart", JSON.stringify(existingCart));
      } else {
        // 옵션 없는 상품
        const cartItem = {
          productId: product.id,
          productName: product.productName,
          price: product.price,
          quantity: quantity,
          imagePath: thumbnail,
          optionName: null,
          optionId: null,
          options: [],
        };

        const existingCart = JSON.parse(
          localStorage.getItem("guestCart") || "[]",
        );
        const existingIndex = existingCart.findIndex(
          (item) => item.productId === cartItem.productId,
        );
        if (existingIndex > -1) {
          existingCart[existingIndex].quantity += cartItem.quantity;
        } else {
          existingCart.push(cartItem);
        }
        localStorage.setItem("guestCart", JSON.stringify(existingCart));
      }

      setShowModal(true);
    }
  }

  // 구매하기 // 장바구니상품함께구매
  function handleGoToCartWithCurrenProduct() {
    const token = localStorage.getItem("token");

    if (product.options?.length > 0 && !selectedOption) {
      alert("옵션을 선택해주세요.");
      return;
    }

    if (token) {
      const cartItem = {
        productId: product.id,
        optionName:
          product.options?.length > 0 ? selectedOption.optionName : null,
        quantity: quantity,
      };
      axios
        .post("/api/product/cart", cartItem, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          setShowCartConfirmModal(false);
          navigate("/product/cart");
        })
        .catch((err) => {
          console.error("장바구니 추가 실패", err);
          alert("장바구니 추가에 실패했습니다.");
        });
    } else {
      const enrichedOptions = (product.options || []).map((opt, idx) => ({
        ...opt,
        id: idx + 1,
      }));

      const selectedId = enrichedOptions.find(
        (opt) => opt.optionName === selectedOption.optionName,
      )?.id;

      const cartItem = {
        productId: product.id,
        optionId: selectedId,
        productName: product.productName,
        optionName:
          product.options?.length > 0 ? selectedOption.optionName : null,
        price:
          product.options?.length > 0 ? selectedOption.price : product.price,
        quantity: quantity,
        imagePath: thumbnail,
        options: enrichedOptions,
      };

      const existingCart = JSON.parse(
        localStorage.getItem("guestCart") || "[]",
      );
      const existingIndex = existingCart.findIndex(
        (item) =>
          item.productId === cartItem.productId &&
          item.optionName === cartItem.optionName,
      );

      if (existingIndex > -1) {
        existingCart[existingIndex].quantity += cartItem.quantity;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem("guestCart", JSON.stringify(existingCart));
      setShowCartConfirmModal(false);
      navigate("/product/cart");
    }
  }

  // 구매하기 // 단일상품구매
  function handleBuyCurrentProductOnly() {
    if (product.options?.length > 0 && !selectedOption) {
      alert("옵션을 선택해주세요.");
      return;
    }

    setShowCartConfirmModal(false);

    navigate("/product/order", {
      state: {
        productId: product.id,
        productName: product.productName,
        price: selectedOption ? selectedOption.price : product.price,
        quantity: quantity,
        imagePath: thumbnail,
        option: selectedOption?.optionName || null,
        optionId: selectedOption?.id || null,
      },
    });
  }

  function handleQuestionButton() {
    setIsProcessing(true);
    navigate(`/qna/add/${product.id}`);
  }

  return (
    <Container className="product-detail">
      <Row className="justify-content-center">
        <Col>
          <div
            style={{
              display: "flex",
              gap: "100px",
              alignItems: "flex-start",
            }}
          >
            {/* 썸네일 이미지 */}
            {thumbnail && (
              <img
                style={{
                  width: "500px",
                  height: "500px",
                }}
                className="product-thumbnail"
                src={thumbnail}
                alt="썸네일 이미지"
              />
            )}
            <div style={{ flex: 1 }}>
              <h2>{product.productName}</h2>
              <p>{product.price.toLocaleString()}원</p>
              <p>{product.info}</p>
              <hr />

              {/*옵션선택 드롭다운*/}
              {product.options?.length > 0 && (
                <div style={{ margin: "10px 0" }}>
                  <label>선택:</label>
                  <select
                    onChange={(e) => {
                      const selected = product.options?.find(
                        (opt) => opt.optionName === e.target.value,
                      );
                      setSelectedOption(selected);
                    }}
                    style={{ padding: "5px", marginLeft: "10px" }}
                  >
                    <option value="">옵션을 선택하세요</option>
                    {product.options?.map((opt, idx) => (
                      <option key={idx} value={opt.optionName}>
                        {opt.optionName} - {opt.price.toLocaleString()}원
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* 수량 선택*/}
              <div style={{ marginTop: "10px" }}>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <span style={{ fontWeight: "bold" }}>수량</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    style={{ width: "30px" }}
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((prev) => Math.min(99, prev + 1))
                    }
                    style={{ width: "30px" }}
                  >
                    +
                  </button>
                </div>

                <div
                  style={{
                    marginTop: "15px",
                    fontSize: "22px",
                    fontWeight: "bold",
                  }}
                >
                  총 가격:{" "}
                  {(
                    quantity *
                    (selectedOption ? selectedOption.price : product.price)
                  ).toLocaleString()}
                  원
                </div>
              </div>

              {/*버튼*/}
              {product.quantity === 0 ? (
                // 품절 상태일 경우
                <div style={{ marginTop: "2px" }}>
                  <button
                    disabled
                    style={{
                      width: "50%",
                      backgroundColor: "#ccc",
                      color: "#fff",
                      padding: "12px",
                      fontWeight: "bold",
                      border: "none",
                      cursor: "not-allowed",
                    }}
                  >
                    품절된 상품입니다
                  </button>
                </div>
              ) : (
                // 재고 있는 경우 기존 버튼들
                <div style={{ marginTop: "2px", display: "flex", gap: "10px" }}>
                  <button
                    onClick={handleBuyButton}
                    style={{
                      border: "3",
                      width: "150px",
                      backgroundColor: "black",
                      color: "white",
                    }}
                  >
                    구매하기
                  </button>
                  <button
                    onClick={handleCartButton}
                    style={{ border: "3", width: "150px" }}
                  >
                    장바구니
                  </button>
                  {/* 관리자용 수정/삭제 버튼 */}
                  {/*Todo: 수정삭제버튼 관리자만 보이게 수정*/}
                  <Button className="btn-secondary" onClick={handleEditButton}>
                    수정
                  </Button>
                  <Button className="btn-danger" onClick={handleDeleteButton}>
                    삭제
                  </Button>
                </div>
              )}
              <br />
              <div>
                <Button
                  className="btn-primary"
                  onClick={handleQuestionButton}
                  disabled={isProcessing}
                >
                  문의하기
                </Button>
              </div>
            </div>
          </div>
          <hr />
          {/* 본문영역 */}
          <div style={{ marginTop: "" }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {detailImages?.map((path, index) => (
                <img
                  key={index}
                  src={path}
                  alt={`상세 이미지 ${index + 1}`}
                  className="product-detail-image"
                />
              ))}
            </div>
            <NoticeSection />
            {/*
    todo : faq 페이지, 추천해주는 질문 몇개를 골라서 3개 이상 답하도록

      <div>
        <h2>QnA</h2>

        <div>
          \
          todo : 질문자 아이디나 닉네임 공개할지 여부를 정하고 이후 결정
          <div>
            <img
              src=""
              alt=""
              style={{ width: "50px", height: "50px", backgroundColor: "#ccc" }}
            />
            <span>질문자 이름(DB 연결 예정)</span>
          </div>

          <div>
            <h5>
              <span>Q : </span> 상품 무게가 어느 정도 되나요? (질문 제목)
            </h5>
            <p>A : </p>
            <textarea
              style={{
                width: "100%",
                height: "100px",
                resize: "none",
                overflow: "hidden",
                border: "1px solid #ffffff",
                borderRadius: "20px",
              }}
              readOnly
              value="네 고객님, 상품 무게가 어느 정도 나가는지에 대해 질문 주셨는데요,
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias
              aliquid animi autem beatae deleniti eum incidunt labore nisi
              officia quibusdam quo reiciendis sed suscipit, temporibus
              voluptate? Mollitia nam obcaecati perferendis."
            />
          </div>
        </div>
      </div>*/}
          </div>
        </Col>
      </Row>

      {/*장바구니 버튼 모달*/}
      <CartAdded show={showModal} onHide={() => setShowModal(false)} />

      {/*  구매하기 버튼 눌렀을때 장바구니에 보관한 물품이 있을시 띄우는 모달*/}
      <BuyButton
        show={showCartConfirmModal}
        onHide={() => setShowCartConfirmModal(false)}
        onOnlyBuy={handleBuyCurrentProductOnly}
        onMoveToCart={handleGoToCartWithCurrenProduct}
      />
    </Container>
  );
}
