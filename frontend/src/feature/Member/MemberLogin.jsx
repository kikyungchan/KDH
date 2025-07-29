import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
} from "react-bootstrap";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { AuthenticationContext } from "../common/AuthenticationContextProvider.jsx";

export function MemberLogin() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  function handleLogInButtonClick() {
    axios
      .post("/api/member/login", {
        loginId: loginId,
        password: password,
      })
      .then((res) => {
        const token = res.data.token;
        login(token);

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

  function handleKeyDown(event) {
    // 눌린 키가 Enter면
    if (event.key === "Enter") {
      // 폼 제출 방지 (기본 동작)
      event.preventDefault();
      // axios 함수 실행
      handleLogInButtonClick();
    }
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
            // 아무키나 눌리면 실행
            onKeyDown={handleKeyDown}
          />
        </FormGroup>
        <Button onClick={handleLogInButtonClick}>로그인</Button>
      </Col>
    </Row>
  );
}
