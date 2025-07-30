import { Card, Col, Container, Pagination, Row, Table } from "react-bootstrap";
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
  console.log("pageInfo : ", pageInfo);
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
      <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
        <Container className="py-4">
          <Row className="mb-4">
            <Col>
              <h2 className="text-center">회원목록</h2>
            </Col>
          </Row>
          <div>
            <Row>
              <Col>
                <Card className="shadow">
                  <Card.Body>
                    <Table
                      hover
                      responsive
                      className="mb-0 text-center align-middle"
                    >
                      <thead className="thead-light">
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
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            {/* 페이지 네이션 */}
            <Row className="mt-4">
              <Col>
                <Pagination className="justify-content-center">
                  <Pagination.First
                    disabled={pageInfo.currentPageNumber === 1}
                    onClick={() => handlePageNumberClick(1)}
                  ></Pagination.First>
                  <Pagination.Prev
                    disabled={pageInfo.leftPageNumber <= 1}
                    onClick={() =>
                      handlePageNumberClick(pageInfo.leftPageNumber - 10)
                    }
                  ></Pagination.Prev>
                  {pageNumber.map((pageNumber) => (
                    <Pagination.Item
                      key={pageNumber}
                      onClick={() => handlePageNumberClick(pageNumber)}
                      active={pageInfo.currentPageNumber === pageNumber}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    disabled={pageInfo.rightPageNumber >= pageInfo.totalPages}
                    onClick={() =>
                      handlePageNumberClick(pageInfo.rightPageNumber + 1)
                    }
                  ></Pagination.Next>
                  <Pagination.Last
                    disabled={
                      pageInfo.currentPageNumber === pageInfo.totalPages
                    }
                    onClick={() => handlePageNumberClick(pageInfo.totalPages)}
                  ></Pagination.Last>
                </Pagination>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
}
