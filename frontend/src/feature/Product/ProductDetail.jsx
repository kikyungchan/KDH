import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
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

  const thumbnail = product.imagePath?.[0];
  const detailImages = product.imagePath?.slice(1);

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

  function handleEditButton() {}

  return (
    <div className="product-detail">
      {/* 썸네일 이미지 */}
      {thumbnail && (
        <img
          className="product-thumbnail"
          src={`http://localhost:8080/static/${thumbnail.split("/").pop()}`}
          alt="썸네일 이미지"
        />
      )}

      <h2>제품명 : {product.productName}</h2>
      <p>가격 : {product.price.toLocaleString()}원</p>
      <p>상세설명 : {product.info}</p>
      <p>재고 : {product.quantity}개</p>
      {/*수정 삭제버튼은 관리자계정만 보이게*/}

      <button onClick={handleEditButton}>수정</button>
      <button className="btn-delete" onClick={handleDeleteButton}>
        삭제
      </button>

      {/* 상세 이미지 목록 */}
      <div className="product-images">
        {detailImages?.map((path, index) => (
          <img
            key={index}
            src={`http://localhost:8080/static/${path.split("/").pop()}`}
            alt={`상세 이미지 ${index + 1}`}
            className="product-detail-image"
          />
        ))}
      </div>
    </div>
  );
}
