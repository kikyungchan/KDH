import {
  Button,
  ButtonGroup,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  Pagination,
  Row,
  Spinner,
  Table,
  ToggleButton,
} from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthenticationContext } from "../common/AuthenticationContextProvider.jsx";

export function FaQList() {
  const { user, isAdmin } = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const [pageInfo, setPageInfo] = useState(null);
  const [faqList, setFaQList] = useState(null);
  const [modalShow, setModalShow] = useState();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
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
        setFaQList(res.data.faqList);
        setPageInfo(res.data.pageInfo);
        console.log("data", res.data);
        console.log("faqList", faqList);
      })
      .catch((err) => {
        console.log(err.data);
      })
      .finally(() => {});
    console.log("user : ", user);
    console.log("user is null : ", user == null);
    console.log("isAdmin1 : ", isAdmin && true);
    console.log("isAdmin2 : ", user !== null && isAdmin);
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

  function handleSaveButtonClick() {
    axios
      .post("/api/faq/add", {
        question: title,
        answer: content,
      })
      .then((res) => {
        console.log("success");
        const message = res.data.message;
        if (message) {
          toast(message.text, { type: message.type });
        }
      })
      .catch((err) => {
        console.log("err");
        const message = err.response.data.message;
        if (message) {
          toast(message.text, { type: message.type });
        }
      })
      .finally(() => {
        console.log("always");
      });
  }

  return (
    <>
      <Row className="justify-content-center">
        <Col md={8} lg={6} className="mt-5">
          <div className="container">
            <h2 className="mb-4">자주 묻는 질문</h2>
            <div>
              <ButtonGroup>
                {radios.map((radio, idx) => (
                  <ToggleButton
                    key={idx}
                    id={`radio-${idx}`}
                    type="radio"
                    variant="outline-primary"
                    name="radio"
                    value={radio.value}
                    checked={idx === 2}
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
                    <th style={{ width: "270px" }}>질문</th>
                    <th
                      className="d-none d-md-table-cell"
                      style={{ width: "100px" }}
                    >
                      답변
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
                  {faqList.map((faq) => (
                    <tr
                      key={faq.id}
                      style={{ cursor: "pointer" }}
                      // onClick={() => handleTableRowClick(question.id)}
                    >
                      <td>{faq.id}</td>
                      {/*<td>{STATUS_TEXT[question.status] || ""}</td>*/}
                      <td>
                        <div className="d-flex gap-2">
                          <span>{faq.question}</span>
                        </div>
                      </td>
                      <td className="d-none d-md-table-cell">{faq.answer}</td>
                      <td className="d-none d-lg-table-cell">{faq.timesAgo}</td>
                      <td className="d-none d-lg-table-cell">
                        {faq.timesAgo2}
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
            {/*todo : 관리자인지 여부 확인*/}
            {isAdmin && (
              <Button className="btn-primary" onClick={setModalShow}>
                등록하기
              </Button>
            )}
          </div>
        </Col>
        {/*  todo : admin 확인되면 modal 띄워서 자주 묻는 질문 CUD 할 수 있게 기능 추가*/}

        <Modal show={modalShow}>
          <Modal.Header>
            <Modal.Title>FaQ 등록</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup controlId="title">
              <FormLabel>faq 질문</FormLabel>
              <FormControl
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></FormControl>
            </FormGroup>
            <FormGroup controlId="content">
              <FormLabel>faq 답변</FormLabel>
              <FormControl
                as="textarea"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></FormControl>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-dark" onClick={() => setModalShow(false)}>
              취소
            </Button>
            <Button variant="primary" onClick={handleSaveButtonClick}>
              등록
            </Button>
          </Modal.Footer>
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
