import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate, useSearchParams } from "react-router";
import NoticeSection from "./util/NoticeSection.jsx";
import ProductComment from "./ProductComment.jsx";
import { useContext, useEffect, useRef, useState } from "react";
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
import { AuthenticationContext } from "../../common/AuthenticationContextProvider.jsx";
import ProductDetailToggle from "./util/ProductDetailToggle.jsx";
import RecommendedProduct from "./util/RecommendedProduct.jsx";

export function ProductDetail() {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const { setCartCount } = useCart();
  const [reviewChanged, setReviewChanged] = useState(false);
  const [showCartConfirmModal, setShowCartConfirmModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, isAdmin } = useContext(AuthenticationContext);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/product/view?id=${id}`)
      .then((res) => {
        setProduct(res.data);
        const firstThumb = res.data.thumbnailPaths?.[0];
        if (firstThumb) {
          setSelectedThumbnail(firstThumb.storedPath);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    if (product?.category) {
      axios
        .get(`/api/product/best?category=${product.category}&limit=6`)
        .then((res) => {
          // 현재 상품은 제외
          const filtered = res.data.filter((p) => p.id !== product.id);
          setRelatedProducts(filtered);
        })
        .catch(console.error);
    }
  }, [product]);

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
  const thumbnail =
    product.thumbnailPaths?.find((t) => t.isMain)?.storedPath ??
    product.thumbnailPaths?.[0]?.storedPath;

  function handleQuestionButton() {
    setIsProcessing(true);
    navigate(`/qna/add/${product.id}`);
  }

  return (
    <div className="container">
      <div className="product-detail-layout">
        <div className="product-main-content">
          <div className="thumbnail-section">
            {selectedThumbnail && (
              <img
                className="product-main-thumbnail"
                src={selectedThumbnail}
                alt="대표 썸네일"
              />
            )}
            <div className="thumbnail-list">
              {product.thumbnailPaths?.map((thumb, idx) => (
                <img
                  key={idx}
                  src={thumb.storedPath}
                  alt={`썸네일 ${idx + 1}`}
                  className={`small-thumbnail ${
                    selectedThumbnail === thumb.storedPath ? "active" : ""
                  }`}
                  onClick={() => setSelectedThumbnail(thumb.storedPath)}
                />
              ))}
            </div>
          </div>

          <div className="product-info-section">
            <div className="product-title-header">
              <h2 className="product-name-title">{product.productName}</h2>
              <div className="product-badges-detail">
                {(() => {
                  const insertedAt = new Date(product.insertedAt);
                  const now = new Date();
                  const diffInSeconds = (now - insertedAt) / 1000;
                  const isNew = diffInSeconds <= 60 * 60 * 24 * 7;
                  return isNew ? <span className="new-badge">NEW</span> : null;
                })()}
                {product.hot && <span className="hot-badge">HOT</span>}
                {product.quantity === 0 && (
                  <span className="sold-out-badge">SOLD OUT</span>
                )}
                {product.quantity > 0 && product.quantity < 5 && (
                  <span className="low-stock-badge">
                    🔥 {product.quantity}개 남음
                  </span>
                )}
              </div>
              <div className="product-actions universal-actions">
                <RxShare1
                  className="action-icon"
                  onClick={() => setShowShareModal(true)}
                  title="공유하기"
                />
                <LikeButton size={28} productId={product.id} />
              </div>
            </div>

            <p className="product-price-detail">
              {product.price.toLocaleString()}원
            </p>

            <hr className="divider" />

            <p
              className="product-info-text"
              dangerouslySetInnerHTML={{ __html: product.info }}
            ></p>

            <hr className="divider" />

            {product.quantity > 0 && (
              <>
                {product.options?.length > 0 && (
                  <div className="option-select-box">
                    <label>선택:</label>
                    <select
                      onChange={(e) => {
                        const selected = product.options?.find(
                          (opt) => opt.optionName === e.target.value,
                        );
                        setSelectedOption(selected);
                      }}
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

                <div className="quantity-control-box">
                  <span className="quantity-label">수량</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
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
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(product.quantity, prev + 1),
                      )
                    }
                  >
                    +
                  </button>
                </div>

                <div className="total-price">
                  총 가격:{" "}
                  {(
                    quantity *
                    (selectedOption ? selectedOption.price : product.price)
                  ).toLocaleString()}
                  원
                </div>
              </>
            )}

            <div className="button-group-wrapper">
              {product.quantity === 0 ? (
                <button disabled className="sold-out-button">
                  품절된 상품입니다
                </button>
              ) : (
                <div className="action-buttons-group">
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
                    className="buy-button"
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
                    className="cart-button"
                  >
                    장바구니
                  </Button>
                </div>
              )}
              {user !== null && isAdmin && (
                <>
                  <div className="admin-buttons">
                    <Button
                      className="btn-secondary"
                      onClick={handleEditButton}
                    >
                      수정
                    </Button>
                    <Button className="btn-danger" onClick={handleDeleteButton}>
                      삭제
                    </Button>
                  </div>
                </>
              )}
              <Button
                className="btn-primary mt-3"
                onClick={handleQuestionButton}
                disabled={isProcessing}
              >
                문의하기
              </Button>
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
          </div>
        </div>

        <hr className="mt-5" />
        <div className="product-body-section">
          <ProductDetailToggle detailImagePaths={product.detailImagePaths} />
          <NoticeSection />
          <hr className="divider" />
          <ReviewStats productId={product.id} refreshTrigger={reviewChanged} />
          <ProductComment
            productId={product.id}
            onReviewChange={() => setReviewChanged((prev) => !prev)}
          />
        </div>
        <hr className="divider" />
        <RecommendedProduct products={relatedProducts} />
      </div>
      <CartAdded show={showModal} onHide={() => setShowModal(false)} />
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
        onClose={() => setShowShareModal(false)}
        shareUrl={window.location.href}
        productName={product.productName}
      />
    </div>
  );
}
