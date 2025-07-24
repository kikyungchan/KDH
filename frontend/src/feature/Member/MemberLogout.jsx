import { Spinner } from "react-bootstrap";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export function MemberLogout() {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem("token");
    console.log("로그아웃 되었습니다.");
    navigate("/");
  }, []);
  return <Spinner />;
}
