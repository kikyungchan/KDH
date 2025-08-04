import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthenticationContext } from "./AuthenticationContextProvider.jsx";
import {
  FiChevronLeft,
  FiMenu,
  FiSearch,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import "./Navbar.css";
import { useCart } from "../Product/CartContext.jsx";

function NavBar(props) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isAdmin } = useContext(AuthenticationContext);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);
  const iconRef = useRef(null);
  const navigate = useNavigate();
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

  return (
    <>
      <nav className="navbar-container">
        {/* 왼쪽 메뉴 */}
        <Link to="/" className="navbar-logo">
          코데헌
        </Link>
        <div className="navbar-left">
          <Link to="/product/list">상품목록</Link>
          <Link to="/product/regist">상품등록</Link>
          {user !== null && isAdmin && <Link to="/member/list">회원목록</Link>}
          {user === null && <Link to="/signup">회원가입</Link>}
          {/*{user === null && <Link to="/login">로그인</Link>}*/}
          {user !== null && <Link to="/logout">로그아웃</Link>}
          {user !== null && (
            <Link to={`/member?id=${user.id}`}>{user.name}</Link>
          )}
          {user !== null && <Link to={"/qna/list"}>문의 내역</Link>}
          <Link to="/chat/chatting">채팅 프로토콜</Link>
          <Link to="/pay/Checkout">토스 페이먼츠</Link>
        </div>

        {/* 모바일 메뉴 아이콘 */}
        <FiMenu
          className="hamburger-icon"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        />

        {/* 오른쪽 아이콘 */}
        <div className="navbar-icons">
          <FiSearch
            ref={iconRef}
            className="navbar-icon"
            onClick={() => setShowSearch((prev) => !prev)}
            style={{ cursor: "pointer" }}
          />
          <Link to={user ? `/member?id=${user.id}` : "/login"}>
            <FiUser className="navbar-icon" />
          </Link>
          <Link to="/product/cart" className="cart-icon-wrapper">
            <FiShoppingCart className="navbar-icon" />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </nav>
      {/* 돋보기 눌렀을떄 나오는 검색창 */}
      <div
        ref={searchRef}
        className={`search-bar-wrapper ${showSearch ? "active" : ""}`}
      >
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
            if (e.key === "Enter") {
              if (keyword.trim() !== "") {
                navigate(`/product/list?keyword=${keyword.trim()}`);
                setKeyword("");
              }
            }
          }}
        />
      </div>
      {/* 모바일 메뉴 드롭다운 */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/product/list">상품목록</Link>
          <Link to="/product/regist">상품등록</Link>
          {user !== null && isAdmin && <Link to="/member/list">회원목록</Link>}
          {user === null && <Link to="/signup">회원가입</Link>}
          {user !== null && <Link to="/logout">로그아웃</Link>}
          {user !== null && (
            <Link to={`/member?id=${user.id}`}>{user.name}</Link>
          )}
          {user !== null && <Link to={"/qna/list"}>문의 내역</Link>}
          <Link to="/chat/chatting">채팅 프로토콜</Link>
          <Link to="/pay/Checkout">토스 페이먼츠</Link>
        </div>
      )}
    </>
  );
}

export default NavBar;
