import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Modal,
  Spinner,
} from "react-bootstrap";

export default function ChangePasswordModal({
  show,
  onClose,
  oldPassword,
  setOldPassword,
  newPassword1,
  setNewPassword1,
  newPassword2,
  setNewPassword2,
  passwordConfirm,
  handleChangePasswordClick,
  changePasswordButtonDisabled,
  isPasswordProcessing,
}) {
  return (
    <Modal
      show={show}
      onHide={() => {
        onClose();
        setOldPassword("");
        setNewPassword1("");
        setNewPassword2("");
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>비밀번호 변경</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-3" style={{ fontSize: "13px" }}>
          비밀번호는 영문+숫자 조합, 8~20자 사이로 입력하세요.
        </p>
        <FormGroup>
          <FormLabel className="mb-2">현재 비밀번호</FormLabel>
          <FormControl
            id="withdraw-password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            autoFocus
          />
        </FormGroup>
        <FormGroup className="mb-2 mt-2">
          <FormLabel>변경할 비밀번호</FormLabel>
          <FormControl
            id="withdraw-password"
            type="password"
            value={newPassword1}
            onChange={(e) => setNewPassword1(e.target.value)}
          />
        </FormGroup>
        <FormGroup className="mb-2">
          <FormLabel>변경할 비밀번호 확인</FormLabel>
          <FormControl
            id="withdraw-password"
            type="password"
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
          />
          {passwordConfirm || (
            <FormText className="text-danger">
              비밀번호가 일치하지 않습니다.
            </FormText>
          )}
        </FormGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="dark"
          onClick={() => {
            onClose();
            setOldPassword("");
            setNewPassword1("");
            setNewPassword2("");
          }}
        >
          취소
        </Button>
        <Button
          variant="dark"
          onClick={handleChangePasswordClick}
          disabled={changePasswordButtonDisabled || isPasswordProcessing}
        >
          {isPasswordProcessing ? (
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
      </Modal.Footer>
    </Modal>
  );
}
