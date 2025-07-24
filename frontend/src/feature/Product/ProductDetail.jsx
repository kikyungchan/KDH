import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
// import { useNavigate, useSearchParams } from "react-router-dom";
import { useNavigate, useSearchParams } from "react-router";
import "./ProductDetail.css";

export function ProductDetail() {
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
    // if (isLogged) {
    axios.post(`/api/product/order`, {
      productId: product.id,
      productName: product.productName,
      price: product.price,
      quantity: product.quantity,
      imagePath: thumbnail,
    });
    // }
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
              {/* 관리자 권한만 보이게*/}
              <p>재고 : {product.quantity}개</p>

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
