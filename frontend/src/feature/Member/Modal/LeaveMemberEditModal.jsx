import { Button, Modal, ModalTitle } from "react-bootstrap";
import { useNavigate } from "react-router";

export default function LeaveMemberEditModal({ show, onClose, onLeave }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <ModalTitle className="fs-5">
          변경 내용이 저장되지 않았습니다.
        </ModalTitle>
      </Modal.Header>
      <Modal.Body>
        <p className="mt-2">변경 사항을 저장하지 않고 나가시겠습니까?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={onLeave}>
          나가기
        </Button>
        <Button variant="dark" onClick={onClose}>
          취소
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
