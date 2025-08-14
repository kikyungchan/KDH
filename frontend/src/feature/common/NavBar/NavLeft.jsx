import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

function NavLeft({ user, isAdmin, handleCategoryClick }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isRootPath = location.pathname === "/";
  return (
    <div className="navbar-left flex items-center gap-2">
      <Link className="btn btn-ghost text-xl" to="/Home">
        홈
      </Link>
      <div
        className={`dropdown ${dropdownOpen && !isRootPath ? "dropdown-open" : ""}`}
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        <Link to="/product/list" onClick={() => handleCategoryClick("")}>
          <button
            tabIndex={0}
            className="btn btn-ghost text-xl whitespace-nowrap"
          >
            모든상품
          </button>
        </Link>

        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1000] p-2 shadow bg-base-100 rounded-box w-52"
        >
          <li>
            <button
              onClick={() => {
                navigate("/product/list");
              }}
            >
              전체
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                handleCategoryClick("outer");
              }}
            >
              겉옷
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                handleCategoryClick("top");
              }}
            >
              상의
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                handleCategoryClick("bottom");
              }}
            >
              하의
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                handleCategoryClick("hat");
              }}
            >
              모자
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                handleCategoryClick("bag");
              }}
            >
              가방
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                handleCategoryClick("shoes");
              }}
            >
              신발
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                handleCategoryClick("socks");
              }}
            >
              양말
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                handleCategoryClick("belt");
              }}
            >
              벨트
            </button>
          </li>
        </ul>
      </div>
      {user !== null && isAdmin && (
        <Link to="/product/regist" className="btn btn-ghost text-xl">
          상품등록
        </Link>
      )}
      {/*{user !== null && isAdmin && (*/}
      {/*  <Link to="/member/list" className="btn btn-ghost text-xl">*/}
      {/*    회원목록*/}
      {/*  </Link>*/}
      {/*)}*/}
      {user === null && (
        <Link to="/signup" className="btn btn-ghost text-xl">
          회원가입
        </Link>
      )}
      {user && (
        <>
          {/*<Link to="/logout" className="btn btn-ghost text-xl">
            로그아웃
          </Link>*/}
          {/*<Link to={`/member?id=${user.id}`} className="btn btn-ghost text-xl">*/}
          {/*  {user.name}*/}
          {/*</Link>*/}
          <Link to="/qna/list" className="btn btn-ghost text-xl">
            문의 내역
          </Link>
        </>
      )}
      {/*<Link to="/chat/chatting" className="btn btn-ghost text-xl">*/}
      {/*  채팅 프로토콜*/}
      {/*</Link>*/}
      {/*<Link to="/pay/Checkout" className="btn btn-ghost text-xl">*/}
      {/*  토스 페이먼츠*/}
      {/*</Link>*/}
    </div>
  );
}

export default NavLeft;
