import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router";

function CartAdded({ show, onHide }) {
  const navigate = useNavigate();

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body
        className="text-center d-flex justify-content-center align-items-center"
        style={{ height: "130px", fontSize: "14px", padding: "0" }}
      >
        <p style={{ marginBottom: "0", fontSize: "16px" }}>
          선택하신 상품을 장바구니에 담았습니다
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
          onClick={onHide}
          style={{
            flex: 1,
            padding: "12px 0",
            border: "none",
            background: "white",
            fontWeight: "bold",
            borderRight: "1px solid #ddd",
          }}
        >
          계속쇼핑
        </button>
        <button
          onClick={() => navigate("/product/cart")}
          style={{
            flex: 1,
            padding: "12px 0",
            border: "none",
            background: "white",
            fontWeight: "bold",
          }}
        >
          장바구니
        </button>
      </div>
    </Modal>
  );
}

export default CartAdded;
