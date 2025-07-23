import { Chat } from "./chat/Chat.jsx";
import { BrowserRouter, Route, Routes } from "react-router";

123;

function App() {
  const username = prompt("닉네임을 입력해 주세요");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          {/*<Route index element={<BoardList />} />*/}
          <Route path="chat/chatting" element={<Chat username={username} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
