import { useContext, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { AuthenticationContext } from "../common/AuthenticationContextProvider.jsx";
import { Col, Row } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

const WS_URL = "http://localhost:8080/ws-chat";
const WS_PATH = "/ws-chat";
const SEND_DEST = "/app/chat/private";
const SEND_DEST_GROUP = "/topic/chat/";
const SUBSCRIBE_DEST = "/user/queue/messages";

export function Chat() {
  const { user, isAdmin } = useContext(AuthenticationContext);
  const [target, setTarget] = useState(""); //수신자 id
  const [text, setText] = useState(""); // 보낼 텍스트
  const [msgs, setMsgs] = useState([]); // 주고 받은 메시지들
  const [roomUsers, setRoomUsers] = useState([]); // 현재 방의 접속자들1
  const [count, setCount] = useState(0);
  const clientRef = useRef(null); // STOMP 인스턴스 담아 둘 상자
  const effectRan = useRef(false);
  // const roomId = uuidv4();
  const roomId = "2222";

  useEffect(() => {
    console.log("chat user : ", user);
    console.log("username : ", user?.name);
    if (user?.name) {
      // 두번 실행 막기
      if (user?.name && !effectRan.current) {
        console.log("name2 : ", user.name);
        setCount(count + 1);
        console.log("count : ", count);

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
          // 연결 성공 시
          console.log("연결됨!", frame);
          client.subscribe(SUBSCRIBE_DEST, (message) => {
            // 서버의 json 메시지를 파싱해서 msgs 배열에 추가
            setMsgs((prev) => [...prev, JSON.parse(message.body)]);
          });

          client.subscribe(`/topic/chat/${roomId}`, (message) => {
            const data = JSON.parse(message.body);
            console.log("📨 방 메시지 받음:", data);
            if (data.type === "CHAT") {
              setMsgs((prev) => [...prev, JSON.parse(message.body)]);
            } else if (data.type === "ENTER") {
              console.log(`roomId : ${roomId}`);
              if (data.currentUsers) {
                setRoomUsers(data.currentUsers);
              }
              // 입장 메시지도 채팅창에 표시
              setMsgs((prev) => [
                ...prev,
                {
                  from: "SYSTEM",
                  message: data.message,
                  timestamp: data.timestamp,
                  type: "SYSTEM",
                },
              ]);
            } else if (
              data.type === "LEAVE" ||
              data.type === "USER_DISCONNECTED"
            ) {
              if (data.currentUsers) {
                setRoomUsers(data.currentUsers);
              }
              // 퇴장 메시지도 채팅창에 표시
              setMsgs((prev) => [
                ...prev,
                {
                  from: "SYSTEM",
                  message: data.message,
                  timestamp: data.timestamp,
                  type: "SYSTEM",
                },
              ]);
            }
          });

          client.publish({
            destination: "/app/chat/enter", // 서버의 MessageMapping 경로
            body: JSON.stringify({
              from: user.name, // 내 이름
              roomId: roomId, // 방 id (props, params 등에서 받아와야 함)
              type: "ENTER", // 필요하다면 type도 함께
              // 필요하면 다른 필드도 추가
            }),
          });
        };

        client.onDisconnect = () => {
          console.log("서버 연결이 끊어졌습니다");
        };

        // 연결 활성화(connect 시도)
        client.activate();
        // 훅 박에서도 쓰기 위해 ref에 저장
        clientRef.current = client;

        // 언마운트 될 때
        return () => {
          if (client && client.connected) {
            client.publish({
              destination: "/app/chat/leave", // 서버 MessageMapping 경로
              body: JSON.stringify({
                from: user.name,
                roomId: roomId,
                type: "LEAVE", // 서버 DTO와 맞추기!
              }),
            });
          }
          client.deactivate(); //연결 해제
        };
      }
    }
  }, [user]);

  function handleChattingOutClick() {
    if (clientRef.current && clientRef.current.connected) {
      clientRef.current.publish({
        destination: "/app/chat/leave", // 서버 MessageMapping 경로
        body: JSON.stringify({
          from: user.name,
          roomId: roomId,
          type: "LEAVE", // 서버 DTO와 맞추기!
        }),
      });
    }
    clientRef.current.deactivate(); //연결 해제
  }

  const sendMessage = () => {
    if (!text.trim()) return; // 값 업승면 그냥 반환
    // 보낼 메시지 객체
    const chatMsg = { from: user.name, to: target, message: text };
    // SEND_DEST로 파일 전송

    clientRef.current.publish({
      destination: SEND_DEST,
      body: JSON.stringify(chatMsg),
    });
    // setMsgs((prev) => [...prev, chatMsg]);
    setText(""); // 입력창 초기화
  };

  const sendGroupMessage = () => {
    if (!text.trim()) return;
    const chatMsg = {
      from: user.name,
      to: target,
      message: text,
      type: "CHAT",
    };
    clientRef.current.publish({
      destination: SEND_DEST_GROUP + roomId,
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
            {/*<h2>1:1 상담 ({user.name})</h2>*/}

            {/*채팅 로그*/}
            <div className="border rounded-lg border-gray-200  h-150 overflow-y-auto mb-2.5">
              <div className="chat chat-head border-b p-2.5 border-gray-200">
                <h2>1:1 상담 서비스</h2>
              </div>
              <div className="chat chat-main p-2.5 ">
                {/*더미 div*/}
                {/*삭제 x */}
                <div className="chat chat-start"></div>
                <div className="chat chat-end"></div>
                {msgs.map((m, i) =>
                  m.type == "CHAT" ? (
                    <div
                      key={i}
                      className={`chat chat-${user.name == m.from ? "end" : "start"}`}
                    >
                      <div className="chat-header">{m.from}</div>
                      <div className="chat-bubble">{m.message}</div>
                    </div>
                  ) : (
                    <div className="flex w-full flex-col">
                      <div className="divider border-gray-200 text-gray-400 text-xs">
                        {m.message}
                      </div>
                    </div>
                  ),
                )}
              </div>
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
            <button
              className={"btn btn-outline btn-primary"}
              onClick={sendMessage}
            >
              전송
            </button>
            <button
              className={"btn btn-outline btn-primary"}
              onClick={sendGroupMessage}
            >
              그룹 전송
            </button>
            {clientRef.current && (
              <button
                className={"btn btn-outline btn-primary"}
                onClick={() => handleChattingOutClick()}
              >
                연결 해제
              </button>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}
