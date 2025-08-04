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
import axios from "axios";
import { useNavigate, useParams } from "react-router";

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
  const [productId, setProductId] = useState(0);
  const [productPrice, setProductPrice] = useState(null);
  const [productName, setProductName] = useState(null);
  const [image, setImage] = useState();
  const radios = [
    { name: "상품목록", value: "1", fnc: handleQnaAddButtonClick },
    { name: "문의내역", value: "2", fnc: handleQnaListButtonClick },
    { name: "자주 묻는 질문", value: "3", fnc: handleFaQListButtonClick },
  ];
  let params = useParams();
  const navigate = useNavigate();

  useEffect(() => {}, [category]);

  useEffect(() => {
    axios.get(`/api/qna/add?id=${params.id}`).then((res) => {
      console.log(res.data);
      setProductId(res.data.id);
      console.log(res.data.id);
      setImage(res.data.image?.[0]);
      setProductPrice(res.data.price);
      setProductName(res.data.productName);
    });
    console.log("user : ", user);
    console.log("productName : ", productName);
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
      axios
        .post("/api/qna/add", {
          title: title,
          content: content,
          category: category,
          username: user,
          productId: productId,
        })
        .then((res) => {
          const message = res.data.message;
          if (message) {
            toast(message.text, { type: message.type });
          }
          // navigate(-1);
          navigate("/qna/list");
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

  function handleQnaAddButtonClick() {
    navigate("/product/list");
  }

  function handleQnaListButtonClick() {
    navigate("/qna/list");
  }

  function handleFaQListButtonClick() {
    navigate("/faq/list");
  }

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6} className="mt-5">
        <div className="container">
          <h2 className="mb-4">1:1 상담 문의</h2>
          <div>
            {/*<Button disabled={true}>상담문의</Button>*/}
            {/*<Button>상담내역</Button>*/}

            <ButtonGroup>
              {radios.map((radio, idx) => (
                <input
                  key={idx}
                  className="btn btn-outline"
                  type="radio"
                  name="바로가기"
                  aria-label={radio.name}
                  value={radio.value}
                  checked={idx === 0}
                  onClick={radio.fnc}
                />
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
                  <FormControl
                    // style={{ width: 50 }}
                    placeholder={productName}
                    disabled={true}
                  />
                  <h5 className="text-end fw-bold text-danger">
                    {/* toLocaleString() : 세자리수마다 쉼표로 보기 쉽게 표현*/}
                    {productPrice && productPrice.toLocaleString()}원
                  </h5>
                </div>
              </FormGroup>
            </div>
            <br />
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
