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
  if (!show) return null;
  return (
    <div className="modal modal-open">
      <div className="modal-box w-full max-w-md">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">회원 정보 수정 확인</h3>
          <button
            className="btn btn-sm btn-circle"
            onClick={() => {
              onClose();
              setOldPassword("");
            }}
          >
            ✕
          </button>
        </div>

        {/* 내용 */}
        <div className="flex items-start gap-6 mb-2">
          <label className="w-24 label font-semibold pt-2">암호 입력</label>

          <div className="flex flex-col flex-1">
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={`input input-bordered ${
                isSubmitted && oldPassword.trim() === "" ? "input-error" : ""
              }`}
              autoFocus
            />
            {isSubmitted && oldPassword.trim() === "" && (
              <span className="text-error text-sm mt-2 ml-3">암호를 입력해주세요.</span>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="modal-action">
          <button
            className="btn btn-neutral"
            onClick={onSubmit}
            disabled={isEditProcessing}
          >
            {isEditProcessing ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                저장 중...
              </>
            ) : (
              "저장"
            )}
          </button>
          <button
            className="btn btn-neutral"
            onClick={() => {
              onClose();
              setOldPassword("");
              setIsSubmitted(false);
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
