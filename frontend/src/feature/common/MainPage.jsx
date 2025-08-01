import NavBar from "./NavBar.jsx";
import MainSlide from "./MainSlide.jsx";
import { Outlet } from "react-router";

function MainPage() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default MainPage;
