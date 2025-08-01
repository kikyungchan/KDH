import React from "react";
import NavBar from "./NavBar.jsx";
import { Outlet } from "react-router";

function Main(props) {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

export default Main;
