import React from "react";
import { FiChevronLeft } from "react-icons/fi";

function SearchBar({
  showSearch,
  setShowSearch,
  keyword,
  setKeyword,
  searchRef,
  iconRef,
  navigate,
}) {
  return (
    <div ref={searchRef} className="search-bar-popup active">
      <FiChevronLeft
        className="search-close-icon"
        onClick={() => setShowSearch(false)}
      />
      <input
        type="text"
        placeholder="키워드로 검색"
        className="search-input"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && keyword.trim() !== "") {
            navigate(`/product/list?keyword=${keyword.trim()}`);
            setKeyword("");
            setShowSearch(false);
          }
        }}
      />
    </div>
  );
}

export default SearchBar;
