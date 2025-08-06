import React, {useContext, useState} from "react";
import {useNavigate, Link} from "react-router";
import axios from "axios";
import {AuthenticationContext} from "../common/AuthenticationContextProvider.jsx";
import {useCart} from "../Product/CartContext.jsx";
import {useAlert} from "../common/AlertContext.jsx";

export function MemberLogin() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const {login} = useContext(AuthenticationContext);
  const {showAlert} = useAlert();
  const {setCartCount} = useCart();

  const navigate = useNavigate();

  function handleLogInButtonClick(e) {
    e.preventDefault(); // form submit 기본 동작 방지(리로드 X)

    axios
      .post("/api/member/login", {
        loginId: loginId,
        password: password,
      })
      .then((res) => {
        const token = res.data.token;
        login(token);

        // 로그인시 회원장바구니 새로고침.
        axios
          .get("/api/product/cart", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => {
            setCartCount(res.data.length);
          });

        const message = res.data.message;
        console.log(message.text);
        navigate("/");
      })
      .catch((err) => {
        showAlert(err.response?.data?.message); // { type: 'error', text: '...' }
      })
      .finally(() => {
      });
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-center items-start pt-10">
        <div className="w-full max-w-[400px]">
          <div className="p-6 shadow rounded-2xl bg-white">
            <div className="w-full justify-content-center">

            <Link to="/" className="navbar-logo block text-center mb-6">
                  코데헌
                </Link>

                <h3 className="text-center text-xl font-bold mb-6">로그인</h3>

                <form onSubmit={handleLogInButtonClick}>
                  {/* 아이디 */}
                  <div className="form-control mb-4">
                    <label htmlFor="loginId" className="block text-sm font-semibold mb-2">
                      아이디
                    </label>
                    <input
                      id="loginId"
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      className="input input-bordered w-full"
                    />
                  </div>

                  {/* 비밀번호 */}
                  <div className="form-control mb-4">
                    <label htmlFor="password" className="block text-sm font-semibold mb-2">
                      비밀번호
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input input-bordered w-full"
                    />
                  </div>

                  {/* 로그인 버튼 */}
                  <div className="mt-4">
                    <button type="submit" className="btn btn-neutral w-full font-bold py-2">
                      로그인
                    </button>
                  </div>
                </form>

                {/* 회원가입 링크 */}
                <div className="text-right mt-4 text-sm">
                  <Link to="/signup" className="link link-hover text-gray-700">
                    회원가입
                  </Link>
                </div>

                {/* 아이디/비밀번호 찾기 링크 */}
                <div className="text-right mt-2 text-sm">
                  <Link to="/find/id" className="link link-hover text-gray-700">
                    아이디 찾기
                  </Link>
                  <span className="mx-2 text-gray-400">/</span>
                  <Link to="/find/password" className="link link-hover text-gray-700">
                    비밀번호 찾기
                  </Link>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
