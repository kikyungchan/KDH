import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
// import { useNavigate, useSearchParams } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router";
import "./ProductDetail.css";

export function ProductDetail() {
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
    // if (!isLogged) {
    // alert("로그인이 필요합니다.");
    // navigate("/login");
    // }
    navigate("/product/order", {
      state: {
        productId: product.id,
        productName: product.productName,
        price: selectedOption ? selectedOption.price : product.price,
        quantity: quantity,
        imagePath: thumbnail,
        option: selectedOption?.optionName || null,
      },
    });
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
              <p>{product.info}귀여운 공룡이에요~</p>

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
                <button style={{ border: "3", width: "150px" }}>
                  장바구니
                </button>
                {/*수정/삭제버튼, 재고메뉴는 관리자계정만 보이게*/}
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
          </div>
        </Col>
      </Row>
    </Container>
  );
}
