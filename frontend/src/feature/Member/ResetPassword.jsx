import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Row,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";

export function ResetPassword() {
  // password 정규식
  const passwordRegEx = /^[A-Za-z0-9]{8,20}$/;

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const navigate = useNavigate();

  const location = useLocation();
  const { loginId, email } = location.state || {}; // fallback 처리도 함께

  // password 와 password2(비밀번호 확인)이 일치하지 않으면 가입버튼 비활성화
  const passwordConfirm = password === password2;

  // password 정규식 검증
  const [passwordValid, setPasswordValid] = useState(true);

  // 전송 버튼 클릭 여부
  const [isSubmitted, setIsSubmitted] = useState(false);

  function handleChangePasswordButton() {}

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center"
    >
      <Card className="p-4 shadow rounded">
        <Row>
          <Col>
            <Form>
              <FormGroup>
                <FormLabel className="fw-semibold">비밀번호</FormLabel>
                <div className="mb-1 mt-0">
                  <FormText className="text-muted fs-7">
                    비밀번호는 영문+숫자 조합, 8~20자 사이로 입력해주세요.
                  </FormText>
                </div>
                <FormControl
                  type="password"
                  value={password}
                  placeholder="비밀번호"
                  onChange={(e) => setPassword(e.target.value)}
                  isInvalid={isSubmitted && !passwordValid}
                />
                {isSubmitted && !passwordValid && (
                  <FormText className="text-danger">
                    유효한 비밀번호 형식이 아닙니다.
                  </FormText>
                )}
              </FormGroup>

              <FormGroup className="mt-2">
                <FormLabel className="fw-semibold">비밀번호 확인</FormLabel>
                <FormControl
                  type="password"
                  value={password2}
                  placeholder="비밀번호 확인"
                  onChange={(e) => setPassword2(e.target.value)}
                />
                {password2 && password !== password2 && (
                  <div style={{ color: "red", fontSize: "0.875rem" }}>
                    비밀번호가 일치하지 않습니다.
                  </div>
                )}
              </FormGroup>
              <div className="text-end mt-2">
                <div>
                  <Button
                    className="mt-2 me-2"
                    variant="dark"
                    size="sm"
                    onClick={handleChangePasswordButton}
                  >
                    비밀번호 재설정
                  </Button>
                </div>
                <div>
                  <Button
                    className="mt-2 me-2"
                    variant="dark"
                    size="sm"
                    onClick={() => navigate("/")}
                  >
                    돌아가기
                  </Button>
                </div>
              </div>
            </Form>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}
