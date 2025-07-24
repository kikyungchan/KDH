import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Col, Row, Spinner } from "react-bootstrap";
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

  return (
    <Row className="justify-content-center">
      <Col>
        <div className="product-detail">
          <div
            style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}
          >
            {/* 썸네일 이미지 */}
            {thumbnail && (
              <img
                style={{
                  width: "150",
                  height: "150",
                }}
                className="product-thumbnail"
                src={thumbnail}
                alt="썸네일 이미지"
              />
            )}
            <div style={{ flex: 1 }}>
              <h2>제품명 : {product.productName}</h2>
              <p>가격 : {product.price.toLocaleString()}원</p>
              <p>재고 : {product.quantity}개</p>
              <p>상세설명 : {product.info}</p>

              <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                <Button>구매하기</Button>
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
          <div style={{ marginTop: "20px" }}>
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
        </div>
      </Col>
    </Row>
  );
}
