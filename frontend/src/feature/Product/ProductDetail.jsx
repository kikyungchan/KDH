import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Col, Container, Modal, Row, Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router";
import "./css/ProductDetail.css";

export function ProductDetail() {
  const [showModal, setShowModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const navigate = useNavigate();

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
    if (!selectedOption) {
      alert("옵션을 선택해주세요.");
      return;
    }
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

  function handleCartButton() {
    if (!selectedOption) {
      alert("옵션을 선택해주세요.");
      return;
    }

    const token = localStorage.getItem("token");
    // 로그인유저
    if (token) {
      const cartItem = {
        productId: product.id,
        optionName: selectedOption.optionName,
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
      // 옵션에 id 없으면 index를 임시 id로 할당
      // 비로그인유저
      const enrichedOptions = (product.options || []).map((opt, idx) => ({
        ...opt,
        id: idx + 1,
      }));

      const selectedId = enrichedOptions.find(
        (opt) => opt.optionName === selectedOption.optionName,
      )?.id;

      const cartItem = {
        productId: product.id,
        productName: product.productName,
        optionName: selectedOption.optionName,
        optionId: selectedId,
        price: selectedOption.price,
        quantity: quantity,
        imagePath: thumbnail,
        options: enrichedOptions, // ✅ 반드시 이걸로 저장!
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
      setShowModal(true);
    }
  }

  return (
    <Container>
      <Row className="justify-content-center">
        <Col>
          <div
            style={{
              display: "flex",
              gap: "150px",
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
              <h2>{product.productName}!!!</h2>
              <p>{product.price.toLocaleString()}원</p>
              <hr />
              <p>{product.info}</p>

              {/*옵션선택 드롭다운*/}
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
                {/*Todo: 수정삭제버튼 관리자만 보이게 수정*/}
                <Button className="btn-secondary" onClick={handleEditButton}>
                  수정
                </Button>
                <Button className="btn-danger" onClick={handleDeleteButton}>
                  삭제
                </Button>
              </div>
            </div>
          </div>
          <hr />
          {/* 상세 이미지 목록 */}
          <div style={{ marginTop: "35px" }}>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "15px" }}
            >
              {detailImages?.map((path, index) => (
                <img
                  key={index}
                  src={path}
                  alt={`상세 이미지 ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "600px",
                    objectFit: "cover",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                  }}
                />
              ))}
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
          </div>
        </Col>
      </Row>

      {/*장바구니 버튼 모달*/}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body
          className="text-center d-flex justify-content-center align-items-center"
          style={{
            height: "130px",
            fontSize: "14px",
            padding: "0",
          }}
        >
          <p style={{ marginBottom: "0", fontSize: "16px" }}>
            선택하신 상품을 장바구니에 담았습니다
          </p>
        </Modal.Body>
        <div
          style={{
            display: "flex",
            borderTop: "1px solid #ddd",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setShowModal(false)}
            style={{
              flex: 1,
              padding: "12px 0",
              border: "none",
              background: "white",
              fontWeight: "bold",
              borderRight: "1px solid #ddd",
            }}
          >
            계속쇼핑
          </button>
          <button
            onClick={() => navigate("/product/cart")}
            style={{
              flex: 1,
              padding: "12px 0",
              border: "none",
              background: "white",
              fontWeight: "bold",
            }}
          >
            장바구니
          </button>
        </div>
      </Modal>
    </Container>
  );
}
