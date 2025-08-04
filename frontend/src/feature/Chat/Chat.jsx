import { useContext, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { AuthenticationContext } from "../common/AuthenticationContextProvider.jsx";
import { Col, Row } from "react-bootstrap";

const WS_URL = "http://localhost:8080/ws-chat";
const WS_PATH = "/ws-chat";
const SEND_DEST = "/app/chat/private";
const SUBSCRIBE_DEST = "/user/queue/messages";

export function Chat() {
  const { user, isAdmin } = useContext(AuthenticationContext);
  const [target, setTarget] = useState(""); //수신자 id
  const [text, setText] = useState(""); // 보낼 텍스트
  const [msgs, setMsgs] = useState([]); // 주고 받은 메시지들
  const clientRef = useRef(null); // STOMP 인스턴스 담아 둘 상자

  useEffect(() => {
    console.log("chat user : ", user);
    console.log("username : ", user?.name);
    if (user?.name) {
      console.log("name2 : ", user.name);
      // const name = prompt("닉네임을 입력해 주세요").trim();
      // console.log("name : ", user);

      const client = new Client({
        webSocketFactory: () => new SockJS(WS_PATH), // SockJS 연결
        debug: (str) => console.log("[STOMP]", str),
        reconnectDelay: 5000, // 끊기면 5초후 재연결
        connectHeaders: {
          username: user.name,
        },
      });
      client.onConnect = (frame) => {
        // 연결 성공 시
        console.log("연결됨!", frame);
        client.subscribe(SUBSCRIBE_DEST, (message) => {
          console.log("받음");
          console.log("message", message);
          // 서버의 json 메시지를 파싱해서 msgs 배열에 추가
          setMsgs((prev) => [...prev, JSON.parse(message.body)]);
          // const msg = JSON.parse(message);
          // setMsgs((prev) => [...prev, msg]);
        });
      };

      // 연결 활성화(connect 시도)
      client.activate();
      // 훅 박에서도 쓰기 위해 ref에 저장
      clientRef.current = client;

      // 언마운트 될 때
      return () => {
        client.deactivate(); //연결 해제
      };
    }
  }, [user]);

  const sendMessage = () => {
    if (!text.trim()) return; // 값 업승면 그냥 반환
    // 보낼 메시지 객체
    const chatMsg = { from: user.name, to: target, message: text };
    // SEND_DEST로 파일 전송
    clientRef.current.publish({
      destination: SEND_DEST,
      body: JSON.stringify(chatMsg),
    });
    setText(""); // 입력창 초기화
  };

  if (!user) {
    return <span className="loading loading-spinner"></span>;
  }

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <Row className="justify-content-center">
        <Col md={8} lg={9} className="mt-5">
          <div className="container">
            <h2>1:1 상담 ({user.name})</h2>

            {/*채팅 로그*/}
            <div
              style={{
                border: "1px solid #ddd",
                padding: 10,
                height: 300,
                overflowY: "auto",
                marginBottom: 10,
              }}
            >
              {msgs.map((m, i) => (
                <>
                  <div
                    className={`chat chat-${user.name == m.from ? "end" : "start"}`}
                  >
                    <div className="chat-image avatar">
                      <div className="w-10 rounded-full">
                        <img
                          alt="Tailwind CSS chat bubble component"
                          src="https://img.daisyui.com/images/profile/demo/kenobee@192.webp"
                        />
                      </div>
                    </div>
                    <div className="chat-header">
                      {m.from}님
                      <time className="text-xs opacity-50">12:45</time>
                    </div>
                    <div className="chat-bubble">
                      {/*<strong>{m.from}:</strong> */}
                      {m.message}
                    </div>
                    {/*<div className="chat-footer opacity-50">Delivered</di>v*/}
                  </div>
                </>
              ))}
            </div>
            <div>
              <span>
                테스트 하시려면 해당 창이랑 새 창 모두 상대방 아이디에 guest22
                입력 후 테스트 하시면 됩니다
              </span>
            </div>
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
            <button onClick={sendMessage}>전송</button>
          </div>
        </Col>
      </Row>
    </div>
  );
}
