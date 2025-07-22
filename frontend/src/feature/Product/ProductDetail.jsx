import { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import "./ProductDetail.css";

export function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  useEffect(() => {
    axios
      .get(`/api/product/view?id=${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {});
  }, [id]);
  if (!product) {
    return <Spinner />;
  }
  return (
    <div className="product-detail">
      <div className="product-images">
        {product.imagePath?.map((path, index) => (
          <img
            key={index}
            src={`http://localhost:8080/static/${path.split("/").pop()}`}
            alt={`product-${index}`}
            style={{
              maxWidth: "300px",
              marginBottom: "10px",
              display: "block",
            }}
          />
        ))}
      </div>

      <h2>제품명 : {product.productName}</h2>
      <p>가격 : {product.price.toLocaleString()}원</p>
      <p>상세설명 : {product.info}</p>
      {/* todo: 관리자일 경우만 노출 */}
      <p>재고 : {product.quantity}개</p>
    </div>
  );
}
