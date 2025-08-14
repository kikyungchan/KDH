import { useNavigate, useSearchParams } from "react-router";
import { useEffect } from "react";
import { toast } from "react-toastify";

export function FailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  useEffect(() => {
    // toast(searchParams.get("message"), { type: "error" });
    if (window.opener) {
      console.log(searchParams);
      window.opener.postMessage(
        {
          type: "PAY_FAIL",
          data: searchParams,
        },
        window.location.origin,
      );
      setTimeout(() => window.close(), 300);
    }
  }, []);

  return (
    <div className="result wrapper">
      <div className="box_section">
        <h2>결제 실패</h2>
        <p>{`에러 코드: ${searchParams.get("code")}`}</p>
        <p>{`실패 사유: ${searchParams.get("message")}`}</p>
      </div>
    </div>
  );
}
