import React, { useContext } from "react";
import { Link } from "react-router";
import { AuthenticationContext } from "./AuthenticationContextProvider.jsx";

function NavBar(props) {
  const { user } = useContext(AuthenticationContext);

  return (
    <nav>
      <Link to="/">메인</Link>
      <Link to="/product/list">상품목록</Link>
      <Link to="/product/regist">상품등록</Link>
      <Link to="/member/list">회원목록</Link>
      <Link to="/signup">회원가입</Link>
      <Link to="/login">로그인</Link>
      <Link to="/logout">로그아웃</Link>
      {user !== null && <Link to={`/member?id=${user.id}`}>{user.name}</Link>}
    </nav>
  );
}

export default NavBar;
