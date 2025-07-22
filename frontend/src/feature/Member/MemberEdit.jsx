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
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";

export function MemberEdit() {
  const [member, setMember] = useState(null);
  const [memberParams] = useSearchParams();
  const [password, setPassword] = useState("");
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
          </FormGroup>
        </div>
        <div>
          <FormGroup controlId="email1">
            <FormLabel>이메일</FormLabel>
            <FormControl
              value={member.email}
              onChange={(e) => setMember({ ...member, email: e.target.value })}
            />
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
          <Button onClick={handleMemberInfoChangeButton}>수정</Button>
          <Button onClick={() => navigate(`/member?id=${member.id}`)}>
            취소
          </Button>
        </div>
      </Col>
    </Row>
  );
}
