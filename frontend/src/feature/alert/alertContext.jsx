// contexts/WebSocketContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
// import { toast } from "react-toastify";
import { toast } from "sonner";
import { AuthenticationContext } from "../common/AuthenticationContextProvider.jsx";
import axios from "axios";
import link from "daisyui/components/link/index.js";

const WebSocketContext = createContext();

export const AlertWebSocketProvider = ({ children }) => {
  const { user } = useContext(AuthenticationContext);
  const clientRef = useRef(null); // STOMP 인스턴스 담아 둘 상자
  const [alertCount, setAlertCount] = useState(0);
  const [target, setTarget] = useState(""); //수신자 id
  const [text, setText] = useState(""); // 보낼 텍스트
  const WS_PATH = "/ws-chat";

  useEffect(() => {
    if (!user?.name) return;
    const client = new Client({
      webSocketFactory: () => {
        const token = localStorage.getItem("token");
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
      client.subscribe("/user/queue/alert", (message) => {
        let msg = JSON.parse(message.body);
        // toast(`${msg.title} + ${msg.content}`);
        // toast(`${msg.content}`);
        toast(msg.title, {
          description: msg.content,
          action: {
            label: "이동", // 액션 버튼에 표시될 텍스트
            onClick: () => (location.href = msg.link),
          },
        });
        setAlertCount((cnt) => {
          return cnt + 1;
        });
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

  /*clientRef.current.publish({
    destination: "/app/chat/alert",
    body: JSON.stringify(chatMsg),
  });
  setText(""); // 입력창 초기화*/

  // 메시지 보내기 함수 (다른 컴포넌트에서 사용 가능)
  const sendMessage = (destination, message) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(message),
      });
    } else {
      console.error("WebSocket이 연결되지 않았습니다.");
    }
  };

  // 알림 메시지 보내기 함수
  const sendAlert = async (to, title, content, link) => {
    await axios.post("/api/alert/add", {
      user: to,
      title: title,
      content: content,
      link: link,
    });

    const chatMsg = {
      from: user?.name || "unknown",
      to,
      title,
      content,
    };
    sendMessage("/app/chat/alert", chatMsg);
  };

  // 간단한 알림 보내기
  const sendTestAlert = async () => {
    try {
      await axios.post("/api/alert/add", {
        user: "admin1",
        title: "제목",
        content: "내용",
        link: "/chat/chatting?rid=2222",
      });
    } catch (error) {
      console.error("DB 저장 실패:", error);
    }

    const chatMsg = {
      from: user?.name || "unknown",
      to: "admin1",
      title: "제목",
      content: "내용",
      link: "/chat/chatting?rid=2222",
    };
    sendMessage("/app/chat/alert", chatMsg);
  };
  // todo : admin 수정할 것
  // todo : 주문하기 전용 함수 만들어야하나?
  const sendOrderAlert = async (content, link) => {
    await axios
      .post("/api/alert/addOrder", {
        user: user.name,
        title: "주문이 완료되었습니다.",
        content: content,
        link: link,
      })
      .then((res) => {
        const chatMsg = {
          from: res.data.adminId,
          to: user.name,
          title: "주문이 완료되었습니다.",
          content,
        };
        const chatMsg2 = {
          from: user.name,
          to: res.data.adminId,
          title: "새로운 주문이 들어왔습니다.",
          content,
        };
        sendMessage("/app/chat/alert", chatMsg);
        sendMessage("/app/chat/alert", chatMsg2);
      });
  };

  const sendChatAlert = async (link) => {
    await axios.post("/api/alert/add", {
      user: "admin1",
      title: "1:1 상담 문의",
      content: "1:1 상담 문의가 들어왔습니다",
      link: link,
    });
    const chatMsg = {
      from: user?.name || "unknown",
      to: "admin1",
      title: "1:1 상담 문의",
      content: "1:1 상담 문의가 들어왔습니다",
      link: link,
    };
    sendMessage("/app/chat/alert", chatMsg);
  };

  const value = {
    alertCount,
    setAlertCount,
    sendMessage,
    sendAlert,
    sendOrderAlert,
    sendChatAlert,
    sendTestAlert,
    isConnected: clientRef.current?.connected || false,
    clientRef: clientRef.current,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useAlertWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error(
      "useWebSocket은 AlertWebSocketProvider 안에서 사용해야 합니다",
    );
  }
  return context;
};
