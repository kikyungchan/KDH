import NavBar from "./NavBar/NavBar.jsx";
import { Outlet, useLocation } from "react-router";
import { useContext, useEffect, useRef, useState } from "react";
import Footer from "./Footer/Footer.jsx";
import { AuthenticationContext } from "./AuthenticationContextProvider.jsx";

function Main() {
  const location = useLocation();

  const hideFooter = location.pathname === "/";
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
      {!hideFooter && <Footer />}
    </>
  );
}

export default Main;
