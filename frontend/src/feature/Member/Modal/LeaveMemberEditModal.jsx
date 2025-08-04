import { Button, Modal, ModalTitle } from "react-bootstrap";

export default function LeaveMemberEditModal({ show, onClose, onLeave }) {
  if (!show) return null; // 👈 이 줄이 핵심!
  return (
    <div className="modal modal-open">
      <div className="modal-box w-full max-w-md">
        {/* 모달 헤더 */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">변경 내용이 저장되지 않았습니다.</h3>
          <button className="btn btn-sm btn-circle" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* 모달 본문 */}
        <p className="text-sm text-gray-600 mt-2">
          변경 사항을 저장하지 않고 나가시겠습니까?
        </p>

        {/* 버튼 영역 */}
        <div className="modal-action">
          <button className="btn btn-error" onClick={onLeave}>
            나가기
          </button>
          <button className="btn" onClick={onClose}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
