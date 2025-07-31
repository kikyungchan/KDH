import {
  Button,
  Card,
  Col,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Row,
  Spinner,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

export function FindPassword() {
  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");

  // 입력항목 정규식
  const loginIdRegEx = /^[A-Za-z][A-Za-z0-9]{3,19}$/;
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;

  // 로그인 중복확인 상태
  const [loginIdExists, setLoginIdExists] = useState(false);
  const [loginIdCheckMessage, setLoginIdCheckMessage] = useState("");
  const [isLoginIdChecked, setIsLoginIdChecked] = useState(false); // 확인 버튼 클릭 여부

  // email 인증
  const [emailSent, setEmailSent] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [remainTime, setRemainTime] = useState(0);
  const [authFailed, setAuthFailed] = useState(false);

  // 전송 버튼 클릭 여부
  const [isSubmitted, setIsSubmitted] = useState(false);

  // email 인증 완료
  const [authCompleted, setAuthCompleted] = useState(false);

  // email 전송중 버튼 비활성화
  const [isSending, setIsSending] = useState(false);

  //정규식과 일치하는지
  const [emailValid, setEmailValid] = useState(true);

  const navigate = useNavigate();

  // 이메일 입력 실시간 검사
  useEffect(() => {
    setEmailValid(emailRegEx.test(email));
  }, [email]);

  // email 인증시 남은시간
  useEffect(() => {
    let timer;
    if (remainTime > 0) {
      timer = setTimeout(() => {
        setRemainTime((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [remainTime]);

  // email 인증시 남은시간
  useEffect(() => {
    let timer;
    if (remainTime > 0) {
      timer = setTimeout(() => {
        setRemainTime((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [remainTime]);

  // 아이디 중복 확인 버튼
  function handleCheckLoginId() {
    if (!loginId.trim()) {
      setLoginIdCheckMessage("아이디를 입력하세요.");
      setLoginIdExists(false);
      setIsLoginIdChecked(true);
      return;
    }

    axios
      .get(`/api/member/check-id?loginId=${loginId}`)
      .then((res) => {
        if (res.data.exists) {
          setLoginIdExists(true);
          setLoginIdCheckMessage("가입된 아이디입니다.");
        } else {
          setLoginIdExists(false);
          setLoginIdCheckMessage("존재하지 않는 아이디입니다.");
        }
      })
      .catch((err) => {
        setLoginIdExists(false);
        setLoginIdCheckMessage("확인 중 오류가 발생했습니다");
        console.log("error", err.response?.data || err.message);
      })
      .finally(() => {
        setIsLoginIdChecked(true);
      });
  }

  const handleEmailSendButton = () => {
    // 아이디와 이메일이 매칭되는지 먼저 확인
    axios
      .get("/api/member/check-id-email", {
        params: { loginId, email },
      })
      .then((res) => {
        if (!res.data.matched) {
          alert("입력하신 아이디와 이메일이 일치하지 않습니다.");
          return;
        }
        sendEmail();
      })
      .catch((err) => {
        console.log(
          "아이디-이메일 확인 실패",
          err.response?.data || err.message,
        );
        alert("서버 오류로 이메일 확인에 실패했습니다.");
      });
  };

  // 이메일 인증번호 발송 버튼
  function sendEmail() {
    // 이메일 입력갑 유효 검사 실행
    const isEmailOk = emailRegEx.test(email);
    setEmailValid(isEmailOk);
    setIsSubmitted(true);

    // 정규식이거나 비어있으면  return
    if (!isEmailOk || email.trim() === "") return;

    if (isSending) return; // 중복 클릭 방지
    setIsSending(true);

    axios
      .get("/api/email/auth", {
        params: { address: email },
      })
      .then((res) => {
        if (res.data.success) {
          console.log("인증번호 전송에 성공했습니다.", res.data.message);
          alert(res.data.message);
          setEmailSent(true);
          setRemainTime(res.data.remainTimeInSec);
        } else {
          alert(res?.data?.message || "인증번호 전송에 실패했습니다.");
          setRemainTime(res.data.remainTimeInSec);
        }
      })
      .catch((err) => {
        console.log("인증번호 전송에 실패했습니다.", err.response?.data);
        alert(err.response?.data || err.message);
      })
      .finally(() => {
        setIsSending(false);
      });
  }

  // 인증번호 인증 확인 버튼
  const handleAuthCodeVerify = () => {
    setIsSubmitted(true);
    setAuthFailed(false);

    if (!authCode.trim()) {
      setAuthFailed(true); // 입력조차 안 했으면 실패로 처리
      return;
    }

    axios
      .post("/api/email/auth", {
        address: email,
        authCode: authCode,
      })
      .then((res) => {
        if (res.data.success) {
          alert("이메일 인증이 완료되었습니다.");
          setAuthCompleted(true); // 이메일 인증 완료 처리
          setIsSubmitted(false); // 경고 문구 방지
          setAuthFailed(false);
        } else {
          alert("인증번호가 일치하지 않습니다.");
          setAuthFailed(true);
        }
      })
      .catch((err) => {
        console.error("인증번호 검증 실패", err.response?.data || err.message);
        alert("서버 오류로 인증번호 확인에 실패했습니다.");
        setAuthFailed(true);
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
            <FormGroup>
              <FormLabel className="fw-semibold">비밀번호 찾기</FormLabel>
              <br />
              <div className="mb-1 mt-0">
                <FormText className="fs-7">
                  <FormText className="text-muted fs-7">
                    회원가입시 등록한 아이디를 입력해주세요.
                  </FormText>
                </FormText>
              </div>
              <FormControl
                type="text"
                value={loginId}
                onChange={(e) => {
                  setLoginId(e.target.value);
                }}
                className="mt-3"
                placeholder="아이디"
                disabled={authCompleted}
              />
              <div className="text-end mt-2">
                <Button
                  disabled={authCompleted}
                  onClick={handleCheckLoginId}
                  variant="dark"
                  size="sm"
                >
                  확인
                </Button>
              </div>
              {isLoginIdChecked && (
                <FormText
                  className={loginIdExists ? "text-success" : "text-danger"}
                >
                  {loginIdCheckMessage}
                </FormText>
              )}
            </FormGroup>
            {loginIdExists && (
              <>
                <FormGroup className="mt-3">
                  <FormLabel className="fw-semibold">이메일 인증</FormLabel>
                  <br />
                  <div className="mb-1 mt-0">
                    <FormText className="fs-7">
                      <FormText className="text-muted fs-7">
                        등록한 이메일을 입력해주세요.
                      </FormText>
                    </FormText>
                  </div>
                  <FormControl
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    className="mt-3"
                    placeholder="이메일"
                    disabled={authCompleted}
                  />
                  <div>
                    {isSubmitted && !emailValid && (
                      <FormText className="text-danger">
                        유효한 이메일 형식이 아닙니다.
                      </FormText>
                    )}
                  </div>
                  <div className="text-end mt-2">
                    <Button
                      onClick={handleEmailSendButton}
                      variant="dark"
                      size="sm"
                      hidden={authCompleted}
                      className="mb-2"
                    >
                      {isSending ? (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          전송 중...
                        </>
                      ) : (
                        "인증번호 전송"
                      )}
                    </Button>
                  </div>
                  <div>
                    {remainTime > 0 && !authCompleted && (
                      <FormText className="text-muted">
                        인증번호 재전송까지 {remainTime}초 남음
                      </FormText>
                    )}
                    {authCompleted && (
                      <FormText className="text-muted">
                        이메일 인증이 완료되었습니다.
                      </FormText>
                    )}
                  </div>
                </FormGroup>
                {/* 인증번호 입력칸 (이메일 전송 후 보여주기) */}
                {emailSent && !authCompleted && (
                  <>
                    <hr />
                    <FormGroup className="mt-2 fw-semibold">
                      <FormLabel>인증번호</FormLabel>
                      <FormControl
                        type="text"
                        value={authCode}
                        placeholder="인증번호"
                        onChange={(e) => setAuthCode(e.target.value)}
                        isInvalid={authFailed}
                        readOnly={authCompleted}
                        disabled={authCompleted}
                      />
                      <div className="text-end">
                        <Button
                          className="mt-2 me-2"
                          variant="dark"
                          size="sm"
                          onClick={handleAuthCodeVerify}
                          disabled={authCompleted}
                        >
                          인증번호 확인
                        </Button>
                      </div>
                      {authFailed && (
                        <FormText className="text-danger">
                          인증번호를 올바르게 입력하세요.
                        </FormText>
                      )}
                    </FormGroup>
                  </>
                )}
              </>
            )}
            {authCompleted && (
              <>
                <div className="text-end mt-2">
                  <div>
                    <Button
                      className="mt-2 me-2"
                      variant="dark"
                      size="sm"
                      onClick={() =>
                        navigate("/api/reset-password", {
                          state: {
                            loginId: loginId,
                            email: email,
                          },
                        })
                      }
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
              </>
            )}
          </Col>
        </Row>
      </Card>
    </Container>
  );
}
