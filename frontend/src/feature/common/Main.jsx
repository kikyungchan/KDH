import NavBar from "./NavBar/NavBar.jsx";
import { Outlet } from "react-router";
import { useEffect } from "react";
import Footer from "./Footer/Footer.jsx";

function Main() {
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
      <Footer />
    </>
  );
}

export default Main;
