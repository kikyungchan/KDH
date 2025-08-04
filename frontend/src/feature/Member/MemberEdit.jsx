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
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";
import { jwtDecode } from "jwt-decode";
import LeaveMemberEditModal from "./Modal/LeaveMemberEditModal.jsx";

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
      .catch((err) => {
        alert("잠시 후 다시 시도해주십시오.");
      })
      .finally(() => {});
  }, [memberParams]);
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
      .then((res) => {
        navigate(`/member?id=${member.id}`);
      })
      .catch((err) => {
        alert("비밀번호가 일치하지 않습니다.");
      })
      .finally(() => {
        setIsEditProcessing(false);
      });
  }

  if (!member) {
    return (
      <div>
        <Spinner />
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
      .then((res) => {
        setOldPassword("");
        setNewPassword1("");
        setNewPassword2("");
        setChangePasswordModalShow(false);
      })
      .catch((err) => {
        alert("비밀번호가 일치하지 않습니다.");
      })
      .finally(() => {
        setIsPasswordProcessing(false);
      });
  }

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ paddingTop: "40px" }}
      >
        <div style={{ width: "100%", maxWidth: "600px" }}>
          <Card className="p-4 shadow rounded">
            <Card.Body>
              <Row>
                <Col>
                  <h2 className="mb-4 text-center">회원 정보 수정</h2>
                  <div>
                    <FormGroup controlId="loginId1" className="mb-2">
                      <FormLabel className="fw-semibold">아이디</FormLabel>
                      <FormControl disabled value={member.loginId || ""} />
                    </FormGroup>
                  </div>
                  <div>
                    <FormGroup controlId="name1" className="mb-2">
                      <FormLabel className="fw-semibold">이름</FormLabel>
                      <FormControl
                        value={member.name || ""}
                        onChange={(e) =>
                          setMember({ ...member, name: e.target.value })
                        }
                      />
                      {isSubmitted && !nameValid && (
                        <FormText className="text-danger">
                          이름 형식이 올바르지 않습니다.
                        </FormText>
                      )}
                    </FormGroup>
                  </div>
                  <div>
                    <FormGroup controlId="birthday1" className="mb-2">
                      <FormLabel className="fw-semibold">생년월일</FormLabel>
                      <FormControl
                        value={member.birthday || ""}
                        type="date"
                        onChange={(e) =>
                          setMember({ ...member, birthday: e.target.value })
                        }
                      />
                    </FormGroup>
                  </div>
                  <div>
                    <FormGroup controlId="phone1" className="mb-2">
                      <FormLabel className="fw-semibold">전화번호</FormLabel>
                      <FormControl
                        value={member.phone || ""}
                        onChange={(e) =>
                          setMember({ ...member, phone: e.target.value })
                        }
                      />
                      {isSubmitted && !phoneValid && (
                        <FormText className="text-danger">
                          전화번호 형식이 올바르지 않습니다.
                        </FormText>
                      )}
                    </FormGroup>
                  </div>
                  <div>
                    <FormGroup controlId="email1" className="mb-2">
                      <FormLabel className="fw-semibold">이메일</FormLabel>
                      <FormControl disabled value={member.email || ""} />
                    </FormGroup>
                  </div>
                  <div>
                    <FormGroup controlId="address1" className="mb-2">
                      <FormLabel className="fw-semibold">주소</FormLabel>
                      <FormControl value={member.zipCode || ""} readOnly />
                      <FormControl value={member.address || ""} readOnly />
                      <FormControl
                        value={member.addressDetail || ""}
                        onChange={(e) =>
                          setMember({
                            ...member,
                            addressDetail: e.target.value,
                          })
                        }
                      />
                      <Button
                        variant="dark"
                        className="mt-1"
                        onClick={handleSearchAddress}
                      >
                        주소 검색
                      </Button>
                    </FormGroup>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div>
                      <Button
                        variant="dark"
                        onClick={() => setChangePasswordModalShow(true)}
                      >
                        암호 변경
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="dark"
                        onClick={() => setSaveModalShow(true)}
                        className="me-2"
                        disabled={
                          !member?.name?.trim() ||
                          !member?.birthday?.trim() ||
                          !member?.phone?.trim() ||
                          !member?.email?.trim() ||
                          !member?.address?.trim()
                        }
                      >
                        저장
                      </Button>
                      <Button
                        variant="dark"
                        onClick={() => setCancelSaveModalShow(true)}
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                </Col>
                {/* TODO : 회원 정보 수정 모달 jsx로 따로 빼기 */}
                <Modal
                  show={saveModalShow}
                  onHide={() => {
                    setSaveModalShow(false);
                    setOldPassword("");
                  }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>회원 정보 수정 확인</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <FormGroup>
                      <FormLabel>암호 입력</FormLabel>
                      <FormControl
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                      {isSubmitted && oldPassword.trim() === "" && (
                        <FormText className="text-danger">
                          암호를 입력해주세요.
                        </FormText>
                      )}
                    </FormGroup>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="dark"
                      onClick={handleMemberInfoChangeButton}
                      disabled={isEditProcessing}
                    >
                      {isEditProcessing ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          저장 중...
                        </>
                      ) : (
                        "저장"
                      )}
                    </Button>
                    <Button
                      variant="dark"
                      onClick={() => {
                        setSaveModalShow(false);
                        setOldPassword("");
                        setIsSubmitted(false);
                      }}
                    >
                      취소
                    </Button>
                  </Modal.Footer>
                </Modal>
                <LeaveMemberEditModal
                  show={cancelSaveModalShow}
                  onClose={() => setCancelSaveModalShow(false)}
                />
                {/*  TODO : 비밀 번호 변경 모달 jsx로 따로 빼기 */}
                <Modal
                  show={changePasswordModalShow}
                  onHide={() => {
                    setChangePasswordModalShow(false);
                    setOldPassword("");
                    setNewPassword1("");
                    setNewPassword2("");
                  }}
                >
                  <Modal.Header closeButton>
                    <Modal.Title>비밀번호 변경</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <p className="mb-3" style={{ fontSize: "13px" }}>
                      비밀번호는 영문+숫자 조합, 8~20자 사이로 입력하세요.
                    </p>
                    <FormGroup>
                      <FormLabel className="mb-2">현재 비밀번호</FormLabel>
                      <FormControl
                        id="withdraw-password"
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        autoFocus
                      />
                    </FormGroup>
                    <FormGroup className="mb-2 mt-2">
                      <FormLabel>변경할 비밀번호</FormLabel>
                      <FormControl
                        id="withdraw-password"
                        type="password"
                        value={newPassword1}
                        onChange={(e) => setNewPassword1(e.target.value)}
                      />
                    </FormGroup>
                    <FormGroup className="mb-2">
                      <FormLabel>변경할 비밀번호 확인</FormLabel>
                      <FormControl
                        id="withdraw-password"
                        type="password"
                        value={newPassword2}
                        onChange={(e) => setNewPassword2(e.target.value)}
                      />
                      {passwordConfirm || (
                        <FormText className="text-danger">
                          비밀번호가 일치하지 않습니다.
                        </FormText>
                      )}
                    </FormGroup>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="dark"
                      onClick={() => {
                        setChangePasswordModalShow(false);
                        setOldPassword("");
                        setNewPassword1("");
                        setNewPassword2("");
                      }}
                    >
                      취소
                    </Button>
                    <Button
                      variant="dark"
                      onClick={handleChangePasswordClick}
                      disabled={
                        changePasswordButtonDisabled || isPasswordProcessing
                      }
                    >
                      {isPasswordProcessing ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          저장 중...
                        </>
                      ) : (
                        "저장"
                      )}
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Row>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </div>
  );
}
