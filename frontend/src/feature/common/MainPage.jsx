import NavBar from "./NavBar.jsx";
import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";

function MainPage() {
  const location = useLocation();

  useEffect(() => {
    // 주소 path 가 / (메인페이지) 일 때만 스크롤 막게수정
    if (location.pathname === "/") {
      console.log("path : ", location.pathname);
      // 메인 페이지에서만 body의 스크롤을 막기
      document.body.style.overflow = "hidden";
    }

    // 컴포넌트가 unmount될 때 스크롤을 원상태로 복원
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [location.pathname]);
  return (
    <>
      <NavBar />
      <div style={{ paddingTop: "80px" }}></div>
      <Outlet />
    </>
  );
}

export default MainPage;
