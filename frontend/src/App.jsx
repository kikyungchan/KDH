import { BrowserRouter, Route, Routes } from "react-router";
import { MemberList } from "./feature/Member/MemberList.jsx";
import { MemberAdd } from "./feature/Member/MemberAdd.jsx";
import { MemberDetail } from "./feature/Member/MemberDetail.jsx";
import { MemberEdit } from "./feature/Member/MemberEdit.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/member/edit" element={<MemberEdit />} />
        <Route path="/member/list" element={<MemberList />} />
        <Route path="/signup" element={<MemberAdd />} />
        <Route path="/member/" element={<MemberDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
