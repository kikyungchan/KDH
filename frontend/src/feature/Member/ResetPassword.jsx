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
      .then(() => {
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
    <div className="page-wrapper">
      <div className="center-top-container">
        <div className="w-full max-w-[400px]">
          <div className="rounded-card">
            <div>
              <div>
                <h3 className="text-center text-xl font-bold mb-3">
                  비밀번호 재설정
                </h3>
                <label
                  htmlFor="newPassword"
                  className="block text-sm ml-1 mb-2"
                >
                  비밀번호는 영문+숫자 조합, 8~20자 사이로 입력해주세요.
                </label>
                <input
                  type="password"
                  value={password}
                  id="newPassword"
                  placeholder="비밀번호"
                  onChange={(e) => setPassword(e.target.value)}
                  className={`input input-bordered w-full ${
                    isSubmitted && !passwordValid ? "border-red-500" : ""
                  }`}
                />
                {isSubmitted && !passwordValid && (
                  <p
                    className="ml-1"
                    style={{ color: "red", fontSize: "0.875rem" }}
                  >
                    유효한 비밀번호 형식이 아닙니다.
                  </p>
                )}
              </div>

              <div className="form-control mb-4 mt-4">
                <label
                  htmlFor="passwordCheck"
                  className="block text-sm ml-1 mb-2"
                >
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  id="passwordCheck"
                  className={`input input-bordered w-full ${
                    !passwordConfirm ? "border-red-500" : ""
                  }`}
                  value={password2}
                  placeholder="비밀번호 확인"
                  onChange={(e) => setPassword2(e.target.value)}
                />
                {passwordConfirm || (
                  <p
                    className="ml-1"
                    style={{ color: "red", fontSize: "0.875rem" }}
                  >
                    비밀번호가 일치하지 않습니다.
                  </p>
                )}
              </div>
              <div className="text-end mt-2">
                <div>
                  <button
                    className="btn btn-sm btn-neutral mt-2 me-2"
                    onClick={handleChangePasswordButton}
                    disabled={
                      changePasswordButtonDisabled || isPasswordProcessing
                    }
                  >
                    {isPasswordProcessing ? (
                      <>
                        <span className="loading loading-spinner loading-sm mr-2" />
                        저장 중...
                      </>
                    ) : (
                      "재설정"
                    )}
                  </button>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-neutral mt-2 me-2"
                    onClick={() => navigate("/")}
                  >
                    돌아가기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
