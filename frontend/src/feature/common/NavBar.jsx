import React from "react";
import { Link } from "react-router";

function NavBar(props) {
  return (
    <nav>
      <Link to="/">메인</Link>
      <Link to="/product/list">상품목록</Link>
      <Link to="/product/regist">상품등록</Link>
      <br />
      <Link to="/chat/chatting">채팅 프로토콜</Link>
    </nav>
  );
}

export default NavBar;
