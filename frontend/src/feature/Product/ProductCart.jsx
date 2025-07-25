import React from "react";
import * as cartItems from "react-bootstrap/ElementChildren";
import { Col, Container, Row } from "react-bootstrap";

function ProductCart(props) {
  function handleDeleteButton() {}

  function handleBuyButton() {}

  return (
    <Container>
      <h2>장바구니</h2>
      {cartItems.map((item) => (
        <Row key={item.id} className="align-items-center border-bottom py-2">
          <Col>
            <Form.Check
              type="checkbox"
              checked={checkedIds.includes(item.id)}
              onChange={() => handleCheckChange(item.id)}
            />
          </Col>
          <Col>
            <img src={item.imagePath} alt="상품이미지" width="100%" />
          </Col>
          <Col>{item.productName}</Col>
          <Col>{item.option}</Col>
          <Col>{item.quantity}개</Col>
          <Col>{(item.price * item.quantity).toLocaleString()}원</Col>
        </Row>
      ))}
      <div>
        <button onClick={handleDeleteButton}>선택 삭제</button>
        <button onClick={handleBuyButton}>선택 구매</button>
      </div>
    </Container>
  );
}

export default ProductCart;
