import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
// import { Stomp } from "stompjs";

const WS_URL = "http://localhost:8080/ws-chat";
const SEND_DEST = "/app/chat/private";
const SUBSCRIBE_DEST = "/user/queue/messages";

export function Chat({ username }) {
  const [target, setTarget] = useState("");
  const [text, setText] = useState("");
  const [msgs, setMsgs] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
    });
    client.onConnect = () => {
      client.subscribe(SUBSCRIBE_DEST, (message) => {
        setMsgs((prev) => [...prev, JSON.parse(message.body)]);
      });
    };
    client.activate();
    clientRef.current = client;
    console.log("연결됨!");
    return () => {
      client.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (!text.trim()) return;
    const chatMsg = { from: username, content: text };
    clientRef.current.publish({
      destination: SEND_DEST,
      body: JSON.stringify(chatMsg),
    });
    setText("");
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h4>1:1 상담 ({username})</h4>
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
          <div
            key={i}
            style={{
              textAlign: m.from === username ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <strong>{m.from}:</strong> {m.content}
          </div>
        ))}
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
  );
}
