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
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router";

export function QnaView() {
  const [searchParams, setSearchParams] = useSearchParams("1");
  useEffect(() => {
    axios.get(`/api/qna/view?${searchParams}`);
  }, []);
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
                <Form.Select
                  disabled={true}
                  className="form-select"
                  aria-label="Default select example"
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
                    // src={image}
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
                  <FormControl disabled={true} />
                  <h5 className="text-end fw-bold text-danger">
                    {/* toLocaleString() : 세자리수마다 쉼표로 보기 쉽게 표현*/}
                    {/*{productPrice && productPrice.toLocaleString()}원*/}
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
                  // value={title}
                  placeholder="제목을 입력해 주세요"
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
                  // value={content}
                />
              </FormGroup>
            </div>
            <br />

            <div className="mb-3">
              <Button
              // onClick={handleSaveButtonClick}
              // disabled={isProcessing || !validate}
              // disabled={isProcessing}
              >
                수정
              </Button>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}
