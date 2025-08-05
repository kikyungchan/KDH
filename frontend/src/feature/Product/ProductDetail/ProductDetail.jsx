import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router";
import NoticeSection from "./util/NoticeSection.jsx";
import ProductComment from "./ProductComment.jsx";
import { useEffect, useState } from "react";
import BuyButton from "./util/BuyButton.jsx";
import CartAdded from "./util/CartAdded.jsx";
import { useCart } from "../CartContext.jsx";
import {
  handleBuyButton,
  handleBuyCurrentProductOnly,
  handleCartButton,
  handleGoToCartWithCurrenProduct,
} from "./util/ProductDetailUtilButton.jsx";
import ReviewStats from "./util/ReviewStats.jsx";
import "../css/ProductDetail.css";
import axios from "axios";
import ScrollToTopButton from "./util/ScrollToTopButton.jsx";
import "../css/ProductList.css";
import ShareModal from "./util/ShareModal.jsx";
import { RxShare1 } from "react-icons/rx";
import LikeButton from "./util/LikeButton.jsx";

export function ProductDetail() {
  const [showShareModal, setShowShareModal] = useState(false);
  const { setCartCount } = useCart();
  const [reviewChanged, setReviewChanged] = useState(false);
  const [showCartConfirmModal, setShowCartConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
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

  // 썸네일은 isMain == true 인 항목의 storedPath 사용
  const thumbnail = product.thumbnailPaths?.find((t) => t.isMain)?.storedPath;

  // 본문 이미지 배열
  const detailImages = product.detailImagePaths ?? [];

  function handleQuestionButton() {
    setIsProcessing(true);
    navigate(`/qna/add/${product.id}`);
  }

  return (
    <div className="container">
      <Row className="justify-content-center">
        <Col>
          <div
            style={{
              display: "flex",
              gap: "56px",
              alignItems: "flex-start",
            }}
          >
            {/* 썸네일 이미지 */}
            {thumbnail && (
              <img
                className="product-thumbnail"
                src={thumbnail}
                alt="썸네일 이미지"
              />
            )}

            {/* 오른쪽: 텍스트 및 버튼들 */}
            <div style={{ flex: 1 }}>
              {/* 상품명 + 공유/좋아요 아이콘 */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                  paddingRight: "30px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <h2 style={{ fontSize: "2rem", margin: 0 }}>
                    {product.productName}
                  </h2>
                  {(() => {
                    const insertedAt = new Date(product.insertedAt);
                    const now = new Date();
                    const diffInSeconds = (now - insertedAt) / 1000;
                    const isNew = diffInSeconds <= 60 * 60 * 24 * 7;
                    return isNew ? (
                      <span className="new-badge">NEW</span>
                    ) : null;
                  })()}
                  {product.hot && (
                    <span
                      className="badge hot-badge"
                      style={{ fontSize: "12px" }}
                    >
                      HOT
                    </span>
                  )}
                  {product.quantity === 0 && (
                    <span className="sold-out-badge">SOLD OUT</span>
                  )}
                  {product.quantity > 0 && product.quantity < 5 && (
                    <span className="low-stock-badge">
                      🔥 {product.quantity}개 남음
                    </span>
                  )}
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <RxShare1
                    size={28}
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowShareModal(true)}
                    title="공유하기"
                  />
                  <LikeButton size={32} productId={product.id} />
                </div>
              </div>

              {/* 가격 */}
              <p style={{ fontSize: "1.25rem", fontWeight: "500" }}>
                {product.price.toLocaleString()}원
              </p>

              {/* 상세 설명 */}
              <p
                style={{
                  whiteSpace: "pre-line",
                  fontSize: "1rem",
                  lineHeight: "1.4",
                }}
                dangerouslySetInnerHTML={{ __html: product.info }}
              ></p>

              <hr />

              {/*옵션선택 드롭다운*/}
              {product.quantity > 0 && (
                <>
                  {/* 옵션 선택 */}
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

                  {/* 수량 선택 */}
                  <div style={{ marginTop: "10px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span style={{ fontWeight: "bold" }}>수량</span>
                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((prev) => Math.max(1, prev - 1))
                        }
                        style={{ width: "30px" }}
                      >
                        -
                      </button>

                      <input
                        type="text"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value, 10);
                          if (!isNaN(val)) {
                            if (val > product.quantity) {
                              alert(
                                `현재 재고 부족으로 ${product.quantity}개 이상 구매할 수 없습니다.`,
                              );
                            }
                            setQuantity(
                              Math.max(1, Math.min(product.quantity, val)),
                            );
                          } else {
                            setQuantity(1);
                          }
                        }}
                        style={{ width: "60px", textAlign: "center" }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setQuantity((prev) =>
                            Math.min(product.quantity, prev + 1),
                          )
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
                </>
              )}
              {/*가격이랑 버튼사이 여백주기*/}
              <div className="mt-3"></div>
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
                <div
                  style={{
                    marginTop: "2px",
                    display: "flex",
                    width: "500px",
                    margin: "0 auto",
                    gap: "34px",
                    padding: "0 33px",
                    boxSizing: "border-box",
                  }}
                >
                  <Button
                    onClick={() =>
                      handleBuyButton({
                        product,
                        selectedOption,
                        quantity,
                        thumbnail,
                        setShowCartConfirmModal,
                        navigate,
                        setCartItems,
                      })
                    }
                    style={{
                      border: "3",
                      width: "200px",
                      backgroundColor: "black",
                      color: "white",
                      padding: "12px",
                    }}
                  >
                    구매하기
                  </Button>
                  <Button
                    onClick={() =>
                      handleCartButton({
                        product,
                        selectedOption,
                        quantity,
                        thumbnail,
                        setShowModal,
                        setCartCount,
                      })
                    }
                    style={{ border: "3", width: "200px", padding: "12px" }}
                  >
                    장바구니
                  </Button>
                </div>
              )}
              <br />
              <div>
                {/* 관리자용 수정/삭제 버튼 */}
                {/*Todo: 수정삭제버튼 관리자만 보이게 수정*/}
                <Button className="btn-secondary" onClick={handleEditButton}>
                  수정
                </Button>
                <Button className="btn-danger" onClick={handleDeleteButton}>
                  삭제
                </Button>
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
          <div style={{ marginTop: "50px" }}>
            {/*본문영역에 텍스트*/}
            {/*<div>{product.detailText}</div>*/}

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
            <hr style={{ marginTop: "50px" }} />
            <ReviewStats
              productId={product.id}
              refreshTrigger={reviewChanged}
            />
            <ProductComment
              productId={product.id}
              onReviewChange={() => setReviewChanged((prev) => !prev)}
            />
          </div>
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
        </Col>
      </Row>

      {/*장바구니 버튼 모달*/}
      <CartAdded show={showModal} onHide={() => setShowModal(false)} />

      {/*  구매하기 버튼 눌렀을때 장바구니에 보관한 물품이 있을시 띄우는 모달*/}
      <BuyButton
        show={showCartConfirmModal}
        onHide={() => setShowCartConfirmModal(false)}
        onOnlyBuy={() =>
          handleBuyCurrentProductOnly({
            product,
            selectedOption,
            quantity,
            thumbnail,
            setShowCartConfirmModal,
            navigate,
          })
        }
        onMoveToCart={() =>
          handleGoToCartWithCurrenProduct({
            product,
            selectedOption,
            quantity,
            thumbnail,
            navigate,
            setShowCartConfirmModal,
          })
        }
      />
      <ScrollToTopButton />
      <ShareModal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        shareUrl={window.location.href}
        productName={product.productName}
      />
    </div>
  );
}
