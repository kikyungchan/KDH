import {
  Badge,
  ButtonGroup,
  Col,
  Pagination,
  Row,
  Spinner,
  Table,
  ToggleButton,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router";
import { FaRegComments, FaRegImages } from "react-icons/fa";

export function QnaList() {
  const [questionList, setQuestionList] = useState(null);
  const [pageInfo, setPageInfo] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams("1");
  const navigate = useNavigate();
  const STATUS_TEXT = {
    open: "대기중",
    answered: "답변완료",
    closed: "종료",
  };
  const radios = [
    { name: "상품목록", value: "1", checked: true },
    { name: "문의내역", value: "2" },
  ];

  useEffect(() => {
    axios
      .get(`/api/qna/list?${searchParams}`)
      .then((res) => {
        console.log("잘 될 때 코드");
        setQuestionList(res.data.questionList);
        setPageInfo(res.data.pageInfo);
      })
      .catch((err) => {
        console.log("잘 안될 때 코드");
      })
      .finally(() => {
        console.log("항상 실행 코드");
      });
  }, [searchParams]);

  function handleTableRowClick(id) {
    // 게시물 보기로 이동
    navigate(`/qna/view?id=${id}`);
  }

  const pageNumbers = [];
  if (pageInfo) {
    for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
      pageNumbers.push(i);
    }
  }

  function handlePageNumberClick(pageNumber) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("p", pageNumber);
    setSearchParams(nextSearchParams);
  }

  // useState 안전장치
  if (!questionList) {
    return <Spinner />;
  }

  function handleQnaAddButtonClick() {
    navigate("/product/list");
  }

  return (
    <>
      <Row className="justify-content-center">
        <Col md={8} lg={6} className="mt-5">
          <div className="container">
            <h2 className="mb-4">문의 내역</h2>
            <div>
              {/* todo : onclick 시 상품 질문 페이지로 넘어가게 */}
              <ButtonGroup>
                {radios.map((radio, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`radio-${idx}`}
                    type="radio"
                    variant={idx % 2 ? "outline-primary" : "outline-primary"}
                    name="radio"
                    value={radio.value}
                    checked={idx % 2 ? true : false}
                    // onChange={(e) => setRadioValue(e.currentTarget.value)}
                    onClick={
                      radio.value === "1" ? handleQnaAddButtonClick : null
                    }
                  >
                    {radio.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </div>
            <br />
            {questionList.length > 0 ? (
              <Table striped={true} hover={true}>
                <thead>
                  <tr>
                    <th style={{ width: "70px" }}>#</th>
                    <th style={{ width: "120px" }}>답변여부</th>
                    <th style={{ width: "270px" }}>제목</th>
                    <th
                      className="d-none d-md-table-cell"
                      style={{ width: "100px" }}
                    >
                      작성자
                    </th>
                    <th
                      className="d-none d-lg-table-cell"
                      style={{ width: "140px" }}
                    >
                      작성일시
                    </th>
                    <th
                      className="d-none d-lg-table-cell"
                      style={{ width: "140px" }}
                    >
                      수정일시
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {questionList.map((question) => (
                    <tr
                      key={question.id}
                      style={{ cursor: "pointer" }}
                      onClick={() => handleTableRowClick(question.id)}
                    >
                      <td>{question.id}</td>
                      <td>{STATUS_TEXT[question.status] || ""}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <span>{question.title}</span>
                        </div>
                      </td>
                      <td className="d-none d-md-table-cell">
                        {question.name}
                      </td>
                      <td className="d-none d-lg-table-cell">
                        {question.timesAgo}
                      </td>
                      <td className="d-none d-lg-table-cell">
                        {question.timesAgo2}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>
                작성된 글이 없습니다. <br />새 글을 작성해 보세요.
              </p>
            )}
          </div>
        </Col>
      </Row>
      <Row className="my-3">
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
            {pageNumbers.map((pageNumber) => (
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
              disabled={pageInfo.currentPageNumber === pageInfo.totalPages}
              onClick={() => handlePageNumberClick(pageInfo.totalPages)}
            ></Pagination.Last>
          </Pagination>
        </Col>
      </Row>
    </>
  );
}
