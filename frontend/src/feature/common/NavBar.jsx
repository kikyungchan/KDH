import React, { useContext } from "react";
import { Link } from "react-router";
import { AuthenticationContext } from "./AuthenticationContextProvider.jsx";

function NavBar(props) {
  const { user, isAdmin } = useContext(AuthenticationContext);

  return (
    <>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 20px",
          borderBottom: "1px solid #ccc",
        }}
      >
        <div>
          <Link to="/">메인</Link>
          <Link to="/product/list">상품목록</Link>{" "}
          <Link to="/product/regist">상품등록</Link>{" "}
          <Link to="/product/cart">장바구니</Link>
        </div>

        <div>
          {user?.roles?.includes("admin") && (
            <Link className="me-2" to="/member/list">
              회원목록
            </Link>
          )}
          {user === null && (
            <Link className="me-2" to="/signup">
              회원가입
            </Link>
          )}
          {user === null && (
            <Link className="me-2" to="/login">
              로그인
            </Link>
          )}
          {user !== null && (
            <Link className="me-2" to="/logout">
              로그아웃
            </Link>
          )}
          {user !== null && (
            <Link className="me-2" to={`/member?id=${user.id}`}>
              {`${user.name}님`}
            </Link>
          )}
        </div>
      </nav>
      <div style={{ marginTop: "10px", padding: "0 20px" }}>
        <Link to="/chat/chatting">채팅 프로토콜</Link>
      </div>
    </>
  );
}

export default NavBar;
