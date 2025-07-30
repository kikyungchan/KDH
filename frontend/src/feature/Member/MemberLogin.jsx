import {
  Button,
  Card,
  Col,
  Container,
  Form,
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

  function handleLogInButtonClick(e) {
    e.preventDefault(); // form submit 기본 동작 방지(리로드 X)

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
        alert(err.response.data.message.text);
        console.log(err.response.data.message);
      })
      .finally(() => {});
  }

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Container
        fluid
        className="d-flex justify-content-center align-items-center py-5"
      >
        <Card
          style={{ width: "100%", maxWidth: "400px" }}
          className="shadow p-4"
        >
          <Card.Body>
            <Row className="justify-content-center">
              <Col>
                <h3 className="text-center mb-4">로그인</h3>
                <Form onSubmit={handleLogInButtonClick}>
                  <FormGroup controlId="loginId1" className="mb-3">
                    <FormLabel>아이디</FormLabel>
                    <FormControl
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                    />
                  </FormGroup>
                  <FormGroup controlId="password1" className="mb-3">
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormGroup>
                  <div className="text-end">
                    <Button type="submit">로그인</Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
