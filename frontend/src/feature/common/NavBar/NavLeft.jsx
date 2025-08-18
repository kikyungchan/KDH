import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";

function NavLeft({ user, isAdmin, handleCategoryClick }) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isRootPath = location.pathname === "/";

  // 텍스트 버튼 공통 크기
  const textBtnBase =
    "h-10 px-3 rounded-lg flex items-center no-animation focus:outline-none focus-visible:outline-none";
  const textHover = isRootPath ? "no-hover" : "hover:bg-gray-100";

  return (
    <div className="navbar-left flex items-center gap-2">
      <NavLink
        to="/Home"
        onMouseDown={(e) => e.preventDefault()}
        onClick={(e) => e.currentTarget.blur()}
        className={`text-xl font-bold ${textBtnBase} ${textHover}`}
      >
        홈
      </NavLink>

      <div
        className={`dropdown ${dropdownOpen && !isRootPath ? "dropdown-open" : ""}`}
        onMouseEnter={() => setDropdownOpen(true)}
        onMouseLeave={() => setDropdownOpen(false)}
      >
        <NavLink
          to="/product/list"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => {
            handleCategoryClick("");
            setDropdownOpen(false);
          }}
          className={`font-bold text-xl ${textBtnBase} ${textHover}`}
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
          className={`text-xl font-bold ${textBtnBase} ${textHover}`}
        >
          상품등록
        </Link>
      )}
    </div>
  );
}

export default NavLeft;
