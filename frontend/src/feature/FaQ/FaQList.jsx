import {
  Button,
  ButtonGroup,
  Col,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
  ToggleButton,
} from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";

export function FaQList() {
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState(null);
  const [faqList, setFaQList] = useState(null);
  const [modalShow, setModalShow] = useState();
  const [searchParams, setSearchParams] = useSearchParams("1");
  const radios = [
    { name: "상품목록", value: "1", fnc: handleQnaAddButtonClick },
    { name: "문의내역", value: "2", fnc: handleQnaListButtonClick },
    { name: "자주 묻는 질문", value: "3", fnc: handleFaQListButtonClick },
  ];

  useEffect(() => {
    axios
      .get(`/api/faq/list`)
      .then((res) => {
        setFaQList(res.data);
        setPageInfo(res.data.pageInfo);
        console.log("res.data : ", res.data);
        console.log("pageInfo : ", pageInfo);
        console.log("faqList : ", faqList);
      })
      .catch((err) => {})
      .finally(() => {});
  }, []);

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

  function handleQnaAddButtonClick() {
    navigate("/product/list");
  }

  function handleQnaListButtonClick() {
    navigate("/qna/list");
  }

  function handleFaQListButtonClick() {
    navigate("/faq/list");
  }

  // useState 안전장치
  if (!faqList) {
    return <Spinner />;
  }

  return (
    <>
      <Row className="justify-content-center">
        <Col md={8} lg={6} className="mt-5">
          <div className="container">
            <h2 className="mb-4">자주 묻는 질문</h2>
            <div>
              {/* todo : onclick 시 상품 질문 페이지로 넘어가게 */}
              <ButtonGroup>
                {radios.map((radio, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`radio-${idx}`}
                    type="radio"
                    variant="outline-primary"
                    name="radio"
                    value={radio.value}
                    checked={(idx = 3)}
                    // onChange={(e) => setRadioValue(e.currentTarget.value)}
                    onClick={radio.fnc}
                  >
                    {radio.name}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </div>
            <br />
            {faqList.length > 0 ? (
              <Table striped={true} hover={true}>
                <thead>
                  <tr>
                    <th style={{ width: "70px" }}>#</th>
                    {/*<th style={{ width: "120px" }}>답변여부</th>*/}
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
                  {faqList.map((question) => (
                    <tr
                      key={question.id}
                      style={{ cursor: "pointer" }}
                      // onClick={() => handleTableRowClick(question.id)}
                    >
                      <td>{question.id}</td>
                      {/*<td>{STATUS_TEXT[question.status] || ""}</td>*/}
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
          <div>
            <Button className="btn-primary" onClick={setModalShow}>
              등록하기
            </Button>
          </div>
        </Col>
        {/*  todo : admin 확인되면 modal 띄워서 자주 묻는 질문 CUD 할 수 있게 기능 추가*/}

        <Modal show={modalShow}>
          <Modal.Header>
            <Modal.Title>문의 등록</Modal.Title>
          </Modal.Header>
        </Modal>
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
