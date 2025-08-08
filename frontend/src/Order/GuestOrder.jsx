import React, {useState} from "react";
import {Link, useNavigate} from "react-router";
import axios from "axios";

export function GuestOrder() {
  const [orderToken, setOrderToken] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  function handleSearchOrderButtonClick(e) {
    e.preventDefault();

    axios.post("api/order/guest-order/lookup", {
      guestOrderToken: orderToken,
      guestName: name,
      guestPhone: phone,
    })
      .then(() => {
        // 인증 성공 -> 상세 페이지로 이동
        navigate("/order/guest-order/detail");
      })
      .catch((err) => {
        alert(err.response?.data || "조회 실패");
      });
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-center items-start pt-10">
        <div className="w-full max-w-[400px]">
          <div className="p-6 shadow rounded-2xl bg-white">
            <div className="w-full justify-content-center">
              <Link to="/home" className="navbar-logo w-full block text-center mb-6">
                코데헌
              </Link>
              <h3 className="text-center text-xl font-bold mb-6">비회원 주문 조회</h3>
              <form onSubmit={handleSearchOrderButtonClick} className="mb-4">
                <div className="form-control mb-2">
                  <label htmlFor="orderToken" className="block text-sm font-semibold mb-2">주문번호</label>
                  <input
                    id="orderToken"
                    type="text"
                    onChange={(e) => setOrderToken(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control mb-2">
                  <label htmlFor="name" className="block text-sm font-semibold mb-2">주문자명</label>
                  <input
                    id="name"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="form-control mb-2">
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2">전화번호</label>
                  <input
                    id="phone"
                    type="text"
                    onChange={(e) => setPhone(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="text-end mt-3">
                  <button
                    type="submit"
                    className="btn btn-neutral w-full font-bold">주문조회
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}