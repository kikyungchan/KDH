import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiSearch } from "react-icons/fi";
import axios from "axios";

function SearchOverlay({
  open,
  onClose,
  keyword,
  setKeyword,
  onSubmit,
  onSelectCategory,
  categories = [],
}) {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    if (open) {
      try {
        const data = JSON.parse(localStorage.getItem("recentProducts"));
        if (Array.isArray(data)) {
          // 존재하는 상품만 필터링
          Promise.all(
            data.map(async (p) => {
              try {
                const res = await axios.get(`/api/product/${p.id}`);
                return res.data ? p : null; // 상품이 있으면 유지
              } catch {
                return null; // 삭제된 상품은 제거
              }
            }),
          ).then((results) => {
            const validProducts = results.filter((p) => p !== null);
            setRecentProducts(validProducts);
            localStorage.setItem(
              "recentProducts",
              JSON.stringify(validProducts),
            );
          });
        } else {
          setRecentProducts([]);
        }
      } catch (err) {
        setRecentProducts([]);
      }
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="search-overlay" onClick={onClose}>
      <div className="search-sheet" onClick={(e) => e.stopPropagation()}>
        {/* 상단 입력줄 */}
        <div className="search-input-row">
          <FiChevronLeft className="search-close" onClick={onClose} />
          <input
            autoFocus
            type="text"
            placeholder="상품명을 검색해보세요"
            className="search-wide-input"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && keyword.trim() !== "") onSubmit();
            }}
          />
          <FiSearch
            className="search-go"
            onClick={() => keyword.trim() !== "" && onSubmit()}
          />
        </div>

        {/* 추천 카테고리 */}
        {categories.length > 0 && (
          <>
            <div className="suggest-title">추천 카테고리</div>
            <div className="suggest-scroll">
              {categories.map((c) => (
                <button
                  key={c.key}
                  className="category-chip"
                  onClick={() => onSelectCategory(c.key)}
                >
                  <span className="chip-thumb">
                    {c.image ? <img src={c.image} alt={c.label} /> : c.fallback}
                  </span>
                  <span className="chip-label">{c.label}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {/* 최근 본 상품 */}
        {recentProducts.length > 0 && (
          <>
            <div className="suggest-title">최근 본 상품</div>
            <div className="recent-products-scroll">
              {recentProducts.map((p) => (
                <a
                  key={p.id}
                  href={`/product/view?id=${p.id}`}
                  className="recent-product-card"
                  onClick={onClose}
                >
                  <img src={p.thumbnail} alt={p.productName} />
                  <span className="recent-name">{p.productName}</span>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SearchOverlay;
