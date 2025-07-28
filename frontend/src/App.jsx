// import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router";
import { ProductRegist } from "./feature/Product/ProductRegist.jsx";
import MainLayout from "./feature/common/MainLayout.jsx";
import { ProductList } from "./feature/Product/ProductList.jsx";
import { ProductDetail } from "./feature/Product/ProductDetail.jsx";
import { ProductEdit } from "./feature/Product/ProductEdit.jsx";
import { MemberList } from "./feature/Member/MemberList.jsx";
import { MemberAdd } from "./feature/Member/MemberAdd.jsx";
import { MemberDetail } from "./feature/Member/MemberDetail.jsx";

import { MemberEdit } from "./feature/Member/MemberEdit.jsx";
import { MemberLogin } from "./feature/Member/MemberLogin.jsx";
import { MemberLogout } from "./feature/Member/MemberLogout.jsx";
import { AuthenticationContextProvider } from "./feature/common/AuthenticationContextProvider.jsx";
import ProductOrder from "./feature/Product/ProductOrder.jsx";
import ProductCart from "./feature/Product/ProductCart.jsx";
import { Chat } from "./feature/Chat/Chat.jsx";
import { QnaAdd } from "./feature/Qna/QnaAdd.jsx";
import { QnaList } from "./feature/Qna/QnaList.jsx";
import { QnaView } from "./feature/Qna/QnaView.jsx";

function App() {
  // const username = prompt("닉네임을 입력해 주세요");
  return (
    <AuthenticationContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {/*<Route path="/" */}
            <Route path="product/regist" element={<ProductRegist />} />
            <Route path="product/list" element={<ProductList />} />
            <Route path="product/view" element={<ProductDetail />} />
            <Route path="product/edit" element={<ProductEdit />} />
            <Route path="product/order" element={<ProductOrder />} />
            <Route path="product/cart" element={<ProductCart />} />
            <Route path="/member/edit" element={<MemberEdit />} />
            <Route path="/member/list" element={<MemberList />} />
            <Route path="/member" element={<MemberDetail />} />
            <Route path="/signup" element={<MemberAdd />} />
            <Route path="/login" element={<MemberLogin />} />
            <Route path="/logout" element={<MemberLogout />} />
            <Route path="/qna/add/:id" element={<QnaAdd />} />
            <Route path="/qna/list/" element={<QnaList />} />
            <Route path="/qna/view/" element={<QnaView />} />
            {/*<Route path="chat/chatting" element={<Chat username={username} />} />*/}
            <Route path="chat/chatting" element={<Chat />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthenticationContextProvider>
  );
}

export default App;
