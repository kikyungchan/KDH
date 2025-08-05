import React from "react";
import { Link, useNavigate } from "react-router";
import { FiSearch, FiUser, FiShoppingCart } from "react-icons/fi";
import { useCart } from "../../Product/CartContext.jsx";
import SearchBar from "./SearchBar.jsx";

function NavRight({
  user,
  iconRef,
  showSearch,
  setShowSearch,
  keyword,
  setKeyword,
  searchRef,
}) {
  const { cartCount } = useCart();
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
          onClick={handleSearchClick}
          style={{ cursor: "pointer" }}
        />
        <SearchBar
          showSearch={showSearch}
          setShowSearch={setShowSearch}
          keyword={keyword}
          setKeyword={setKeyword}
          searchRef={searchRef}
          iconRef={iconRef}
          navigate={navigate}
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
