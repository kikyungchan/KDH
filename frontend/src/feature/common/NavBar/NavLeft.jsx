import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";

function NavLeft({ user, isAdmin, handleCategoryClick }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isRootPath = location.pathname === "/";

  return (
    <div className="navbar-left flex items-center gap-2">
      {/* 홈 */}
      <NavLink
        to="/Home"
        onMouseDown={(e) => e.preventDefault()} //  클릭 시 포커스 방지
        onClick={(e) => e.currentTarget.blur()}
        className={`text-xl px-4 py-2 font-bold no-animation focus:outline-none focus-visible:outline-none ${
          isRootPath ? "" : "btn btn-ghost hover:bg-gray-100"
        }`}
      >
        홈
      </NavLink>

      {/* 모든상품 드롭다운 */}
      <div
        className={`dropdown ${dropdownOpen && !isRootPath ? "dropdown-open" : ""}`}
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        <NavLink
          to="/product/list"
          onMouseDown={(e) => e.preventDefault()} //  클릭 시 포커스 방지
          onClick={() => {
            handleCategoryClick("");
            setDropdownOpen(false);
          }}
          className={`text-xl px-4 py-2 no-animation focus:outline-none focus-visible:outline-none ${
            isRootPath ? "" : "btn btn-ghost hover:bg-gray-100"
          }`}
        >
          모든상품
        </NavLink>

        <ul
          tabIndex={0}
          className="menu dropdown-content z-[1000] p-2 shadow bg-base-100 rounded-box w-52"
          onClick={() => setDropdownOpen(false)}
        >
          <li>
            <button
              className="no-animation focus:outline-none focus-visible:outline-none"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => navigate("/product/list")}
            >
              전체
            </button>
          </li>
          <li>
            <button
              className="no-animation focus:outline-none focus-visible:outline-none"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCategoryClick("outer")}
            >
              겉옷
            </button>
          </li>
          <li>
            <button
              className="no-animation focus:outline-none focus-visible:outline-none"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCategoryClick("top")}
            >
              상의
            </button>
          </li>
          <li>
            <button
              className="no-animation focus:outline-none focus-visible:outline-none"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCategoryClick("bottom")}
            >
              하의
            </button>
          </li>
          <li>
            <button
              className="no-animation focus:outline-none focus-visible:outline-none"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCategoryClick("hat")}
            >
              모자
            </button>
          </li>
          <li>
            <button
              className="no-animation focus:outline-none focus-visible:outline-none"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCategoryClick("bag")}
            >
              가방
            </button>
          </li>
          <li>
            <button
              className="no-animation focus:outline-none focus-visible:outline-none"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCategoryClick("shoes")}
            >
              신발
            </button>
          </li>
          <li>
            <button
              className="no-animation focus:outline-none focus-visible:outline-none"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCategoryClick("socks")}
            >
              양말
            </button>
          </li>
          <li>
            <button
              className="no-animation focus:outline-none focus-visible:outline-none"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCategoryClick("belt")}
            >
              벨트
            </button>
          </li>
        </ul>
      </div>

      {user !== null && isAdmin && (
        <Link
          to="/product/regist"
          onMouseDown={(e) => e.preventDefault()}
          className="btn btn-ghost text-xl no-animation focus:outline-none focus-visible:outline-none"
        >
          상품등록
        </Link>
      )}
    </div>
  );
}

export default NavLeft;
