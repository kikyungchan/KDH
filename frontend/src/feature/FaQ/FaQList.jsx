import {
  Accordion,
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
import "./faqList.css";

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
    return <span className="loading loading-spinner"></span>;
  }

  // todo : 백엔드도 text형으로 바꾸기
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
        window.location.reload();
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
        <Col md={8} lg={9} className="mt-5">
          <div className="container">
            <h2 className="mb-4">자주 묻는 질문</h2>
            <div>
              <ButtonGroup>
                {radios.map((radio, idx) => (
                  <input
                    key={idx}
                    className="btn btn-outline"
                    type="radio"
                    name="바로가기"
                    aria-label={radio.name}
                    value={radio.value}
                    checked={idx === 2}
                    onClick={radio.fnc}
                  />
                ))}
              </ButtonGroup>
            </div>
            <br />
            {faqList.length > 0 ? (
              <>
                {faqList.map((faq) => (
                  <div className="collapse collapse-plus bg-base-100 border border-base-300">
                    <input type="checkbox" name="faqlist" />
                    <div className="collapse-title font-semibold">
                      {faq.question}
                    </div>
                    <div className="collapse-content text-sm">{faq.answer}</div>
                  </div>
                ))}
              </>
            ) : (
              <p>
                작성된 글이 없습니다. <br />새 글을 작성해 보세요.
              </p>
            )}
          </div>
          <br />
          <div>
            {/*todo : 관리자인지 여부 확인*/}
            {isAdmin && (
              // <Button className="btn-primary" onClick={setModalShow}>
              //   등록하기
              // </Button>
              <button
                className="btn btn-accent"
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              >
                등록하기
              </button>
            )}
          </div>
        </Col>
        {/*  todo : admin 확인되면 modal 띄워서 자주 묻는 질문 CUD 할 수 있게 기능 추가*/}

        {/*<Modal show={modalShow}>
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
        </Modal>*/}

        <dialog id="my_modal_1" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">FaQ 등록</h3>
            <br />
            <fieldset className="fieldset">
              <legend className="fieldset-legend">faq 질문</legend>
              <textarea
                className="textarea h-24 w-full"
                placeholder="질문을 입력해주세요"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              ></textarea>
            </fieldset>
            <fieldset className="fieldset">
              <legend className="fieldset-legend">faq 답변</legend>
              <textarea
                className="textarea h-24 w-full"
                placeholder="답변을 입력해주세요"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              ></textarea>
            </fieldset>
            <div className="modal-action">
              <button
                className="btn mx-1 btn-accent"
                onClick={handleSaveButtonClick}
              >
                등록
              </button>
              <form method="dialog">
                <button className="btn mx-1 btn-default">취소</button>
              </form>
            </div>
          </div>
        </dialog>
      </Row>
      <div className="my-3 flex justify-center">
        <div className="join">
          {/* First Page */}
          <button
            className="join-item btn"
            disabled={pageInfo.currentPageNumber === 1}
            onClick={() => handlePageNumberClick(1)}
          >
            «
          </button>

          {/* Previous Page */}
          <button
            className="join-item btn"
            disabled={pageInfo.leftPageNumber <= 1}
            onClick={() => handlePageNumberClick(pageInfo.leftPageNumber - 10)}
          >
            ‹
          </button>

          {/* Page Numbers */}
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              className={
                pageInfo.currentPageNumber === pageNumber
                  ? "join-item btn btn-active"
                  : "join-item btn"
              }
              onClick={() => handlePageNumberClick(pageNumber)}
            >
              {pageNumber}
            </button>
          ))}

          {/* Next Page */}
          <button
            className="join-item btn"
            disabled={pageInfo.rightPageNumber >= pageInfo.totalPages}
            onClick={() => handlePageNumberClick(pageInfo.rightPageNumber + 1)}
          >
            ›
          </button>

          {/* Last Page */}
          <button
            className="join-item btn"
            disabled={pageInfo.currentPageNumber === pageInfo.totalPages}
            onClick={() => handlePageNumberClick(pageInfo.totalPages)}
          >
            »
          </button>
        </div>
      </div>
    </>
  );
}
