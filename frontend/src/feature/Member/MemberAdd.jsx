import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Row,
  Spinner,
  Form,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export function MemberAdd() {
  // 입력 항목 정규식
  const loginIdRegEx = /^[A-Za-z][A-Za-z0-9]{3,19}$/;
  const emailRegEx =
    /^[A-Za-z0-9]([-_.]?[A-Za-z0-9])*@[A-Za-z0-9]([-_.]?[A-Za-z0-9])*\.[A-Za-z]{2,3}$/;
  const passwordRegEx = /^[A-Za-z0-9]{8,20}$/;
  // const nameRegEx = /^[가-힣]{2,5}$/; // 한글 이름만
  const nameRegEx = /^[가-힣a-zA-Z\s]{2,20}$/; // 한글 + 영문 이름 허용 시
  const phoneRegEx = /^01[016789][0-9]{7,8}$/;

  // 오늘 날짜를 yyyy-MM-dd 형식으로 반환하는 함수
  const getToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  // 로그인 입력 항목
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  // 주소 입력 api
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState(getToday()); // 초기값은 오늘 날짜

  // email 인증
  const [emailSent, setEmailSent] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [authCodeValid, setAuthCodeValid] = useState(false);

  // 정규식과 일치하는지
  const [loginIdValid, setLoginIdValid] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);
  const [nameValid, setNameValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);

  // 가입 버튼 클릭 여부
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 로그인 중복확인 상태
  const [loginIdChecked, setLoginIdChecked] = useState(false);
  const [loginIdCheckMessage, setLoginIdCheckMessage] = useState("");

  const navigate = useNavigate();

  // 각 항목을 입력하지 않으면 가입 버튼 비활성화
  const requiredFields = [
    loginId,
    password,
    name,
    birthday,
    phone,
    email,
    address,
  ];
  const allFieldsFilled = requiredFields.every((field) => field.trim() !== "");

  // password 와 password2(비밀번호 확인)이 일치하지 않으면 가입버튼 비활성화
  const passwordConfirm = password === password2;
  const disabled =
    !allFieldsFilled || !passwordConfirm || !loginIdChecked || !authCodeValid;

  // 이메일 입력 실시간 검사
  useEffect(() => {
    setEmailValid(emailRegEx.test(email));
  }, [email]);

  // 회원가입 버튼
  function handleSignUpClick() {
    console.log("회원가입 시 전송할 데이터", {
      loginId,
      password,
      name,
      birthday,
      phone,
      email,
      address,
    });
    // 모든 입력값 유효성 검사 실행
    const isLoginIdOk = loginIdRegEx.test(loginId);
    const isPasswordOk = passwordRegEx.test(password);
    const isEmailOk = emailRegEx.test(email);
    const isNameOk = nameRegEx.test(name);
    const isPhoneOk = phoneRegEx.test(phone);
    // 상태값 업데이트
    setLoginIdValid(isLoginIdOk);
    setPasswordValid(isPasswordOk);
    setEmailValid(isEmailOk);
    setNameValid(isNameOk);
    setPhoneValid(isPhoneOk);
    setIsSubmitted(true);

    if (
      !isLoginIdOk ||
      !isPasswordOk ||
      !isEmailOk ||
      !isNameOk ||
      !isPhoneOk ||
      !passwordConfirm
    ) {
      return;
    }

    axios
      .post("/api/member/signup", {
        loginId: loginId,
        password: password,
        name: name,
        birthday: birthday,
        phone: phone,
        email: email,
        zipCode: zipCode,
        address: address,
        addressDetail: addressDetail,
      })
      .then((res) => {
        console.log("잘됨");
        navigate("/");
      })
      .catch((err) => {
        console.log("에러응답", err.response?.data);
      })
      .finally(() => {});
  }

  // 아이디 중복 확인 버튼
  function handleCheckLoginId() {
    if (!loginId.trim()) {
      setLoginIdCheckMessage("아이디를 입력하세요.");
      return;
    }

    axios
      .get(`/api/member/check-id?loginId=${loginId}`)
      .then((res) => {
        if (res.data.exists) {
          setLoginIdChecked(false);
          setLoginIdCheckMessage("이미 사용 중인 아이디입니다.");
          console.log("백엔드 응답", res.data);
        } else {
          setLoginIdChecked(true);
          setLoginIdCheckMessage("사용 가능한 아이디입니다.");
          console.log("백엔드 응답", res.data);
        }
      })
      .catch((err) => {
        setLoginIdChecked(false);
        setLoginIdCheckMessage("확인 중 오류가 발생했습니다");
        console.log("error", err.response?.data || err.message);
      })
      .finally(() => {});
  }

  // 주소 확인
  const handleSearchAddress = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setAddress(data.address); // 도로명 주소
        setZipCode(data.zonecode); // 우편번호 필요하면 이것도
        console.log("작동");
      },
    }).open();
  };

  // 이메일 인증번호 발송 버튼
  const handleEmailSendButton = () => {
    if (!emailValid || email.trim() === "") return;

    axios
      .get("/api/email/auth", {
        params: { address: email },
      })
      .then((res) => {
        console.log("인증번호 전송 성공", res.data.message);
        alert(res.data.message);
        setEmailSent(true);
      })
      .catch((err) => {
        console.log("인증번호 전송 실패", err.response?.data);
        alert(err.response?.data || err.message);
      })
      .finally(() => {});
  };

  // 인증번호 인증 확인 버튼
  const handleAuthCodeVerify = () => {
    setIsSubmitted(true);

    if (!authCode.trim()) {
      setAuthCodeValid(false);
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
          setAuthCodeValid(true);
        } else {
          alert("인증번호가 일치하지 않습니다.");
          setAuthCodeValid(false);
        }
      })
      .catch((err) => {
        console.error("인증번호 검증 실패", err.response?.data || err.message);
        alert("서버 오류로 인증번호 확인에 실패했습니다.");
        setAuthCodeValid(false);
      });
  };

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
              placeholder="아이디는 영문으로 시작하며 4~20자, 영문+숫자 조합만 가능합니다."
              autoComplete="username"
              onChange={(e) => {
                setLoginId(e.target.value);
                setLoginIdChecked(false);
                setLoginIdCheckMessage("");
              }}
              isInvalid={isSubmitted && !loginIdValid}
            />
            {/* 아이디 형식이 맞지않을때 (정규식은 최상단 위치) */}
            {isSubmitted && !loginIdValid && (
              <FormText className="text-danger">
                유효한 아이디 형식이 아닙니다.
              </FormText>
            )}
            <Button
              onClick={() => handleCheckLoginId()}
              size="sm"
              variant="outline-danger"
            >
              아이디 중복 확인
            </Button>
            {/* 아이디 중복 관련 메세지 */}
            {loginIdCheckMessage && (
              <FormText
                className={loginIdChecked ? "text-success" : "text-danger"}
              >
                {loginIdCheckMessage}
              </FormText>
            )}
          </FormGroup>
        </div>
        <div>
          <form>
            <FormGroup>
              <FormLabel>비밀번호</FormLabel>
              <FormControl
                type="password"
                value={password}
                placeholder="비밀번호는 영문+숫자 조합, 8~20자 사이로 입력하세요."
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                isInvalid={isSubmitted && !passwordValid}
              />
              {isSubmitted && !passwordValid && (
                <FormText className="text-danger">
                  유효한 비밀번호 형식이 아닙니다.
                </FormText>
              )}
            </FormGroup>
          </form>
        </div>
        <div>
          <form>
            <FormGroup>
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl
                type="password"
                value={password2}
                placeholder="비밀번호를 한 번 더 입력해주세요"
                onChange={(e) => {
                  setPassword2(e.target.value);
                }}
              />
              {password2 && password !== password2 && (
                <div style={{ color: "red", fontSize: "0.875rem" }}>
                  비밀번호가 일치하지 않습니다.
                </div>
              )}
            </FormGroup>
          </form>
        </div>
        <div>
          <FormGroup>
            <FormLabel>성명</FormLabel>
            <FormControl
              type="text"
              value={name}
              placeholder="이름은 한글 또는 영문 2~20자까지 입력 가능합니다."
              autoComplete="name"
              onChange={(e) => {
                setName(e.target.value);
              }}
              isInvalid={isSubmitted && !nameValid}
            />
            {isSubmitted && !nameValid && (
              <FormText className="text-danger">
                유효한 이름 형식이 아닙니다.
              </FormText>
            )}
          </FormGroup>
        </div>
        <div>
          <FormGroup>
            <FormLabel>생년월일</FormLabel>
            <FormControl
              type="date"
              value={birthday}
              autoComplete="bday"
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
              placeholder="숫자만 입력 (예: 01012345678)"
              autoComplete="tel"
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              isInvalid={isSubmitted && !phoneValid}
            />
            {isSubmitted && !phoneValid && (
              <FormText className="text-danger">
                유효한 전화번호 형식이 아닙니다.
              </FormText>
            )}
          </FormGroup>
        </div>
        <div>
          <FormGroup>
            <FormLabel>이메일</FormLabel>
            <FormControl
              type="text"
              value={email}
              placeholder="예: example@domain.com 형식의 이메일을 입력하세요."
              autoComplete="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              isInvalid={isSubmitted && !emailValid}
            />
            {isSubmitted && !emailValid && (
              <FormText className="text-danger">
                유효한 이메일 형식이 아닙니다.
              </FormText>
            )}
            <Button
              onClick={handleEmailSendButton}
              disabled={email.trim() === "" || !emailValid}
            >
              인증번호 전송
            </Button>
          </FormGroup>
          {/* 인증번호 입력칸 (이메일 전송 후 보여주기) */}
          {emailSent && (
            <FormGroup className="mt-3">
              <FormLabel>인증번호</FormLabel>
              <FormControl
                type="text"
                value={authCode}
                placeholder="이메일로 전송된 인증번호를 입력하세요."
                onChange={(e) => setAuthCode(e.target.value)}
                isInvalid={isSubmitted && !authCodeValid}
              />
              {isSubmitted && !authCodeValid && (
                <FormText className="text-danger">
                  인증번호를 올바르게 입력하세요.
                </FormText>
              )}
              <Button onClick={handleAuthCodeVerify}>인증번호 확인</Button>
            </FormGroup>
          )}
        </div>
        <div>
          <FormGroup>
            <FormLabel>주소</FormLabel>
            <FormControl
              type="text"
              value={zipCode}
              placeholder="우편번호"
              readOnly
            />
            <FormControl
              type="text"
              value={address}
              placeholder="주소를 입력하세요"
              autoComplete="address-line1"
              readOnly
            />
            <FormControl
              type="text"
              value={addressDetail}
              placeholder="상세주소를 입력하세요"
              onChange={(e) => setAddressDetail(e.target.value)}
            />
            <Button onClick={handleSearchAddress}>주소 검색</Button>
          </FormGroup>
        </div>
        <div>
          <Button onClick={handleSignUpClick} disabled={disabled}>
            가입
          </Button>
        </div>
      </Col>
    </Row>
  );
}
