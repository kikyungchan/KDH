import React from "react";
import { Link } from "react-router";

function NavBar(props) {
  return (
    <nav>
      <Link to="/">메인</Link>
      <Link to="/product/list">상품목록</Link>
      <Link to="/product/regist">상품등록</Link>
      <Link to="/member/list">회원목록</Link>
      <Link to="/signup">회원가입</Link>
      <Link to="/login">로그인</Link>
    </nav>
  );
}

export default NavBar;
