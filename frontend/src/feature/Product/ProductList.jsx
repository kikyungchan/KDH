import { Link, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import "./css/ProductList.css";

export function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page")) || 1;
  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [sort, setSort] = useState("recent");
  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  // 로딩시
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `/api/product/list?page=${pageParam}${keyword ? `&keyword=${keyword}` : ""}${category ? `&category=${category}` : ""}${sort ? `&sort=${sort}` : ""}`,
      )
      .then((res) => {
        setProducts(res.data.productList);
        setPageInfo(res.data.pageInfo);
      })
      .catch((err) => {
        console.log(err.message);
      })
      .finally(() => setLoading(false));
  }, [pageParam, keyword, sort, category]);

  const handlePageClick = (page) => {
    const newParams = {};
    if (keyword) newParams.keyword = keyword;
    if (sort) newParams.sort = sort;
    newParams.page = page;
    setSearchParams(newParams);
  };

  function isNewProduct(insertedAt) {
    if (!insertedAt) return false;
    const createdDate = new Date(insertedAt);
    const now = new Date();
    const diffInSeconds = (now.getTime() - createdDate.getTime()) / 1000;
    const secondsIn7Days = 60 * 60 * 24 * 7;
    return diffInSeconds <= secondsIn7Days;
  }

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSort(newSort);
    const newParams = {};
    if (keyword) newParams.keyword = keyword;
    if (category) newParams.category = category;
    newParams.page = 1;
    newParams.sort = newSort;
    setSearchParams(newParams);
  };

  return (
    <div id="product-list-container" className="w-full pt-3 px-[225px]">
      <div className="flex justify-between items-center mt-3 sort-wrapper-pc">
        <h2 className="text-xl" style={{ fontSize: "2rem" }}>
          상품 목록
        </h2>
        <select
          className="select select-sm w-52"
          value={sort}
          onChange={handleSortChange}
        >
          <option value="recent">기본순</option>
          <option value="popular">인기순</option>
          <option value="price_asc">가격 낮은순</option>
          <option value="price_desc">가격 높은순</option>
        </select>
      </div>

      {/* 하단 (모바일용) */}
      <div className="mt-4 sort-wrapper-mobile product-list-header ">
        <h2 className="text-xl mobile-title">상품 목록</h2>
        <select
          className="select select-sm w-52"
          value={sort}
          onChange={handleSortChange}
        >
          <option value="recent">기본순</option>
          <option value="popular">인기순</option>
          <option value="price_asc">가격 낮은순</option>
          <option value="price_desc">가격 높은순</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center my-12 text-gray-500">
          <span className="loading loading-spinner loading-sm mr-2" />
          페이지 로딩 중...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center mt-10">검색 결과가 없습니다.</div>
      ) : (
        <div className="product-grid mb-10">
          {products.map((product) => (
            <Link
              to={`/product/view?id=${product.id}`}
              className="product-card"
              key={product.id}
            >
              {product.thumbnailPaths?.length > 0 && (
                <div className="product-image-wrapper mb-2">
                  <img
                    src={product.thumbnailPaths[0].storedPath}
                    alt={product.productName}
                    className="product-image"
                  />
                </div>
              )}
              <div className="product-info-wrapper">
                <div className="product-name">{product.productName}</div>
                <div className="product-price">
                  {product.price.toLocaleString()}원
                </div>
                <div className="product-badges">
                  {isNewProduct(product.insertedAt) && (
                    <span className="new-badge">NEW</span>
                  )}
                  {product.hot && <div className="badge hot-badge">HOT</div>}
                  {product.quantity === 0 && (
                    <span className="sold-out-badge">SOLD OUT</span>
                  )}
                  {product.quantity > 0 && product.quantity < 5 && (
                    <span className="low-stock-badge">
                      🔥 {product.quantity}개 남음
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="pagination flex justify-center items-center gap-2">
        <button
          onClick={() => handlePageClick(pageInfo.leftPageNumber - 1)}
          disabled={pageInfo.leftPageNumber < 6}
          className="page-nav-button"
        >
          이전
        </button>

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
                className={`btn btn-sm ${page === pageInfo.currentPageNumber ? "btn-primary" : "btn-outline"}`}
              >
                {page}
              </button>
            );
          },
        )}

        <button
          onClick={() => handlePageClick(pageInfo.rightPageNumber + 1)}
          disabled={pageInfo.rightPageNumber > pageInfo.totalPages - 5}
          className="page-nav-button"
        >
          다음
        </button>
      </div>
    </div>
  );
}
