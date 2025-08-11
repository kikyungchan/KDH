import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { AuthenticationContext } from "../AuthenticationContextProvider.jsx";
import {
  FiChevronLeft,
  FiMenu,
  FiSearch,
  FiShoppingCart,
  FiUser,
} from "react-icons/fi";
import "./Navbar.css";
import { useCart } from "../../Product/CartContext.jsx";
import NavLeft from "./NavLeft.jsx";
import NavRight from "./NavRight.jsx";
import Search from "./SearchBar.jsx";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import SearchBar from "./SearchBar.jsx";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function NavBar(props) {
  const [showMobileCategory, setShowMobileCategory] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const { user, isAdmin } = useContext(AuthenticationContext);
  const [showSearch, setShowSearch] = useState(false);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const iconRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState("");

  const clientRef = useRef(null); // STOMP 인스턴스 담아 둘 상자
  const [target, setTarget] = useState(""); //수신자 id
  const [text, setText] = useState(""); // 보낼 텍스트

  const WS_PATH = "/ws-chat";

  // 검색창 아이콘 한번더 누르거나 바깥영역누르면 검색창닫히도록
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        iconRef.current &&
        !iconRef.current.contains(e.target)
      ) {
        setShowSearch(false);
      }
    }

    if (showSearch) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearch]);

  useEffect(() => {
    function handleClickOutside(e) {
      const isMenuClick = menuRef.current && menuRef.current.contains(e.target);
      const isHamburgerClick = e.target.closest(".hamburger-icon");

      if (!isMenuClick && !isHamburgerClick) {
        setIsMobileMenuOpen(false);
        setShowMobileCategory(false);
      }
    }

    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const handleCategoryClick = (category) => {
    const params = new URLSearchParams(location.search);
    params.set("category", category);
    if (!params.get("sort")) {
      params.set("sort", "recent"); // 기본 정렬값
    }
    navigate(`/product/list?${params.toString()}`);
    setShowMobileCategory(false);
    setIsMobileMenuOpen(false);
  };

  // 모바일 메뉴 내 검색 기능 처리 함수
  const handleMobileSearch = () => {
    if (keyword.trim() !== "") {
      navigate(`/product/list?keyword=${keyword.trim()}`);
      setKeyword("");
      setIsMobileMenuOpen(false); // 검색 후 메뉴 닫기
    }
  };

  useEffect(() => {
    if (!user?.name) return;

    console.log(user);
    const client = new Client({
      // webSocketFactory: () => new SockJS(WS_PATH), // SockJS 연결
      webSocketFactory: () => {
        const token = localStorage.getItem("token");
        console.log("token : ", token);
        console.log("WS_PATH : ", WS_PATH);
        const url = token
          ? `${WS_PATH}?Authorization=Bearer%20${token}`
          : WS_PATH;
        return new SockJS(url);
      },
      debug: (str) => console.log("[STOMP]", str),
      reconnectDelay: 5000, // 끊기면 5초후 재연결
      connectHeaders: {
        username: user.name,
      },
    });

    client.onConnect = (frame) => {
      console.log("연결됨!", frame);
      client.subscribe("/user/queue/alert", (message) => {
        // 서버의 json 메시지를 파싱해서 msgs 배열에 추가
        // setMsgs((prev) => [...prev, JSON.parse(message.body)]);
        console.log(JSON.parse(message.body));
      });
    };
    // 연결 활성화(connect 시도)
    client.activate();
    // 훅 박에서도 쓰기 위해 ref에 저장
    clientRef.current = client;

    return () => {
      if (client.connected) {
        client.disconnect();
      }
    };
  }, [user && user.name]);

  const sendMessage = () => {
    // 보낼 메시지 객체
    const chatMsg = { from: user.name, to: "admin1", message: "test" };
    // SEND_DEST로 파일 전송

    clientRef.current.publish({
      destination: "/app/chat/alert",
      body: JSON.stringify(chatMsg),
    });
    setText(""); // 입력창 초기화
  };

  return (
    <>
      <nav className="navbar-container">
        <div className="navbar-inner">
          <button className="btn btn-primary" onClick={sendMessage}>
            전송
          </button>
          {/* 모바일 메뉴 아이콘 */}
          <FiMenu
            className="hamburger-icon"
            onClick={() =>
              setIsMobileMenuOpen((prev) => {
                const next = !prev;
                if (!next) setShowMobileCategory(false); // 닫힐 때 서브 드롭다운도 접기
                return next; // <-- 항상 반환
              })
            }
          />
          <div className="navbar-center">
            <Link to="/Home" className="navbar-logo">
              {/*코데헌*/}
              <img
                src="../../../../public/logo/kdh.png"
                style={{ width: "80px" }}
              />
            </Link>
          </div>
          {/*왼쪽 메뉴*/}
          <NavLeft
            user={user}
            isAdmin={isAdmin}
            handleCategoryClick={handleCategoryClick}
          />
          {/* 오른쪽 아이콘 */}
          <NavRight
            // user={user}
            iconRef={iconRef}
            onSearchToggle={() => setShowSearch((prev) => !prev)}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            keyword={keyword}
            setKeyword={setKeyword}
            searchRef={searchRef}
            navigate={navigate}
          />
        </div>
        {showSearch && (
          <SearchBar
            setShowSearch={setShowSearch}
            keyword={keyword}
            setKeyword={setKeyword}
            searchRef={searchRef}
            navigate={navigate}
          />
        )}
      </nav>
      {/* 모바일 메뉴 드롭다운 */}
      {isMobileMenuOpen && (
        <div className="mobile-menu" ref={menuRef}>
          <div className="mobile-search-form">
            <input
              type="text"
              placeholder="키워드로 검색"
              className="mobile-search-input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleMobileSearch();
              }}
            />
            <FiSearch
              className="mobile-search-icon"
              onClick={handleMobileSearch}
            />
          </div>
          {user !== null && (
            <Link
              to={`/member?id=${user.id}`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn btn-ghost w-full justify-start text-left text-xl"
            >
              {user.name}
            </Link>
          )}
          <div>
            <div
              className="btn btn-sm btn-ghost text-left cursor-pointer text-xl"
              onClick={() => setShowMobileCategory((prev) => !prev)}
            >
              모든상품 ▾
            </div>
            {showMobileCategory && (
              <div className="mobile-category-list">
                <button
                  className="text-lg btn btn-sm btn-ghost text-left cursor-pointer"
                  onClick={() => handleCategoryClick("")}
                >
                  전체
                </button>
                <button
                  className="text-lg btn btn-sm btn-ghost text-left cursor-pointer"
                  onClick={() => handleCategoryClick("outer")}
                >
                  겉옷
                </button>
                <button
                  className="text-lg btn btn-sm btn-ghost text-left cursor-pointer"
                  onClick={() => handleCategoryClick("top")}
                >
                  상의
                </button>
                <button
                  className="text-lg btn btn-sm btn-ghost text-left cursor-pointer"
                  onClick={() => handleCategoryClick("bottom")}
                >
                  하의
                </button>
                <button
                  className="text-lg btn btn-sm btn-ghost text-left cursor-pointer"
                  onClick={() => handleCategoryClick("hat")}
                >
                  모자
                </button>
                <button
                  className="text-lg btn btn-sm btn-ghost text-left cursor-pointer"
                  onClick={() => handleCategoryClick("bag")}
                >
                  가방
                </button>
                <button
                  className="text-lg btn btn-sm btn-ghost text-left cursor-pointer"
                  onClick={() => handleCategoryClick("shoes")}
                >
                  신발
                </button>
                <button
                  className="text-lg btn btn-sm btn-ghost text-left cursor-pointer"
                  onClick={() => handleCategoryClick("socks")}
                >
                  양말
                </button>
                <button
                  className="text-lg btn btn-sm btn-ghost text-left cursor-pointer"
                  onClick={() => handleCategoryClick("belt")}
                >
                  벨트
                </button>
              </div>
            )}
          </div>
          {/*<Link*/}
          {/*  to="/product/regist"*/}
          {/*  onClick={() => setIsMobileMenuOpen(false)}*/}
          {/*  className="btn btn-ghost w-full justify-start text-left text-xl"*/}
          {/*>*/}
          {/*  상품등록*/}
          {/*</Link>*/}
          {user !== null && isAdmin && (
            <Link
              to="/member/list"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn btn-ghost w-full justify-start text-left text-xl"
            >
              회원목록
            </Link>
          )}
          {user === null && (
            <Link
              to="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn btn-ghost w-full justify-start text-left text-xl"
            >
              회원가입
            </Link>
          )}
          {user !== null && (
            <Link
              to="/logout"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn btn-ghost w-full justify-start text-left text-xl"
            >
              로그아웃
            </Link>
          )}
          {user !== null && (
            <Link
              to="/qna/list"
              onClick={() => setIsMobileMenuOpen(false)}
              className="btn btn-ghost w-full justify-start text-left text-xl"
            >
              문의 내역
            </Link>
          )}
          <Link
            to="/chat/chatting"
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn btn-ghost w-full justify-start text-left text-xl"
          >
            채팅 프로토콜
          </Link>
          <Link
            to="/pay/Checkout"
            onClick={() => setIsMobileMenuOpen(false)}
            className="btn btn-ghost w-full justify-start text-left text-xl"
          >
            토스 페이먼츠
          </Link>
        </div>
      )}
    </>
  );
}

export default NavBar;
