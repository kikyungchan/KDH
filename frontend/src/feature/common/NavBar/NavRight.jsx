import React, { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { MdSupportAgent } from "react-icons/md";
import { useCart } from "../../Product/CartContext.jsx";
import { NavUserMenu } from "./NavUserMenu.jsx";
import { AuthenticationContext } from "../AuthenticationContextProvider.jsx";
import { HiOutlineBellAlert } from "react-icons/hi2";

NavUserMenu.propTypes = {};

function NavRight({ iconRef, onSearchToggle, alertidcator }) {
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useContext(AuthenticationContext);
  const location = useLocation();
  const isRootPath = location.pathname === "/";

  // 루트일 때 hover 스타일 제거
  const baseBtnClass = isRootPath
    ? "px-2 py-1 text-2xl no-animation focus:outline-none focus-visible:outline-none"
    : "btn btn-ghost btn-circle text-2xl no-animation focus:outline-none focus-visible:outline-none";

  return (
    <div className="navbar-right">
      <div className="navbar-icons">
        <div className={baseBtnClass}>
          <FiSearch
            ref={iconRef}
            className="navbar-icon"
            onClick={() => onSearchToggle()}
          />
        </div>
        <NavUserMenu
          user={user}
          logout={logout}
          isAdmin={isAdmin}
          isRoothPath={isRootPath}
        />

        <Link to="/product/cart" className={baseBtnClass}>
          <FiShoppingCart className="navbar-icon" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>

        <Link to={"/faq/list"} className={baseBtnClass}>
          <MdSupportAgent />
        </Link>

        <div className="indicator">
          {alertidcator !== 0 && (
            <span className="indicator-item badge badge-secondary text-[0.5rem] py-[0px] px-[6px]">
              {alertidcator}
            </span>
          )}
          {user && (
            <Link to={"/alert/list"} className={baseBtnClass}>
              <HiOutlineBellAlert />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavRight;
