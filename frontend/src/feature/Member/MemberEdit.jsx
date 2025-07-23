import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Row,
  Spinner,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";

export function MemberEdit() {
  // 입력 항목 정규식
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
  const passwordRegEx = /^[A-Za-z0-9]{8,20}$/;
  // const nameRegEx = /^[가-힣]{2,5}$/; // 한글 이름만
  const nameRegEx = /^[가-힣a-zA-Z\s]{2,20}$/; // 한글 + 영문 이름 허용 시
  const phoneRegEx = /^01[016789][0-9]{7,8}$/;

  // 입력항목
  const [member, setMember] = useState(null);
  const [memberParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 정규식과 일치하는지
  const [passwordValid, setPasswordValid] = useState(true);
  const [nameValid, setNameValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);

  // 수정 버튼 클릭 여부
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 회원 정보 조회
  useEffect(() => {
    axios
      .get(`/api/member?id=${memberParams.get("id")}`)
      .then((res) => {
        setMember(res.data);
        console.log(res.data);
      })
      .catch((err) => {})
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

  function handleMemberInfoChangeButton() {
    setIsSubmitted(true);

    const isPasswordOk = passwordRegEx.test(password);
    const isNameOk = nameRegEx.test(member.name);
    const isPhoneOk = phoneRegEx.test(member.phone);
    const isEmailOk = emailRegEx.test(member.email);

    setPasswordValid(isPasswordOk);
    setNameValid(isNameOk);
    setPhoneValid(isPhoneOk);
    setEmailValid(isEmailOk);

    // 각 항목을 입력하지 않으면 수정 버튼 비활성화
    const requiredFields = [
      password,
      member?.name,
      member?.birthday,
      member?.phone,
      member?.email,
      member?.address,
    ];
    const allFieldsFilled = requiredFields.every(
      (field) => field.trim() !== "",
    );

    if (
      !isPasswordOk ||
      !isNameOk ||
      !isPhoneOk ||
      !isEmailOk ||
      !allFieldsFilled
    ) {
      return; // 유효하지 않으면 요청 중단
    }
    axios
      .put(`/api/member/${member.id}`, {
        ...member,
      })
      .then((res) => {
        // navigate(`/member/${member.id}`);
      })
      .catch((err) => {})
      .finally(() => {});
  }

  if (!member) {
    return (
      <div>
        <Spinner />
        회원 정보를 불러오는 중...
      </div>
    );
  }

  return (
    <Row>
      <Col>
        <h2>회원 정보 수정</h2>
        <div>
          <FormGroup controlId="loginId1">
            <FormLabel>아이디</FormLabel>
            <FormControl disabled value={member.loginId} />
          </FormGroup>
        </div>
        <div>
          <FormGroup controlId="password1">
            <FormLabel>비밀번호</FormLabel>
            <FormControl
              value={member.password}
              type="password"
              onChange={(e) =>
                setMember({ ...member, password: e.target.value })
              }
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup controlId="name1">
            <FormLabel>이름</FormLabel>
            <FormControl
              value={member.name}
              onChange={(e) => setMember({ ...member, name: e.target.value })}
            />
            {isSubmitted && !nameValid && (
              <FormText className="text-danger">
                이름 형식이 올바르지 않습니다.
              </FormText>
            )}
          </FormGroup>
        </div>
        <div>
          <FormGroup controlId="birthday1">
            <FormLabel>생년월일</FormLabel>
            <FormControl
              value={member.birthday}
              onChange={(e) =>
                setMember({ ...member, birthday: e.target.value })
              }
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup controlId="phone1">
            <FormLabel>전화번호</FormLabel>
            <FormControl
              value={member.phone}
              onChange={(e) => setMember({ ...member, phone: e.target.value })}
            />
            {isSubmitted && !phoneValid && (
              <FormText className="text-danger">
                전화번호 형식이 올바르지 않습니다.
              </FormText>
            )}
          </FormGroup>
        </div>
        <div>
          <FormGroup controlId="email1">
            <FormLabel>이메일</FormLabel>
            <FormControl
              value={member.email}
              onChange={(e) => setMember({ ...member, email: e.target.value })}
            />
            {isSubmitted && !emailValid && (
              <FormText className="text-danger">
                이메일 형식이 올바르지 않습니다.
              </FormText>
            )}
          </FormGroup>
        </div>
        <div>
          <FormGroup controlId="address1">
            <FormLabel>주소</FormLabel>
            <FormControl
              value={member.address}
              onChange={(e) =>
                setMember({ ...member, address: e.target.value })
              }
            />
          </FormGroup>
        </div>
        <div>
          <Button
            onClick={handleMemberInfoChangeButton}
            disabled={
              !member?.name?.trim() ||
              !member?.birthday?.trim() ||
              !member?.phone?.trim() ||
              !member?.email?.trim() ||
              !member?.address?.trim() ||
              !password.trim()
            }
          >
            수정
          </Button>
          <Button onClick={() => navigate(`/member?id=${member.id}`)}>
            취소
          </Button>
        </div>
      </Col>
    </Row>
  );
}
