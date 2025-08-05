import NavBar from "./NavBar.jsx";
import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";

function Main() {
  const location = useLocation();

  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto"; // 페이지 떠날 땐 항상 복구
    };
  }, []);
  return (
    <>
      <NavBar />
      <div style={{ paddingTop: "80px" }}></div>
      <Outlet />
    </>
  );
}

export default Main;
