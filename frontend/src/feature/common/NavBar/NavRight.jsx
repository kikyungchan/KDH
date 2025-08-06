import React, { useContext } from "react";
import { Link, useNavigate } from "react-router";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../../Product/CartContext.jsx";
import SearchBar from "./SearchBar.jsx";
import { NavUserMenu } from "../NavUserMenu.jsx";
import { AuthenticationContext } from "../AuthenticationContextProvider.jsx";

NavUserMenu.propTypes = {};

function NavRight({
  iconRef,
  showSearch,
  setShowSearch,
  keyword,
  setKeyword,
  onSearchToggle,
  searchRef,
}) {
  const { cartCount } = useCart();
  const { user, isAdmin, logout } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    if (keyword.trim() !== "") {
      navigate(`/product/list?keyword=${keyword.trim()}`);
      setKeyword("");
    }
  };

  return (
    <div className="navbar-right">
      <div className="navbar-icons">
        <FiSearch
          ref={iconRef}
          className="navbar-icon"
          onClick={() => onSearchToggle()}
          style={{ cursor: "pointer" }}
        />
        <NavUserMenu user={user} logout={logout} isAdmin={isAdmin} />
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
