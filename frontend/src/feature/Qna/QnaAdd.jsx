import { Col, FormControl, FormGroup, FormLabel, Row } from "react-bootstrap";
import { useEffect, useState } from "react";

export function QnaAdd() {
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState();

  useEffect(() => {
    console.log(category);
  }, [category]);

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6} className="mt-5">
        <div className="container">
          <h2>1:1 상담 문의</h2>
          <div>상담문의</div>
          <div>상담내역</div>

          <div className="row">
            <div></div>
            <FormGroup className="mb-3" controalId="category1">
              <FormLabel>상담유형</FormLabel>
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => setCategory(e.target.value)}
              >
                <option selected disabled hidden value="0">
                  유형을 선택하세요
                </option>
                <option value="1">기능 관련</option>
                <option value="2">크기·무게 관련</option>
                <option value="3">배송 관련</option>
                <option value="4">설정 관련</option>
                <option value="5">반품·교환 관련</option>
                <option value="6">기타 문의</option>
              </select>
            </FormGroup>

            <FormGroup>
              <FormLabel></FormLabel>
              <FormControl
                value={title}
                placeholder="제목을 입력해 주세요"
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormGroup>
          </div>
        </div>
      </Col>
    </Row>
  );
}
