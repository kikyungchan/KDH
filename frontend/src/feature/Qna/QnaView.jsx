import {
  Button,
  ButtonGroup,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Image,
  Modal,
  Row,
  ToggleButton,
} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { AuthenticationContext } from "../common/AuthenticationContextProvider.jsx";

export function QnaView() {
  const { user, isAdmin } = useContext(AuthenticationContext);
  const [searchParams, setSearchParams] = useSearchParams("");
  let params = useParams();
  const [category, setCategory] = useState("");
  const [productNm, setProductNm] = useState();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [price, setPrice] = useState();
  const [image, setImage] = useState();
  const [modalShow, setModalShow] = useState();
  // searchParams 사용으로 인해 id 굳이 필요할지 의문
  const [id, setId] = useState();
  const [loginId, setLoginId] = useState();
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
        console.log(res.data);
        console.log(res.data.userid);
        // user 값이 없음
        console.log(user);
        console.log(res.data.userid === user);
        setProductNm(res.data.product);
        setTitle(res.data.title);
        setContent(res.data.content);
        setPrice(res.data.price);
        setImage(res.data.imagePath);
        setCategory(res.data.category);
        setId(res.data.id);
        setLoginId(res.data.userid);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        console.log("always");
      });
  }, []);

  // todo : userid 와 user를 대조후 맞을 경우만 작동하게
  function handleDeleteButtonClick() {
    axios
      .delete(`/api/qna/${searchParams}`)
      .then((res) => {
        console.log("잘됨");

        const message = res.data.message;
        if (message) {
          toast(message.text, { type: message.type });
        }
      })
      .catch((err) => {
        console.log("안된");
        toast("게시물이 삭제되지 않았습니다.", { type: "warning" });
      })
      .finally(() => {
        console.log("항상");
      });
    return null;
  }

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6} className="mt-5">
        <div className="container">
          <h2 className="mb-4">문의 내역 상세</h2>
          <div className="row">
            <div>
              <FormGroup className="mb-3" controlId="category1">
                <FormLabel>상담유형</FormLabel>
                <FormControl
                  disabled={true}
                  aria-label="Default select example"
                  value={category === "" ? "" : categoryList[category].value}
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
                    src={image}
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
                  <FormControl disabled={true} placeholder={productNm} />
                  <h5 className="text-end fw-bold text-danger">
                    {/* toLocaleString() : 세자리수마다 쉼표로 보기 쉽게 표현*/}
                    {price && price.toLocaleString()}원
                  </h5>
                </div>
              </FormGroup>
            </div>
            <br />
            <br />
            <div>
              <FormGroup>
                <FormLabel>제목</FormLabel>
                <FormControl value={title} disabled={true} />
              </FormGroup>
            </div>
            <div>
              <br />
            </div>
            <div>
              <FormGroup className="mb-3" controlId="content1">
                <FormLabel>문의 내용</FormLabel>
                <FormControl as="textarea" rows={6} value={content} />
              </FormGroup>
            </div>
            <br />

            <div className="mb-3">
              {/*  todo : 로그인 시에도 user 값이 현재 없는 것으로 나오는데 이후 처리*/}
              {user === null && loginId === user && (
                <Button className="ms-2 btn-danger" onClick={setModalShow}>
                  삭제
                </Button>
              )}
              {/* todo : is Admin 여부에 따라 보임 관련 코드 수정될 시 즉시 수정할 것*/}
              {/* todo : 링크 연결 및 답변하기 페이지 만들어야 함*/}
              {user !== null && isAdmin && (
                <Button
                  className="ms-2 btn-primary"
                  href={`/qna/AnsAdd?id=${searchParams}`}
                >
                  답변하기
                </Button>
              )}
            </div>
          </div>
        </div>
      </Col>
      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>게시물 삭제 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>이 문의 내역을 삭제하시겠습니까?</Modal.Body>
        <Modal.Footer>
          <Button variant="outline-dark" onClick={() => setModalShow(false)}>
            취소
          </Button>
          <Button variant="danger" onClick={handleDeleteButtonClick}>
            삭제
          </Button>
        </Modal.Footer>
      </Modal>
    </Row>
  );
}
