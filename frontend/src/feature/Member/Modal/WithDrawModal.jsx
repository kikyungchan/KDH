import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Modal,
  Spinner,
} from "react-bootstrap";

export default function WithdrawModal({
  show,
  onClose,
  oldPassword,
  setOldPassword,
  passwordError,
  setPasswordError,
  handleWithdrawButtonClick,
  isWithdrawProcessing,
}) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>회원 탈퇴 확인</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-3" style={{ fontSize: "13px" }}>
          정말 탈퇴하시겠습니까? 탈퇴를 위해 비밀번호를 입력해주세요.
        </p>
        <FormGroup>
          <FormLabel>비밀번호</FormLabel>
          <FormControl
            id="withdraw-password"
            type="password"
            value={oldPassword}
            onChange={(e) => {
              setOldPassword(e.target.value);
            }}
            autoFocus
            isInvalid={!!passwordError}
          />
          {passwordError && (
            <FormText className="text-danger">{passwordError}</FormText>
          )}
        </FormGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="dark"
          onClick={() => {
            onClose();
          }}
        >
          취소
        </Button>
        <Button
          onClick={handleWithdrawButtonClick}
          variant="danger"
          disabled={!oldPassword || isWithdrawProcessing}
        >
          {isWithdrawProcessing ? (
            <>
              <Spinner
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              전송 중...
            </>
          ) : (
            "탈퇴"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
