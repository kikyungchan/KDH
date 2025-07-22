import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

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
      썸네일이미지넣고.
      <h2>제품명 : {product.productName}</h2>
      <p>가격 : {product.price.toLocaleString()}원</p>
      <p>상세설명 : {product.info}</p>
      todo:재고는 admin 계정한테만 보이게.
      <p>재고 : {product.quantity}개</p>
    </div>
  );
}
