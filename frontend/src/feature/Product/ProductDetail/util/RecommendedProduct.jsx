import { Link } from "react-router";

export default function RecommendedProduct({ products }) {
  if (!products?.length) return null;

  return (
    <div className="related-product-section">
      <div className="related-product-grid">
        {products.map((item) => (
          <Link
            key={item.id}
            to={`/product/view?id=${item.id}`}
            className="related-product-card"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
          >
            <img
              src={item.thumbnailPaths?.[0]}
              alt={item.productName}
              className="related-product-image"
            />
            <div className="related-product-info">
              <p className="name">{item.productName}</p>
              <p className="price">{item.price.toLocaleString()}원</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
