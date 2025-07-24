import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export function MemberLogin() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleLogInButtonClick() {
    axios
      .post("/api/member/login", {
        loginId: loginId,
        password: password,
      })
      .then((res) => {
        const token = res.data.token;
        localStorage.setItem("token", token);

        const message = res.data.message;
        console.log(message.text);
        navigate("/");
      })
      .catch((err) => {
        console.log(err.response.data.message);
      })
      .finally(() => {
        console.log("always");
      });
  }

  return (
    <Row className="justify-content-center">
      <Col>
        <h2>로그인</h2>
        <FormGroup controlId="loginId1">
          <FormLabel>아이디</FormLabel>
          <FormControl
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
        </FormGroup>
        <FormGroup controlId="password1">
          <FormLabel>비밀번호</FormLabel>
          <FormControl
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormGroup>
        <Button onClick={handleLogInButtonClick}>로그인</Button>
      </Col>
    </Row>
  );
}
