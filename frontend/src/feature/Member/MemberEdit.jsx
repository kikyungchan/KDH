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
  ModalTitle,
  Row,
  Spinner,
} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate, useSearchParams} from "react-router";
import LeaveMemberEditModal from "./Modal/LeaveMemberEditModal.jsx";
import ConfirmEditModal from "./Modal/ConfirmEditModal.jsx";
import ChangePasswordModal from "./Modal/ChangePasswordModal.jsx";

export function MemberEdit() {
  // 입력 항목 정규식
  // const emailRegEx =
  //   /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
  // const passwordRegEx = /^[A-Za-z0-9]{8,20}$/;
  // const nameRegEx = /^[가-힣]{2,5}$/; // 한글 이름만
  const nameRegEx = /^[가-힣a-zA-Z\s]{2,20}$/; // 한글 + 영문 이름 허용 시
  const phoneRegEx = /^01[016789][0-9]{7,8}$/;

  // 입력항목
  const [member, setMember] = useState({
    loginId: "",
    name: "",
    password: "",
    birthday: "",
    phone: "",
    zipCode: "",
    address: "",
    addressDetail: "",
  });
  const navigate = useNavigate();
  const [memberParams] = useSearchParams();
  // 비밀번호 변경
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  // Modal
  const [saveModalShow, setSaveModalShow] = useState(false);
  const [changePasswordModalShow, setChangePasswordModalShow] = useState(false);
  const [cancelSaveModalShow, setCancelSaveModalShow] = useState(false);

  // 정규식과 일치하는지
  const [passwordValid, setPasswordValid] = useState(true);
  const [nameValid, setNameValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);

  // 수정 버튼 클릭 여부
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 수정 버튼 클릭시 추가 동작 방어
  const [isPasswordProcessing, setIsPasswordProcessing] = useState(false);
  const [isEditProcessing, setIsEditProcessing] = useState(false);

  // 회원 정보 조회
  useEffect(() => {
    axios
      .get(`/api/member?id=${memberParams.get("id")}`)
      .then((res) => {
        setMember(res.data);
      })
      .catch(() => {
        alert("잠시 후 다시 시도해주십시오.");
      })
      .finally(() => {
      });
  }, [memberParams]);
  if (!member) {
    return (
      <div>
        <div>
          <Spinner/>
        </div>
        회원 정보를 불러오는 중 . . .{" "}
      </div>
    );
  }

  // 수정버튼
  function handleMemberInfoChangeButton() {
    const isPasswordOk = oldPassword.trim() !== "";
    const isNameOk = nameRegEx.test(member.name);
    const isPhoneOk = phoneRegEx.test(member.phone);

    // 중복 클릭 방어
    if (isEditProcessing) return;
    setIsEditProcessing(true);

    // 각 항목을 입력하지 않으면 수정 버튼 비활성화
    const requiredFields = [
      oldPassword,
      member?.name,
      member?.birthday,
      member?.phone,
      member?.address,
    ];

    const allFieldsFilled = requiredFields.every(
      (field) => field.trim() !== "",
    );

    setPasswordValid(isPasswordOk);
    setNameValid(isNameOk);
    setPhoneValid(isPhoneOk);
    setIsSubmitted(true);

    if (!isPasswordOk || !isNameOk || !isPhoneOk || !allFieldsFilled) {
      setIsEditProcessing(false);
      return; // 유효하지 않으면 요청 중단
    }
    axios
      .put(`/api/member/${member.id}`, {
        ...member,
        oldPassword: oldPassword,
        newPassword: newPassword1,
      })
      .then(() => {
        navigate(`/member?id=${member.id}`);
      })
      .catch(() => {
        alert("비밀번호가 일치하지 않습니다.");
      })
      .finally(() => {
        setIsEditProcessing(false);
      });
  }

  if (!member) {
    return (
      <div>
        <Spinner/>
        회원 정보를 불러오는 중...
      </div>
    );
  }

  // 주소 확인
  const handleSearchAddress = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setMember((prevMember) => ({
          ...prevMember,
          address: data.address, // 도로명 주소 할당
          zipCode: data.zonecode, // 우편번호 할당
        }));
      },
    }).open();
  };

  // 암호 변경 버튼 활성화 여부
  let changePasswordButtonDisabled = false;
  let passwordConfirm = true;
  if (oldPassword === "") {
    changePasswordButtonDisabled = true;
  }
  if (newPassword1 === "") {
    changePasswordButtonDisabled = true;
  }
  if (newPassword2 === "") {
    changePasswordButtonDisabled = true;
  }
  if (newPassword1 !== newPassword2) {
    changePasswordButtonDisabled = true;
    passwordConfirm = false;
  }

  // 비밀번호 수정
  function handleChangePasswordClick() {
    // 중복 클릭 방지
    if (isPasswordProcessing) return;
    setIsPasswordProcessing(true);

    axios
      .put(`/api/member/changePassword`, {
        id: member.id,
        oldPassword: oldPassword,
        newPassword: newPassword1,
      })
      .then(() => {
        setOldPassword("");
        setNewPassword1("");
        setNewPassword2("");
        setChangePasswordModalShow(false);
      })
      .catch(() => {
        alert("비밀번호가 일치하지 않습니다.");
      })
      .finally(() => {
        setIsPasswordProcessing(false);
      });
  }

  function handleCloseChangePasswordModal() {
    setChangePasswordModalShow(false);
    setOldPassword("");
    setNewPassword1("");
    setNewPassword2("");
  }

  return (
    <div style={{backgroundColor: "#f8f9fa", minHeight: "100vh"}}>
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{paddingTop: "40px"}}
      >
        <div style={{width: "100%", maxWidth: "600px"}}>
          <Card className="p-4 shadow rounded">
            <Card.Body>
              <Row>
                <Col>
                  <h2 className="mb-6 text-center text-xl font-semibold">회원 정보 수정</h2>

                  {/* 아이디 (읽기 전용) */}
                  <div className="flex items-center gap-4 mb-4">
                    <label className="label font-semibold mr-6">아이디</label>
                    <input
                      type="text"
                      value={member.loginId || ""}
                      disabled
                      className="font-semibold input input-bordered bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* 이름 */}
                  <div className="flex items-center gap-4 mb-4">
                    <label className="w-24 label font-semibold mr-6">이름</label>
                    <input
                      type="text"
                      value={member.name || ""}
                      onChange={(e) => setMember({...member, name: e.target.value})}
                      className="input input-bordered"
                    />
                    {isSubmitted && !nameValid && (
                      <span className="text-error text-sm mt-1">
                        이름 형식이 올바르지 않습니다.
                      </span>
                    )}
                  </div>

                  {/* 생년월일 */}
                  <div className="flex items-center gap-4 mb-4">
                    <label className="label font-semibold mr-6">생년월일</label>
                    <input
                      type="date"
                      value={member.birthday || ""}
                      onChange={(e) => setMember({...member, birthday: e.target.value})}
                      className="input input-bordered"
                    />
                  </div>

                  {/* 전화번호 */}
                  <div className="flex items-center gap-4 mb-4">
                    <label className="label font-semibold mr-6">전화번호</label>
                    <input
                      type="text"
                      value={member.phone || ""}
                      onChange={(e) => setMember({...member, phone: e.target.value})}
                      className="input input-bordered"
                    />
                    {isSubmitted && !phoneValid && (
                      <span className="text-error text-sm mt-1">
                        전화번호 형식이 올바르지 않습니다.
                      </span>
                    )}
                  </div>

                  {/* 이메일 (읽기 전용) */}
                  <div className="flex items-center gap-4 mb-4">
                    <label className="label font-semibold mr-6">이메일</label>
                    <input
                      type="email"
                      value={member.email || ""}
                      disabled
                      className="font-semibold input input-bordered bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* 주소 */}
                  <div className="flex items-start gap-4 mb-4">
                    {/* 좌측: 고정 라벨 */}
                    <label className="label font-semibold mr-6">주소</label>

                    {/* 우측: input 요소들 */}
                    <div className="flex flex-col flex-1 gap-2">
                      <input
                        type="text"
                        value={member.zipCode || ""}
                        readOnly
                        className="input input-bordered bg-gray-100 cursor-not-allowed"
                      />
                      <input
                        type="text"
                        value={member.address || ""}
                        readOnly
                        className="input input-bordered bg-gray-100 cursor-not-allowed"
                      />
                      <div className="flex">
                        <input
                          type="text"
                          value={member.addressDetail || ""}
                          onChange={(e) =>
                            setMember({...member, addressDetail: e.target.value})
                          }
                          className="input input-bordered"
                        />
                        <button
                          onClick={handleSearchAddress}
                          className="btn btn-neutral w-fit ml-2"
                        >
                          주소 검색
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* 하단 버튼들 */}
                  <div className="flex justify-between mt-10">
                    {/* 왼쪽: 암호 변경 */}
                    <button
                      className="btn btn-neutral"
                      onClick={() => setChangePasswordModalShow(true)}
                    >
                      암호 변경
                    </button>

                    {/* 오른쪽: 저장 / 취소 */}
                    <div className="space-x-2">
                      <button
                        className="btn btn-primary"
                        onClick={() => setSaveModalShow(true)}
                        disabled={
                          !member?.name?.trim() ||
                          !member?.birthday?.trim() ||
                          !member?.phone?.trim() ||
                          !member?.email?.trim() ||
                          !member?.address?.trim()
                        }
                      >
                        저장
                      </button>
                      <button
                        className="btn"
                        onClick={() => setCancelSaveModalShow(true)}
                      >
                        취소
                      </button>
                    </div>
                  </div>
                </Col>
                <ConfirmEditModal
                  show={saveModalShow}
                  onClose={() => setSaveModalShow(false)}
                  onSubmit={handleMemberInfoChangeButton}
                  oldPassword={oldPassword}
                  setOldPassword={setOldPassword}
                  isSubmitted={isSubmitted}
                  setIsSubmitted={setIsSubmitted}
                  isEditProcessing={isEditProcessing}
                />
                {/* 회원 정보 수정 취소 모달 */}
                <LeaveMemberEditModal
                  show={cancelSaveModalShow}
                  onClose={() => setCancelSaveModalShow(false)}
                  onLeave={() => navigate(`/member?id=${member.id}`)}
                />
                {/* 비밀번호 변경 모달 */}
                <ChangePasswordModal
                  show={changePasswordModalShow}
                  onClose={handleCloseChangePasswordModal}
                  oldPassword={oldPassword}
                  setOldPassword={setOldPassword}
                  newPassword1={newPassword1}
                  setNewPassword1={setNewPassword1}
                  newPassword2={newPassword2}
                  setNewPassword2={setNewPassword2}
                  passwordConfirm={passwordConfirm}
                  handleChangePasswordClick={handleChangePasswordClick}
                  changePasswordButtonDisabled={changePasswordButtonDisabled}
                  isPasswordProcessing={isPasswordProcessing}
                />
              </Row>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
}
