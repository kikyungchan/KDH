import { Col, Row, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

export function MemberList() {
  const [memberList, setMemberList] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/member/list")
      .then((res) => {
        console.log("res.data" + res.data);
        setMemberList(res.data);
      })
      .catch((err) => {
        console.log("잘 안될 때");
      })
      .finally(() => {
        console.log("항상");
      });
  }, []);
  return (
    <Row>
      <Col>
        <h2>회원목록</h2>
        <Table hover responsive>
          <thead>
            <tr>
              <th>회원번호</th>
              <th>아이디</th>
              <th>이름</th>
              <th>전화번호</th>
              <th>이메일</th>
            </tr>
          </thead>
          <tbody>
            {memberList.map((member) => (
              <tr
                key={member.id}
                onClick={() => navigate(`/member?id=${member.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{member.id}</td>
                <td>{member.loginId}</td>
                <td>{member.name}</td>
                <td>{member.phone}</td>
                <td>{member.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Col>
    </Row>
  );
}
