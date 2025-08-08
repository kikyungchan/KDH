import React, { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../../Product/CartContext.jsx";
import { NavUserMenu } from "../NavUserMenu.jsx";
import { AuthenticationContext } from "../AuthenticationContextProvider.jsx";

NavUserMenu.propTypes = {};

function NavRight({ iconRef, onSearchToggle }) {
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
      </div>
    </div>
  );
}

export default NavRight;
