import { Col, Pagination, Row, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";

export function MemberList() {
  const [memberList, setMemberList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    axios
      .get(`/api/member/list?${searchParams}`)
      .then((res) => {
        console.log("res.data" + res.data);
        setMemberList(res.data.memberList);
        setPageInfo(res.data.pageInfo);
      })
      .catch((err) => {
        console.log("잘 안될 때");
      })
      .finally(() => {
        console.log("항상");
      });
  }, [searchParams]);

  const pageNumber = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumber.push(i);
  }

  function handlePageNumberClick(pageNumber) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", pageNumber);
    setSearchParams(nextSearchParams);
  }

  return (
    <>
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
      {/* 페이지 네이션 */}
      <Row>
        <Col>
          <Pagination>
            <Pagination.First
              onClick={() => handlePageNumberClick(1)}
            ></Pagination.First>
            <Pagination.Prev
              onClick={() =>
                handlePageNumberClick(pageInfo.leftPageNumber - 10)
              }
            ></Pagination.Prev>
            {pageNumber.map((pageNumber) => (
              <Pagination.Item
                key={pageNumber}
                onClick={() => handlePageNumberClick(pageNumber)}
                active={pageInfo.currentPageNumber == pageNumber}
              >
                {pageNumber}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() =>
                handlePageNumberClick(pageInfo.rightPageNumber + 1)
              }
            ></Pagination.Next>
            <Pagination.Last
              onClick={() => handlePageNumberClick(pageInfo.totalPages)}
            ></Pagination.Last>
          </Pagination>
        </Col>
      </Row>
    </>
  );
}
