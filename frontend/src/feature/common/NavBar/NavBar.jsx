import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthenticationContext } from "../AuthenticationContextProvider.jsx";
import {
  FiChevronLeft,
  FiMenu,
  FiSearch,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import "./Navbar.css";
import { useCart } from "../../Product/CartContext.jsx";
import NavLeft from "./NavLeft.jsx";
import NavRight from "./NavRight.jsx";
import Search from "./SearchBar.jsx";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import SearchBar from "./SearchBar.jsx";


function NavBar(props) {
  const [showMobileCategory, setShowMobileCategory] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isAdmin } = useContext(AuthenticationContext);
  const [showSearch, setShowSearch] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const iconRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");

  // 검색창 아이콘 한번더 누르거나 바깥영역누르면 검색창닫히도록
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        iconRef.current &&
        !iconRef.current.contains(e.target)
      ) {
        setShowSearch(false);
      }
    }

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  useEffect(() => {
    function handleClickOutside(e) {
      const isMenuClick = menuRef.current && menuRef.current.contains(e.target);
      const isHamburgerClick = e.target.closest(".hamburger-icon");

      if (!isMenuClick && !isHamburgerClick) {
        setIsMobileMenuOpen(false);
        setShowMobileCategory(false);
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleCategoryClick = (category) => {
    const params = new URLSearchParams(location.search);
    params.set("category", category);
    if (!params.get("sort")) {
      params.set("sort", "recent"); // 기본 정렬값
    }
    navigate(`/product/list?${params.toString()}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar-container">
        <div className="navbar-inner">
          {/* 모바일 메뉴 아이콘 */}
          <FiMenu
            className="hamburger-icon"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          />
          <div className="navbar-center">
            <Link to="/" className="navbar-logo">
              코데헌
            </Link>
          </div>
          {/*왼쪽 메뉴*/}
          <NavLeft handleCategoryClick={handleCategoryClick} />
          {/* 오른쪽 아이콘 */}
          <NavRight
            user={user}
            iconRef={iconRef}
            onSearchToggle={() => setShowSearch((prev) => !prev)}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            keyword={keyword}
            setKeyword={setKeyword}
            searchRef={searchRef}
            navigate={navigate}
          />
        </div>
        {showSearch && (
          <SearchBar
            setShowSearch={setShowSearch}
            keyword={keyword}
            setKeyword={setKeyword}
            searchRef={searchRef}
            navigate={navigate}
          />
        )}
      </nav>
      {/* 모바일 메뉴 드롭다운 */}
      {isMobileMenuOpen && (
        <div className="mobile-menu" ref={menuRef}>
          <div>
            <div
              className="btn btn-sm btn-ghost text-left cursor-pointer text-xl"
              onClick={() => setShowMobileCategory((prev) => !prev)}
            >
              모든상품 ▾
            </div>
            {showMobileCategory && (
              <div className="mobile-category-list">
                <button
                  className="text-lg btn btn-sm btn-ghost text-left cursor-pointer"
                  onClick={() => handleCategoryClick("")}
                >
                  전체
                </button>
                <button
                  className="text-lg btn btn-sm btn-ghost text-left cursor-pointer"
                  onClick={() => handleCategoryClick("outer")}
                >
                  겉옷
                </button>
                <button
                  className="text-lg btn btn-sm btn-ghost text-left cursor-pointer"
                  onClick={() => handleCategoryClick("top")}
                >
                  상의
                </button>
                <button
                  className="text-lg btn btn-sm btn-ghost text-left cursor-pointer"
                  onClick={() => handleCategoryClick("bottom")}
                >
                  하의
                </button>
                <button
                  className="text-lg btn btn-sm btn-ghost text-left cursor-pointer"
                  onClick={() => handleCategoryClick("hat")}
                >
                  모자
                </button>
              </div>
            )}
          </div>
          <Link
            to="/product/regist"
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn btn-ghost w-full justify-start text-left text-xl"
          >
            상품등록
          </Link>
          {user !== null && isAdmin && (
            <Link
              to="/member/list"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn btn-ghost w-full justify-start text-left text-xl"
            >
              회원목록
            </Link>
          )}
          {user === null && (
            <Link
              to="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn btn-ghost w-full justify-start text-left text-xl"
            >
              회원가입
            </Link>
          )}
          {user !== null && (
            <Link
              to="/logout"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn btn-ghost w-full justify-start text-left text-xl"
            >
              로그아웃
            </Link>
          )}
          {user !== null && (
            <Link
              to={`/member?id=${user.id}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn btn-ghost w-full justify-start text-left text-xl"
            >
              {user.name}
            </Link>
          )}
          {user !== null && (
            <Link
              to="/qna/list"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn btn-ghost w-full justify-start text-left text-xl"
            >
              문의 내역
            </Link>
          )}
          <Link
            to="/chat/chatting"
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn btn-ghost w-full justify-start text-left text-xl"
          >
            채팅 프로토콜
          </Link>
          <Link
            to="/pay/Checkout"
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn btn-ghost w-full justify-start text-left text-xl"
          >
            토스 페이먼츠
          </Link>
        </div>
      )}
    </>
  );
}

export default NavBar;
