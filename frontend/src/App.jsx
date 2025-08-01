import { BrowserRouter, Route, Routes } from "react-router";
import { ProductRegist } from "./feature/Product/ProductRegist.jsx";
import { ProductList } from "./feature/Product/ProductList.jsx";
import { ProductDetail } from "./feature/Product/ProductDetail/ProductDetail.jsx";
import { ProductEdit } from "./feature/Product/ProductEdit.jsx";
import { MemberList } from "./feature/Member/MemberList.jsx";
import { MemberAdd } from "./feature/Member/MemberAdd.jsx";
import { MemberDetail } from "./feature/Member/MemberDetail.jsx";
import { MemberEdit } from "./feature/Member/MemberEdit.jsx";
import { MemberLogin } from "./feature/Member/MemberLogin.jsx";
import { AuthenticationContextProvider } from "./feature/common/AuthenticationContextProvider.jsx";
import ProductOrder from "./feature/Product/ProductOrder.jsx";
import ProductCart from "./feature/Product/ProductCart.jsx";
import { Chat } from "./feature/Chat/Chat.jsx";
import { QnaAdd } from "./feature/Qna/QnaAdd.jsx";
import { QnaList } from "./feature/Qna/QnaList.jsx";
import { QnaView } from "./feature/Qna/QnaView.jsx";
import { FindLoginId } from "./feature/Member/FindLoginId.jsx";
import { FindPassword } from "./feature/Member/FindPassword.jsx";
import { ResetPassword } from "./feature/Member/ResetPassword.jsx";
import { MemberLogout } from "./feature/Member/MemberLogout.jsx";
import Main from "./feature/common/Main.jsx";
import { ProductOrderComplete } from "./feature/Product/ProductOrderComplete.jsx";
import { CartProvider } from "./feature/Product/CartContext.jsx";
import MainPage from "./feature/common/MainPage.jsx";
import MainSlide from "./feature/common/MainSlide.jsx";

function App() {
  // const username = prompt("닉네임을 입력해 주세요");
  return (
    <AuthenticationContextProvider>
      <BrowserRouter>
        <CartProvider>
        <Routes>
          <Route path="/" element={<MainPage />}>
            <Route index element={<MainSlide />} />
            {/*<Route path="/" */}
            <Route path="product/regist" element={<ProductRegist />} />
            <Route path="product/list" element={<ProductList />} />
            <Route path="product/view" element={<ProductDetail />} />
            <Route path="product/edit" element={<ProductEdit />} />
            <Route path="product/order" element={<ProductOrder />} />
            <Route path="product/cart" element={<ProductCart />} />
            <Route
              path="product/order/complete"
              element={<ProductOrderComplete />}
            />
            <Route path="/member/edit" element={<MemberEdit />} />
            <Route path="/member/list" element={<MemberList />} />
            <Route path="/member" element={<MemberDetail />} />
            <Route path="/signup" element={<MemberAdd />} />
            <Route path="/login" element={<MemberLogin />} />
            <Route path="/logout" element={<MemberLogout />} />
            <Route path="/find/id" element={<FindLoginId />} />
            <Route path="/find/password" element={<FindPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/qna/add/:id" element={<QnaAdd />} />
            <Route path="/qna/list/" element={<QnaList />} />
            <Route path="/qna/view/" element={<QnaView />} />
            {/*<Route path="chat/chatting" element={<Chat username={username} />} />*/}
            <Route path="chat/chatting" element={<Chat />} />
          </Route>
        </Routes>
        </CartProvider>
      </BrowserRouter>
    </AuthenticationContextProvider>
  );
}

export default App;
