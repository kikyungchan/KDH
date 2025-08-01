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
  Spinner,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

export function ResetPassword() {
  // password 정규식
  const passwordRegEx = /^[A-Za-z0-9]{8,20}$/;

  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [isPasswordProcessing, setIsPasswordProcessing] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();
  const token = location.state?.token;

  // password 와 password2(비밀번호 확인)이 일치하지 않으면 버튼 비활성화
  let changePasswordButtonDisabled = false;
  let passwordConfirm = true;
  if (password === "") {
    changePasswordButtonDisabled = true;
  }
  if (password2 === "") {
    changePasswordButtonDisabled = true;
  }
  if (password !== password2) {
    changePasswordButtonDisabled = true;
    passwordConfirm = false;
  }

  // password 정규식 검증
  const [passwordValid, setPasswordValid] = useState(true);

  // 전송 버튼 클릭 여부
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // 새로고침시 토큰 초기화
  useEffect(() => {
    if (!token) {
      alert("유효하지 않은 접근입니다.");
      navigate("/");
    }
  }, [token, navigate]);

  const handleChangePasswordButton = () => {
    setIsSubmitted(true);
    // 정규식 검증
    const isPasswordOk = passwordRegEx.test(password);

    // 중복 클릭 방어
    if (isPasswordProcessing) return;
    setIsPasswordProcessing(true);

    // 각 항목 입력하지않으면 버튼 비활성화
    const requiredFields = [password, password2];

    const allFieldsFilled = requiredFields.every(
      (field) => field.trim() !== "",
    );

    setPasswordValid(isPasswordOk);

    if (!isPasswordOk || !allFieldsFilled) {
      setIsPasswordProcessing(false);
      return;
    }

    axios
      .post("/api/member/reset-password", {
        newPassword: password,
        token: token,
      })
      .then((res) => {
        navigate("/login");
        setPassword("");
        setPassword2("");
      })
      .catch((err) => {
        console.error("비밀번호 변경 실패", err.response?.data || err.message);
        alert("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
      })
      .finally(() => {
        setIsPasswordProcessing(false);
      });
  };

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
                {passwordConfirm || (
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
                      "재설정"
                    )}
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
