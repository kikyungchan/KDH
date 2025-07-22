import { useEffect, useState } from "react";
import axios from "axios";

export function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("/api/product/list")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => {});
  }, []);

  return (
    <div>
      <h2>상품목록</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <strong>{product.productName}</strong>- {product.price}원
          </li>
        ))}
      </ul>
    </div>
  );
}
