import NavBar from "./NavBar/NavBar.jsx";
import { Outlet, useLocation } from "react-router";
import { useContext, useEffect, useRef, useState } from "react";
import Footer from "./Footer/Footer.jsx";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { AuthenticationContext } from "./AuthenticationContextProvider.jsx";
import { Button } from "react-bootstrap";

const WS_PATH = "/ws-chat";

function Main() {
  const { user, isAdmin } = useContext(AuthenticationContext);
  const location = useLocation();
  const clientRef = useRef(null); // STOMP 인스턴스 담아 둘 상자
  const [target, setTarget] = useState(""); //수신자 id
  const [text, setText] = useState(""); // 보낼 텍스트

  const hideFooter = location.pathname === "/";
  useEffect(() => {
    return () => {
      document.body.style.overflow = "auto"; // 페이지 떠날 땐 항상 복구
    };
  }, []);

  useEffect(() => {
    if (!user?.name) return;

    console.log(user);
    const client = new Client({
      // webSocketFactory: () => new SockJS(WS_PATH), // SockJS 연결
      webSocketFactory: () => {
        const token = localStorage.getItem("token");
        console.log("token : ", token);
        console.log("WS_PATH : ", WS_PATH);
        const url = token
          ? `${WS_PATH}?Authorization=Bearer%20${token}`
          : WS_PATH;
        return new SockJS(url);
      },
      debug: (str) => console.log("[STOMP]", str),
      reconnectDelay: 5000, // 끊기면 5초후 재연결
      connectHeaders: {
        username: user.name,
      },
    });

    client.onConnect = (frame) => {
      console.log("연결됨!", frame);
      client.subscribe("/user/queue/alert", (message) => {
        // 서버의 json 메시지를 파싱해서 msgs 배열에 추가
        // setMsgs((prev) => [...prev, JSON.parse(message.body)]);
        console.log(JSON.parse(message.body));
      });
    };
    // 연결 활성화(connect 시도)
    client.activate();
    // 훅 박에서도 쓰기 위해 ref에 저장
    clientRef.current = client;

    return () => {
      if (client.connected) {
        client.disconnect();
      }
    };
  }, [user && user.name]);

  const sendMessage = () => {
    if (!text.trim()) return; // 값 업승면 그냥 반환
    // 보낼 메시지 객체
    const chatMsg = { from: user.name, to: target, message: text };
    // SEND_DEST로 파일 전송

    clientRef.current.publish({
      destination: "/app/chat/alert",
      body: JSON.stringify(chatMsg),
    });
    setText(""); // 입력창 초기화
  };

  return (
    <>
      <NavBar />
      <div style={{ paddingTop: "80px" }}></div>
      <input
        placeholder="상대방 아이디"
        value={target}
        onChange={(e) => setTarget(e.target.value)}
        style={{ marginRight: 10 }}
      />
      <input
        placeholder="메시지 입력"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        style={{ width: "40%", marginRight: 10 }}
      />
      <button className="btn btn-primary" onClick={sendMessage}>
        전송
      </button>
      <Outlet />
      {!hideFooter && <Footer />}
    </>
  );
}

export default Main;
