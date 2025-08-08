import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router";
import NoticeSection from "./util/NoticeSection.jsx";
import ProductComment from "./ProductComment.jsx";
import { useContext, useEffect, useState } from "react";
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

export function ProductDetail() {
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

  // 본문 이미지 배열
  const detailImages = product.detailImagePaths ?? [];

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
              <div className="product-actions">
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
                <div className="admin-buttons">
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
              )}
            </div>
          </div>
        </div>

        <hr className="mt-5" />
        <div className="product-body-section">
          <div className="detail-images-container">
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
          <hr className="divider" />
          <ReviewStats productId={product.id} refreshTrigger={reviewChanged} />
          <ProductComment
            productId={product.id}
            onReviewChange={() => setReviewChanged((prev) => !prev)}
          />
        </div>
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
