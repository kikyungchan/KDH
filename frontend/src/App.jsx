import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProductRegist } from "./feature/Product/ProductRegist.jsx";
import NavBar from "./feature/common/NavBar.jsx";
import MainLayout from "./feature/common/MainLayout.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="product/regist" element={<ProductRegist />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
