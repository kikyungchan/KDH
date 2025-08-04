import React from "react";
import { Link } from "react-router";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../Product/CartContext.jsx";

function NavRight({ user, iconRef, onSearchToggle }) {
  const { cartCount } = useCart();

  return (
    <div className="navbar-right">
      <div className="navbar-icons">
        <FiSearch
          ref={iconRef}
          className="navbar-icon"
          onClick={onSearchToggle}
          style={{ cursor: "pointer" }}
        />
        <Link to={user ? `/member?id=${user.id}` : "/login"}>
          <FiUser className="navbar-icon" />
        </Link>
        <Link to="/product/cart" className="cart-icon-wrapper">
          <FiShoppingCart className="navbar-icon" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </div>
    </div>
  );
}

export default NavRight;
