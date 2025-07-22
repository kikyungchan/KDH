import { useEffect, useState } from "react";
import axios from "axios";
import "./ProductList.css";
import { Link } from "react-router-dom";

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
      });
  }, []);

  return (
    <div className="product-list-container">
      <h2>상품 목록</h2>
      <div className="product-grid">
        {products.map((product) => (
          <Link
            to={`/product/view?id=${product.id}`}
            className="product-card"
            key={product.id}
          >
            {product.imagePath && (
              <img
                src={`http://localhost:8080/static/${product.imagePath?.[0].split("/").pop()}`}
                alt={product.productName}
                className="product-image"
              />
            )}
            <div className="product-name">{product.productName}</div>
            <div className="product-price">
              {product.price.toLocaleString()}원
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
