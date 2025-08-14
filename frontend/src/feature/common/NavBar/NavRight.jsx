import React, { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { MdSupportAgent } from "react-icons/md";
import { useCart } from "../../Product/CartContext.jsx";
import { NavUserMenu } from "./NavUserMenu.jsx";
import { AuthenticationContext } from "../AuthenticationContextProvider.jsx";
import { HiOutlineBellAlert } from "react-icons/hi2";

NavUserMenu.propTypes = {};

function NavRight({ iconRef, onSearchToggle, alertidcator }) {
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useContext(AuthenticationContext);

  return (
    <div className="navbar-right">
      <div className="navbar-icons">
        <div className="FiSearch btn btn-ghost btn-circle text-2xl">
          <FiSearch
            ref={iconRef}
            className="navbar-icon"
            onClick={() => onSearchToggle()}
          />
        </div>
        <NavUserMenu user={user} logout={logout} isAdmin={isAdmin} />
        <Link
          to="/product/cart"
          className="cart-icon-wrapper btn btn-ghost btn-circle text-2xl
         "
        >
          <FiShoppingCart className="navbar-icon" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        <Link to={"/faq/list"} className="btn btn-ghost btn-circle text-2xl">
          <MdSupportAgent />
        </Link>
        <div className="indicator">
          {alertidcator != 0 && (
            <span className="indicator-item badge badge-secondary text-[0.5rem] py-[0px] px-[6px]">
              {alertidcator}
            </span>
          )}
          {user && (
            <Link
              to={"/alert/list"}
              className="btn btn-ghost btn-circle text-2xl"
            >
              <HiOutlineBellAlert />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default NavRight;
