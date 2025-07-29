import { Modal } from "react-bootstrap";

function BuyButton({ show, onHide, onOnlyBuy, onMoveToCart }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body
        className="text-center d-flex justify-content-center align-items-center"
        style={{ height: "130px", fontSize: "14px", padding: "0" }}
      >
        <p style={{ marginBottom: "0", fontSize: "16px" }}>
          장바구니에 담긴 상품도 함께 구매하시겠습니까?
        </p>
      </Modal.Body>
      <div
        style={{
          display: "flex",
          borderTop: "1px solid #ddd",
          borderBottomLeftRadius: "10px",
          borderBottomRightRadius: "10px",
          overflow: "hidden",
        }}
      >
        <button
          onClick={onOnlyBuy}
          style={{
            flex: 1,
            padding: "12px 0",
            border: "none",
            background: "white",
            fontWeight: "bold",
            borderRight: "1px solid #ddd",
          }}
        >
          아니요
        </button>
        <button
          onClick={onMoveToCart}
          style={{
            flex: 1,
            padding: "12px 0",
            border: "none",
            background: "white",
            fontWeight: "bold",
          }}
        >
          장바구니로 이동
        </button>
      </div>
    </Modal>
  );
}

export default BuyButton;
