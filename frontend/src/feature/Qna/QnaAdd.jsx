import {
  Button,
  ButtonGroup,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  ToggleButton,
} from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
// import { useForm } from "react-hook-form";

// import { AuthenticationContext } from "../../common/AuthenticationContextProvider.jsx";

export function QnaAdd() {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [board, setBoard] = useState("");
  const [content, setContent] = useState("");
  // const { user } = useContext(AuthenticationContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [radioValue, setRadioValue] = useState("1");
  const categoryRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const radios = [
    { name: "상품문의", value: "상품문의" },
    { name: "상담내역", value: "상담내역" },
  ];
  const {
    register,
    handleSubmit,
    formState: { errors },
    // watch,
  } = useForm({
    mode: "onSubmit",
    shouldFocusError: true,
  });

  const onSubmit = (data) => {
    console.log("제출된 데이터:", data);
    alert("상담유형이 성공적으로 제출되었습니다.");
  };

  useEffect(() => {
    console.log(category);
  }, [category]);

  function handleSaveButtonClick() {
    let validate = true;
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
    } else if (content.trim() === "") {
      toast("내용를 입력해 주세요", { type: "error" });
    }
  }

  // 작성자, 제목, 본문 썼는 지
  let validate = true;
  if (title.trim() === "") {
    validate = false;
  }
  if (content.trim() === "") {
    validate = false;
  }
  if (category.trim() === "" || category === "0") {
    validate = false;
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
                {errors.category && (
                  <Form.Control.Feedback type="invalid">
                    {errors.category.message}
                  </Form.Control.Feedback>
                )}
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
                <FormLabel>본문</FormLabel>
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
