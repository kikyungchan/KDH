import { useEffect, useState } from "react";
import axios from "axios";
import "./css/ProductList.css";
import { Link, useSearchParams } from "react-router";
import { Col, Row } from "react-bootstrap";

export function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page")) || 1;
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});

  useEffect(() => {
    axios
      .get(`/api/product/list?page=${pageParam}`)
      .then((res) => {
        setProducts(res.data.productList);
        setPageInfo(res.data.pageInfo);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [pageParam]);

  const handlePageClick = (page) => {
    setSearchParams({ page });
  };

  return (
    <Row className="justify-content-center">
      <Col>
        <div className="product-list-container mb-4">
          <h2>상품 목록</h2>
          <div className="product-grid mb-4">
            {products.map((product) => {
              console.log(product); // 확인용
              return (
                <Link
                  to={`/product/view?id=${product.id}`}
                  className="product-card"
                  key={product.id}
                >
                  {product.imagePath && (
                    <div className="product-image-wrapper mb-2">
                      <img
                        src={product.imagePath[0]}
                        alt={product.productName}
                        className="product-image"
                      />
                    </div>
                  )}

                  {/* 상품명 + 가격 + SOLD OUT */}
                  <div className="product-info-wrapper">
                    <div className="product-name">{product.productName}</div>
                    <div className="product-price">
                      {product.price.toLocaleString()}원
                    </div>
                    {product.quantity === 0 && (
                      <div className="sold-out-badge">SOLD OUT</div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* 페이지네이션 */}
          <div className="pagination d-flex justify-content-center align-items-center">
            {/* 이전 */}
            <button
              onClick={() => handlePageClick(pageInfo.leftPageNumber - 1)}
              disabled={pageInfo.leftPageNumber < 6}
              className="page-nav-button"
            >
              이전
            </button>

            {/* 페이지 번호 버튼들 */}
            {Array.from(
              {
                length: pageInfo.rightPageNumber - pageInfo.leftPageNumber + 1,
              },
              (_, i) => {
                const page = pageInfo.leftPageNumber + i;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={
                      page === pageInfo.currentPageNumber ? "active" : ""
                    }
                  >
                    {page}
                  </button>
                );
              },
            )}

            {/* 다음 */}
            <button
              onClick={() => handlePageClick(pageInfo.rightPageNumber + 1)}
              disabled={pageInfo.rightPageNumber > pageInfo.totalPages - 5}
              className="page-nav-button"
            >
              다음
            </button>
          </div>
        </div>
      </Col>
    </Row>
  );
}
