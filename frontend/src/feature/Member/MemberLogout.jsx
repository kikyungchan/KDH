import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthenticationContext } from "../common/AuthenticationContextProvider.jsx";
import { useCart } from "../Product/CartContext.jsx";
import { useAlert } from "../common/AlertContext.jsx";
import { toast } from "sonner";

export function MemberLogout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthenticationContext);
  const { setCartCount } = useCart();
  const { showAlert } = useAlert();
  useEffect(() => {
    logout();

    // 비회원 기준으로 장바구니 새로고침.
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    setCartCount(guestCart.length);

    toast("로그아웃 되었습니다.", { type: "success" });
    navigate("/");
  }, []);
  return (
    <div className="flex justify-center items-center h-screen">
      <span className="loading loading-spinner loading-lg text-neutral"></span>
    </div>
  );
}
