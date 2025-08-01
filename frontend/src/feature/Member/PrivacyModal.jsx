import { Modal, Button } from "react-bootstrap";

export default function PrivacyModal({ show, onClose, onAgree }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>개인정보 수집 및 이용 동의</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>1. 수집 항목: 이름, 전화번호, 이메일</p>
        <p>2. 이용 목적: 회원관리, 문의 응대</p>
        <p>3. 보유 기간: 탈퇴 시까지 또는 1년</p>
        <p>※ 동의하지 않으면 서비스 이용이 제한될 수 있습니다.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="dark"
          onClick={() => {
            onAgree(true); // 동의함
            onClose();
          }}
        >
          동의
        </Button>
        <Button variant="secondary" onClick={onClose}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
