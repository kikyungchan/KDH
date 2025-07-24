import { Spinner } from "react-bootstrap";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthenticationContext } from "../common/AuthenticationContextProvider.jsx";

export function MemberLogout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthenticationContext);
  useEffect(() => {
    logout();

    console.log("로그아웃 되었습니다.");
    navigate("/");
  }, []);
  return <Spinner />;
}
