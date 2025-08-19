import React, { useContext } from "react";
import { Link, useLocation } from "react-router";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { MdSupportAgent } from "react-icons/md";
import { useCart } from "../../Product/CartContext.jsx";
import { NavUserMenu } from "./NavUserMenu.jsx";
import { AuthenticationContext } from "../AuthenticationContextProvider.jsx";
import { HiOutlineBellAlert } from "react-icons/hi2";

function NavRight({ iconRef, onSearchToggle, alertidcator }) {
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useContext(AuthenticationContext);
  const location = useLocation();
  const isRootPath = location.pathname === "/";

  // 아이콘/버튼 공통 사이즈
  const iconBase =
    "w-10 h-10 rounded-full flex items-center justify-center text-2xl no-animation focus:outline-none focus-visible:outline-none";

  // 루트에서는 hover 배경만 제거, 그 외는 hover 배경 허용
  const iconHover = isRootPath ? "no-hover" : "hover:bg-gray-100";

  return (
    <div className="navbar-right">
      <div className="navbar-icons flex items-center gap-6">
        <button
          type="button"
          className={`${iconBase} ${iconHover} FiSearch`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onSearchToggle()}
        >
          <FiSearch
            ref={iconRef}
            className={`navbar-icon ${isRootPath ? "icon-white" : ""}`}
          />
        </button>

        <NavUserMenu
          className={`navbar-icon ${isRootPath ? "icon-white" : ""}`}
          user={user}
          logout={logout}
          isAdmin={isAdmin}
        />

        <Link
          to="/product/cart"
          className={`${iconBase} ${iconHover} relative`}
        >
          <FiShoppingCart
            className={`navbar-icon ${isRootPath ? "icon-white" : ""}`}
          />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        <Link
          to="/faq/list"
          className={`${iconBase} ${iconHover} support-agent`}
        >
          <MdSupportAgent
            className={`navbar-icon ${isRootPath ? "icon-white" : ""}`}
          />
        </Link>

        <div className="indicator">
          {alertidcator !== 0 && (
            <span className="indicator-item badge badge-secondary text-[0.5rem] py-[0px] px-[6px]">
              {alertidcator}
            </span>
          )}
          {user && (
            <Link to="/alert/list" className={`${iconBase} ${iconHover}`}>
              <HiOutlineBellAlert
                className={`navbar-icon ${isRootPath ? "icon-white" : ""}`}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavRight;
