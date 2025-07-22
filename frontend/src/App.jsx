import { BrowserRouter, Route, Routes } from "react-router";
import { ProductRegist } from "./feature/Product/ProductRegist.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="product/regist" element={<ProductRegist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
