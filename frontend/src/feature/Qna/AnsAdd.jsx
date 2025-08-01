import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Image,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import axios from "axios";

import { useNavigate, useSearchParams } from "react-router";
import { AuthenticationContext } from "../common/AuthenticationContextProvider.jsx";
import { toast } from "react-toastify";

export function AnsAdd() {
  const [question, setQuestion] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams("");
  const [modalShow, setModalShow] = useState();
  const [answer, setAnswer] = useState();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const categoryList = {
    1: { value: "기능 관련" },
    2: { value: "크기·무게 관련" },
    3: { value: "배송 관련" },
    4: { value: "설정 관련" },
    5: { value: "반품·교환 관련" },
    6: { value: "기타 문의" },
  };

  useEffect(() => {
    axios
      .get(`/api/qna/view?${searchParams}`)
      .then((res) => {
        setQuestion(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        console.log("always");
      });
  }, []);

  if (!question) {
    return <Spinner />;
  }

  function handleAnswerButtonClick() {
    setIsProcessing(true);
    axios
      .post(`/api/qna/addAns`, {
        questionId: question.id,
        seller: question.userid,
        answer: answer,
      })
      .then((res) => {
        console.log("성공");
        const message = res.data.message;
        if (message) {
          toast(message.text, { type: message.type });
        }
        navigate("/qna/list");
      })
      .catch((err) => {
        console.log("오류");
        const message = err.response.data.message;
        if (message) {
          // toast 띄우기
          toast(message.text, { type: message.type });
        }
      })
      .finally(() => {
        console.log("always");
        setIsProcessing(false);
      });
  }

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6} className="mt-5">
        <div className="container">
          <h2 className="mb-4">문의 내역 상세</h2>
          <div className="row">
            <div>
              {/*<div>*/}

              <FormGroup className="mb-3" controlId="category1">
                <FormLabel>상담유형</FormLabel>
                <FormControl
                  disabled={true}
                  aria-label="Default select example"
                  value={categoryList[question.category].value}
                ></FormControl>
              </FormGroup>
            </div>
            <br />
            <div>
              <FormGroup>
                <FormLabel>문의하실 상품</FormLabel>
                <div>
                  {/*상품 이미지*/}
                  <Image
                    src={question.imagePath}
                    fluid
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                  <br />
                  <br />
                  {/*상품명*/}
                  <FormControl disabled={true} placeholder={question.product} />
                  <h5 className="text-end fw-bold text-danger">
                    {/* toLocaleString() : 세자리수마다 쉼표로 보기 쉽게 표현*/}
                    {question.price.toLocaleString()}원
                  </h5>
                </div>
              </FormGroup>
            </div>
            <br />
            <br />
            <div>
              <FormGroup>
                <FormLabel>제목</FormLabel>
                <FormControl
                  value={question.title}
                  disabled={true}
                  readOnly={true}
                />
              </FormGroup>
            </div>
            <div>
              <br />
            </div>
            <div>
              <FormGroup className="mb-3" controlId="content1">
                <FormLabel>문의 내용</FormLabel>
                <FormControl
                  as="textarea"
                  rows={6}
                  value={question.content}
                  readOnly={true}
                />
              </FormGroup>
            </div>
            <div>
              <FormGroup className="mb-3" controlId="content1">
                <FormLabel>답변 내용</FormLabel>
                <FormControl
                  as="textarea"
                  rows={6}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </FormGroup>
            </div>
            <br />
            <div className="mb-3">
              <Button className="ms-2 btn-primary" onClick={setModalShow}>
                답변 등록
              </Button>
            </div>
          </div>
        </div>
      </Col>
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>답변 등록 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          답변을 등록하면 수정할 수 없습니다. 등록하시겠습니까?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={() => setModalShow(false)}>
            취소
          </Button>
          <Button variant="primary" onClick={handleAnswerButtonClick}>
            답변완료
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}
