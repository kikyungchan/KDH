import { BrowserRouter, Route, Routes } from "react-router";
import { ProductRegist } from "./feature/Product/ProductRegist.jsx";
import NavBar from "./feature/common/NavBar.jsx";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="product/regist" element={<ProductRegist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
