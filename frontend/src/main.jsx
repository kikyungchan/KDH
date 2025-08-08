import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap-grid.min.css";
import { ToastContainer } from "react-toastify";
import "./style.css";

createRoot(document.getElementById("root")).render(
  // todo : StrictMode 비활성화
  // <StrictMode>
  <>
    <App />
    <ToastContainer />
  </>,

  // </StrictMode>,
);
