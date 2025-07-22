import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProductRegist } from "./feature/Product/ProductRegist.jsx";
import MainLayout from "./feature/common/MainLayout.jsx";
import { ProductList } from "./feature/Product/ProductList.jsx";
import { ProductDetail } from "./feature/Product/ProductDetail.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route path="product/regist" element={<ProductRegist />} />
          <Route path="product/list" element={<ProductList />} />
          <Route path="product/view" element={<ProductDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
