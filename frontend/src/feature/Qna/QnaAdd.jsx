import {
  Button,
  ButtonGroup,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Image,
  Row,
  ToggleButton,
} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router";

import { AuthenticationContext } from "../common/AuthenticationContextProvider.jsx";

export function QnaAdd() {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { user } = useContext(AuthenticationContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [radioValue, setRadioValue] = useState("1");
  const categoryRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const radios = [
    { name: "상품문의", value: "상품문의", selected: true },
    { name: "문의내역", value: "문의내역" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    console.log(category);
  }, [category]);

  useEffect(() => {
    console.log("user : ", user);
  }, []);

  function handleSaveButtonClick() {
    if (category.trim() === "" || category === "0") {
      toast("상담유형을 선택해 주세요", { type: "error" });
      if (categoryRef.current) {
        console.log("moved");
        categoryRef.current.scrollIntoView({
          behavior: "smooth", // 부드러운 스크롤 효과를 줍니다.
          block: "start", // 대상 요소의 상단이 뷰포트 상단에 오도록 정렬합니다. (options: 'start', 'center', 'end', 'nearest')
        });
      }
    } else if (title.trim() === "") {
      toast("제목을 입력해 주세요", { type: "error" });
      if (titleRef.current) {
        console.log("moved");
        titleRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else if (content.trim() === "") {
      toast("문의 내용를 입력해 주세요", { type: "error" });
      if (contentRef.current) {
        console.log("moved");
        contentRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    } else {
      setIsProcessing(true);
      console.log(title);
      console.log(content);
      console.log(category);
      console.log(user);
      axios
        .post("/api/qna/add", {
          title: title,
          content: content,
          category: category,
          username: user,
          productId: "0",
        })
        .then((res) => {
          const message = res.data.message;
          if (message) {
            toast(message.text, { type: message.type });
          }
          // navigate(-1);
          navigate("/");
        })
        .catch((err) => {
          console.log("잘 안되면 실행되는 코드");
          console.log(err);
          const message = err.response.data.message;

          if (message) {
            // toast 띄우기
            toast(message.text, { type: message.type });
          }
        })
        .finally(() => {
          console.log("항상 실행되는 코드");
          setIsProcessing(false);
        });
    }
  }

  /*if (!user) {
    return <Spinner />;
  }*/

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6} className="mt-5">
        <div className="container">
          <h2>1:1 상담 문의</h2>
          <div>
            {/*<Button disabled={true}>상담문의</Button>*/}
            {/*<Button>상담내역</Button>*/}
            <ButtonGroup>
              {radios.map((radio, idx) => (
                <ToggleButton
                  key={idx}
                  id={`radio-${idx}`}
                  type="radio"
                  variant={idx % 2 ? "outline-primary" : "outline-primary"}
                  name="radio"
                  value={radio.value}
                  checked={radioValue === radio.value}
                  onChange={(e) => setRadioValue(e.currentTarget.value)}
                >
                  {radio.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </div>
          <br />
          <div className="row">
            <div ref={categoryRef}>
              {/*<div>*/}

              <FormGroup className="mb-3" controlId="category1">
                <FormLabel>상담유형</FormLabel>
                <Form.Select
                  className="form-select"
                  aria-label="Default select example"
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option selected disabled hidden>
                    유형을 선택하세요
                  </option>
                  <option value="1">기능 관련</option>
                  <option value="2">크기·무게 관련</option>
                  <option value="3">배송 관련</option>
                  <option value="4">설정 관련</option>
                  <option value="5">반품·교환 관련</option>
                  <option value="6">기타 문의</option>
                </Form.Select>
              </FormGroup>
            </div>
            <br />
            <div>
              <FormGroup>
                <FormLabel>문의하실 상품</FormLabel>
                <div>
                  {/*상품 이미지*/}
                  <Image fluid style={{ width: 200, height: 200 }} />
                  <br />
                  <br />

                  {/*상품명*/}
                  <FormControl
                    // style={{ width: 50 }}
                    placeholder={"상품명"}
                    disabled={true}
                  />
                </div>
              </FormGroup>
            </div>
            <br />
            <div ref={titleRef}>
              <FormGroup>
                <FormLabel>제목</FormLabel>
                <FormControl
                  value={title}
                  placeholder="제목을 입력해 주세요"
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormGroup>
            </div>
            <div>
              <br />
            </div>
            <div ref={contentRef}>
              <FormGroup className="mb-3" controlId="content1">
                <FormLabel>문의 내용</FormLabel>
                <FormControl
                  as="textarea"
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </FormGroup>
            </div>
            <br />

            <div className="mb-3">
              <Button
                onClick={handleSaveButtonClick}
                // disabled={isProcessing || !validate}
                disabled={isProcessing}
              >
                등록
              </Button>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}
