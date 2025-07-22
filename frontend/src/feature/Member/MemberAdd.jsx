import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Spinner,
} from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

export function MemberAdd() {
  // 오늘 날짜를 yyyy-MM-dd 형식으로 반환하는 함수
  const getToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  // 초기값은 오늘 날짜
  const [birthday, setBirthday] = useState(getToday());

  function handleSignUpClick() {
    axios
      .post("/api/member/signup", {
        loginId: loginId,
        password: password,
        name: name,
        birthday: birthday,
        phone: phone,
        email: email,
        address: address,
      })
      .then((res) => {
        console.log("잘됨");
      })
      .catch((err) => {
        console.log("안됨");
      })
      .finally(() => {
        console.log("항상");
      });
  }

  return (
    <Row>
      <Col>
        <h2>회원 등록</h2>
        <div>
          <FormGroup>
            <FormLabel>아이디</FormLabel>
            <FormControl
              type="text"
              value={loginId}
              onChange={(e) => {
                setLoginId(e.target.value);
              }}
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup>
            <FormLabel>비밀번호</FormLabel>
            <FormControl
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </FormGroup>
        </div>
        <div>
          {/* TODO : 비밀번호 일치 여부 */}
          <FormGroup>
            <FormLabel>비밀번호 확인</FormLabel>
            <FormControl
              type="password"
              value={password2}
              onChange={(e) => {
                setPassword2(e.target.value);
              }}
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup>
            <FormLabel>성명</FormLabel>
            <FormControl
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup>
            <FormLabel>생년월일</FormLabel>
            <FormControl
              type="date"
              value={birthday}
              onChange={(e) => {
                setBirthday(e.target.value);
              }}
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup>
            <FormLabel>전화번호</FormLabel>
            <FormControl
              type="text"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup>
            <FormLabel>이메일</FormLabel>
            <FormControl
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </FormGroup>
        </div>
        <div>
          <FormGroup>
            <FormLabel>주소</FormLabel>
            <FormControl
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
              }}
            />
          </FormGroup>
        </div>
        <div>
          <Button onClick={handleSignUpClick}>가입</Button>
        </div>
      </Col>
    </Row>
  );
}
