import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Modal,
  Spinner,
} from "react-bootstrap";

export default function ConfirmEditModal({
  show,
  onClose,
  onSubmit,
  oldPassword,
  setOldPassword,
  isSubmitted,
  setIsSubmitted,
  isEditProcessing,
}) {
  return (
    <Modal
      show={show}
      onHide={() => {
        onClose();
        setOldPassword("");
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>회원 정보 수정 확인</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormGroup>
          <FormLabel>암호 입력</FormLabel>
          <FormControl
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          {isSubmitted && oldPassword.trim() === "" && (
            <FormText className="text-danger">암호를 입력해주세요.</FormText>
          )}
        </FormGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="dark" onClick={onSubmit} disabled={isEditProcessing}>
          {isEditProcessing ? (
            <>
              <Spinner
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              저장 중...
            </>
          ) : (
            "저장"
          )}
        </Button>
        <Button
          variant="dark"
          onClick={() => {
            onClose();
            setOldPassword("");
            setIsSubmitted(false);
          }}
        >
          취소
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
