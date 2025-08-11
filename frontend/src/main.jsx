import "bootstrap/dist/css/bootstrap-grid.min.css";
import "./style.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")).render(
  // todo : StrictMode 비활성화
  <StrictMode>
    <>
      <App />
      <ToastContainer />
    </>
  </StrictMode>,
);
