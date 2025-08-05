import {
  Button,
  Card,
  Col,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import axios from "axios";
import { AuthenticationContext } from "../common/AuthenticationContextProvider.jsx";
import WithDrawModal from "./Modal/WithDrawModal.jsx";
import WithdrawModal from "./Modal/WithDrawModal.jsx";

export function MemberDetail() {
  const [member, setMember] = useState(null);
  const [withdrawModalShow, setWithdrawModalShow] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 버튼 중복 클릭 방어
  const [isWithdrawProcessing, setIsWithdrawProcessing] = useState(false);

  const [memberParams] = useSearchParams();

  const navigate = useNavigate();

  const { logout, hasAccess } = useContext(AuthenticationContext);

  // 회원 정보 조회
  useEffect(() => {
    axios
      .get(`/api/member?id=${memberParams.get("id")}`)
      .then((res) => {
        setMember(res.data);
      })
      .catch((err) => {})
      .finally(() => {});
  }, [memberParams]);

  // 회원 정보 없을때 (ex: null)
  if (!member) {
    return (
      <div>
        <div>
          <Spinner />
        </div>
        회원 정보를 불러오는 중 . . .{" "}
      </div>
    );
  }

  // 회원 탈퇴
  function handleWithdrawButtonClick() {
    if (isWithdrawProcessing) return; // 중복 클릭 방어
    setIsWithdrawProcessing(true);

    axios
      .delete(`/api/member`, {
        data: { id: member.id, oldPassword: oldPassword },
      })
      .then((res) => {
        navigate("/");
        logout();
      })
      .catch((err) => {
        setPasswordError("비밀번호가 일치하지 않습니다");
      })
      .finally(() => {
        setIsWithdrawProcessing(false);
      });
  }

  function handleCloseWithdrawModal() {
    setWithdrawModalShow(false);
    setOldPassword("");
    setPasswordError("");
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="flex justify-center items-start pt-10">
        <div className="w-full max-w-[600px]">
          <div className="px-8 py-6 shadow rounded-2xl bg-white">
              <Row>
                <Col>
                  <h2 className="mb-6 text-center text-2xl font-semibold">회원 정보</h2>

                  <div className="space-y-4">
                    {/* 아이디 */}
                    <div>
                      <label className="block font-semibold mb-1">아이디</label>
                      <input
                        type="text"
                        readOnly
                        value={member.loginId}
                        className="w-full rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    {/* 이름 */}
                    <div>
                      <label className="block font-semibold mb-1">이름</label>
                      <input
                        type="text"
                        readOnly
                        value={member.name}
                        className="w-full rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    {/* 생년월일 */}
                    <div>
                      <label className="block font-semibold mb-1">생년월일</label>
                      <input
                        type="text"
                        readOnly
                        value={member.birthday}
                        className="w-full rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    {/* 전화번호 */}
                    <div>
                      <label className="block font-semibold mb-1">전화번호</label>
                      <input
                        type="text"
                        readOnly
                        value={member.phone}
                        className="w-full rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    {/* 이메일 */}
                    <div>
                      <label className="block font-semibold mb-1">이메일</label>
                      <input
                        type="text"
                        readOnly
                        value={member.email}
                        className="w-full rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    {/* 주소 */}
                    <div>
                      <label className="block font-semibold mb-1">주소</label>
                      <input
                        type="text"
                        readOnly
                        value={member.zipCode}
                        className="w-full rounded px-3 py-2 bg-gray-100 cursor-not-allowed mb-2"
                      />
                      <input
                        type="text"
                        readOnly
                        value={member.address}
                        className="w-full rounded px-3 py-2 bg-gray-100 cursor-not-allowed mb-2"
                      />
                      <input
                        type="text"
                        readOnly
                        value={member.addressDetail}
                        className="w-full rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* 버튼 */}
                  {hasAccess(member.loginId) && (
                    <div className="text-right mt-6">
                      <button
                        className="btn btn-info px-4 py-2 rounded mr-2 hover:opacity-90 transition"
                        onClick={() => navigate(`/member/edit?id=${member.id}`)}
                      >
                        수정
                      </button>
                      <button
                        className="btn btn-error px-4 py-2 rounded mr-2 hover:opacity-90 transition"
                        onClick={() => setWithdrawModalShow(true)}
                      >
                        탈퇴
                      </button>
                    </div>
                  )}
                </Col>
                <WithdrawModal
                  show={withdrawModalShow}
                  onClose={handleCloseWithdrawModal}
                  oldPassword={oldPassword}
                  setOldPassword={setOldPassword}
                  passwordError={passwordError}
                  setPasswordError={setPasswordError}
                  handleWithdrawButtonClick={handleWithdrawButtonClick}
                  isWithdrawProcessing={isWithdrawProcessing}
                />
              </Row>
          </div>
        </div>
      </div>
    </div>
  );
}
