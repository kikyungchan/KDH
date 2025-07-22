import { BrowserRouter, Route, Routes } from "react-router";
import { ProductRegist } from "./feature/Product/ProductRegist.jsx";
import NavBar from "./feature/common/NavBar.jsx";
import { Navbar } from "react-bootstrap";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="product/regist" element={<ProductRegist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
