import { Chat } from "./chat/Chat.jsx";

function App() {
  const username = prompt("닉네임을 입력해 주세요");
  return (
    <>
      <div>
        frontend
        <Chat username={username} />
      </div>
    </>
  );
}

export default App;
