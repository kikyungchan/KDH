import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import axios from "axios";

function ProductCart(props) {
  const [checkedIds, setCheckedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    axios
      .get("/api/product/cart")
      .then((res) => {
        setCartItems(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  function handleDeleteButton() {}

  function handleBuyButton() {}

  function handleSelectAllChange() {}

  return (
    <Container>
      <h2>장바구니</h2>
      <Row></Row>
      {cartItems.map((item) => (
        <Row key={item.id} className="align-items-center border-bottom py-2">
          <Col>
            <img src={item.imagePath} alt="상품이미지" width="100%" />
          </Col>
          <Col>{item.productName}</Col>
          <Col>{item.optionName}</Col>
          <Col>{item.quantity}개</Col>
          <Col>{item.price.toLocaleString()}원</Col>
          <Col>{(item.price * item.quantity).toLocaleString()}원</Col>
        </Row>
      ))}
      <div className="mt-4 d-flex gap-2">
        <button onClick={handleDeleteButton}>선택 삭제</button>
        <button onClick={handleBuyButton}>구매</button>
      </div>
    </Container>
  );
}

export default ProductCart;
