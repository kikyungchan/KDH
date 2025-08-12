import React from "react";
import { FiChevronLeft, FiSearch } from "react-icons/fi";

function SearchOverlay({
  open,
  onClose,
  keyword,
  setKeyword,
  onSubmit,
  onSelectCategory,
  categories = [],
}) {
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
      </div>
    </div>
  );
}

export default SearchOverlay;
