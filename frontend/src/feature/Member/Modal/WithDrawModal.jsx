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
  handleWithdrawButtonClick,
  isWithdrawProcessing,
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">회원 탈퇴 확인</h3>
          <button className="btn btn-sm btn-circle" onClick={onClose}>
            ✕
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          정말 탈퇴하시겠습니까? 탈퇴를 위해 비밀번호를 입력해주세요.
        </p>

        <div className="flex items-center justify-content-between form-control mb-4">
          <label htmlFor="withdraw-password" className=" label font-semibold">
            비밀번호
          </label>
          <input
            id="withdraw-password"
            type="password"
            className={`input input-bordered ${
              passwordError ? "input-error" : ""
            }`}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            autoFocus
          />
          {passwordError && (
            <label className="label text-red-500 text-sm mt-1">
              {passwordError}
            </label>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button className="btn" onClick={onClose}>
            취소
          </button>
          <button
            className="btn btn-error"
            onClick={handleWithdrawButtonClick}
            disabled={!oldPassword || isWithdrawProcessing}
          >
            {isWithdrawProcessing && (
              <span className="loading loading-spinner loading-sm mr-2"></span>
            )}
            탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}
