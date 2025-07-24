// src/feature/common/MainLayout.jsx
import NavBar from "./NavBar.jsx"; // default export 기준
import { Outlet } from "react-router";

function MainLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default MainLayout;
