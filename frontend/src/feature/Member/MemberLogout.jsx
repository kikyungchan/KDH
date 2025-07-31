import { Spinner } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthenticationContext } from "../common/AuthenticationContextProvider.jsx";
import { useCart } from "../Product/CartContext.jsx";

export function MemberLogout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthenticationContext);
  const { setCartCount } = useCart();
  useEffect(() => {
    logout();

    // 비회원 기준으로 장바구니 새로고침.
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    setCartCount(guestCart.length);
    console.log("로그아웃 되었습니다.");
    navigate("/");
  }, []);
  return <Spinner />;
}
