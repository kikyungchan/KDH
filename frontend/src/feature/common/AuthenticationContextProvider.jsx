import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AuthenticationContext = createContext(null);

export function AuthenticationContextProvider({ children }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = jwtDecode(token);
      axios
        .get("/api/member?id=" + payload.sub)
        .then((res) => {
          setUser({
            id: res.data.id,
            loginId: res.data.loginId,
            name: res.data.name,
          });
        })
        .catch((err) => {})
        .finally(() => {});
    }
  }, []);

  // login
  function login(token) {
    localStorage.setItem("token", token);
    const payload = jwtDecode(token);
    axios.get("/api/member?id=" + payload.sub).then((res) => {
      setUser({
        id: res.data.id,
        loginId: res.data.loginId,
        name: res.data.name,
      });
    });
  }

  // logout
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  // hasAccess

  // isAdmin

  return (
    <AuthenticationContext value={{ user: user, login: login, logout: logout }}>
      {children}
    </AuthenticationContext>
  );
}

export { AuthenticationContext };
