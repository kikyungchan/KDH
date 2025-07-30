import { Link, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { Col, Row } from "react-bootstrap";
import "./css/ProductList.css";
import axios from "axios";

export function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page")) || 1;
  const keyword = searchParams.get("keyword") || "";
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [sort, setSort] = useState("recent");

  useEffect(() => {
    axios
      .get(
        `/api/product/list?page=${pageParam}${keyword ? `&keyword=${keyword}` : ""}${sort ? `&sort=${sort}` : ""}`,
      )
      .then((res) => {
        setProducts(res.data.productList);
        setPageInfo(res.data.pageInfo);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, [pageParam, keyword, sort]);

  const handlePageClick = (page) => {
    const newParams = {};
    if (keyword) newParams.keyword = keyword;
    if (sort) newParams.sort = sort;
    newParams.page = page;
    setSearchParams(newParams);
  };

  // 새상품 뱃지
  function isNewProduct(insertedAt) {
    if (!insertedAt) return false;

    const createdDate = new Date(insertedAt);
    const now = new Date();

    const diffInSeconds = (now.getTime() - createdDate.getTime()) / 1000;
    const secondsIn7Days = 60 * 60 * 24 * 7; // 일주일

    return diffInSeconds <= secondsIn7Days;
  }

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSort(newSort);
    const newParams = {};
    if (keyword) newParams.keyword = keyword;
    newParams.page = 1;
    newParams.sort = newSort;
    setSearchParams(newParams);
  };

  return (
    <Row className="justify-content-center">
      <Col>
        <div className="product-list-container mb-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>상품 목록</h2>
            <Form.Select
              size="sm"
              style={{ maxWidth: "200px", marginBottom: "16px" }}
              value={sort}
              onChange={handleSortChange}
            >
              <option value="recent">기본순</option>
              <option value="price_asc">가격 낮은순</option>
              <option value="price_desc">가격 높은순</option>
              <option value="category">카테고리순</option>
            </Form.Select>
          </div>
          {products.length === 0 ? (
            <div className="text-center mt-5">검색 결과가 없습니다.</div>
          ) : (
            <div className="product-grid mb-4">
              {products.map((product) => {
                return (
                  // 상품목록리스트
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

                    {/* 상품명 + 가격 + SOLD OUT/NEW 배지 */}
                    <div className="product-info-wrapper">
                      <div className="product-name">{product.productName}</div>
                      <div className="product-price">
                        {product.price.toLocaleString()}원
                      </div>
                      <div className="product-badges">
                        {isNewProduct(product.insertedAt) && (
                          <span className="new-badge">NEW</span>
                        )}
                        {product.quantity === 0 && (
                          <span className="sold-out-badge">SOLD OUT</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
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
