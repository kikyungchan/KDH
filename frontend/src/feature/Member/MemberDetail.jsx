import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Spinner,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import axios from "axios";

export function MemberDetail() {
  const [member, setMember] = useState(null);
  const [memberParams] = useSearchParams();
  const navigate = useNavigate();

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
        data: { id: member.id, password: member.password },
      })
      .then((res) => {
        console.log("good");
        navigate("/member/list");
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
            <FormControl readOnly value={member.address} />
          </FormGroup>
        </div>
        <div>
          <Button
            className="me-2"
            onClick={() => navigate(`/member/edit?id=${member.id}`)}
          >
            수정
          </Button>
          <Button onClick={handleWithdrawButtonClick}>탈퇴</Button>
        </div>
      </Col>
    </Row>
  );
}
