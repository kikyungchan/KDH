import NavBar from "./NavBar.jsx";
import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";

function MainPage() {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

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
