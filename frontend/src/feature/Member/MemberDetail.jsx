import {
  Button,
  Col,
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

export function MemberDetail() {
  const [member, setMember] = useState(null);
  const [withdrawModalShow, setWithdrawModalShow] = useState(false);
  const [oldPassword, setOldPassword] = useState("");

  const [memberParams] = useSearchParams();

  const navigate = useNavigate();

  const { logout, hasAccess } = useContext(AuthenticationContext);

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
    console.log(member);
    axios
      .delete(`/api/member`, {
        data: { id: member.id, oldPassword: oldPassword },
      })
      .then((res) => {
        console.log("good");
        navigate("/");
        logout();
      })
      .catch((err) => {
        console.log("bad");
      })
      .finally(() => {
        console.log("always");
      });
  }

  return (
    <Row>
      <Col>
        <h2>회원 정보</h2>
        <div>
          <FormGroup controlId="loginId1">
            <FormLabel>아이디</FormLabel>
            <FormControl readOnly value={member.loginId} />
          </FormGroup>
        </div>
        <div>
          <FormGroup controlId="name1">
            <FormLabel>이름</FormLabel>
            <FormControl readOnly value={member.name} />
          </FormGroup>
        </div>
        <div>
          <FormGroup controlId="birthday1">
            <FormLabel>생년월일</FormLabel>
            <FormControl readOnly value={member.birthday} />
          </FormGroup>
        </div>
        <div>
          <FormGroup controlId="phone1">
            <FormLabel>전화번호</FormLabel>
            <FormControl readOnly value={member.phone} />
          </FormGroup>
        </div>
        <div>
          <FormGroup controlId="email1">
            <FormLabel>이메일</FormLabel>
            <FormControl readOnly value={member.email} />
          </FormGroup>
        </div>
        <div>
          <FormGroup controlId="address1">
            <FormLabel>주소</FormLabel>
            <FormControl readOnly value={member.zipCode} />
            <FormControl readOnly value={member.address} />
            <FormControl readOnly value={member.addressDetail} />
          </FormGroup>
        </div>
        {hasAccess(member.loginId) && (
          <div>
            <Button
              className="me-2"
              onClick={() => navigate(`/member/edit?id=${member.id}`)}
            >
              수정
            </Button>
            <Button onClick={() => setWithdrawModalShow(true)}>탈퇴</Button>
          </div>
        )}
      </Col>
      <Modal
        show={withdrawModalShow}
        onHide={() => setWithdrawModalShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>회원 탈퇴 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-3" style={{ fontSize: "13px" }}>
            정말 탈퇴하시겠습니까? 탈퇴를 위해 비밀번호를 입력해주세요.
          </p>
          <FormGroup>
            <FormLabel>비밀번호</FormLabel>
            <FormControl
              id="withdraw-password"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              autoFocus
            />
            <FormText className="text-danger">
              비밀번호를 입력해주세요.
            </FormText>
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setWithdrawModalShow(false)}>취소</Button>
          <Button onClick={handleWithdrawButtonClick} disabled={!oldPassword}>
            탈퇴
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}
