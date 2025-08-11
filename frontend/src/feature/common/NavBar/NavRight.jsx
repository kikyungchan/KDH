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
        <div className="FiSearch">
          <FiSearch
            ref={iconRef}
            className="navbar-icon "
            onClick={() => onSearchToggle()}
            style={{ cursor: "pointer" }}
          />
        </div>
        <NavUserMenu user={user} logout={logout} isAdmin={isAdmin} />
        <Link to="/product/cart" className="cart-icon-wrapper">
          <FiShoppingCart className="navbar-icon" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
        <Link to={"/faq/list"}>
          <MdSupportAgent />
        </Link>
        <div className="indicator">
          <span className="indicator-item badge badge-secondary text-[0.5rem] py-[0px] px-[6px]">
            {alertidcator}
          </span>
          <Link to={"/alert/list"}>
            <HiOutlineBellAlert />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NavRight;
