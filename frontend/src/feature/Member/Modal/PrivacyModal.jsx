export default function PrivacyModal({ show, onClose, onAgree }) {
  if (!show) return null;
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg mx-4 sm:mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">개인정보 수집 및 이용 동의</h3>
          <button className="btn btn-sm btn-circle" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="mb-3">
          <ol className="list-decimal pl-5 space-y-1">
            <li>수집 항목: 이름, 전화번호, 이메일</li>
            <li>수집 목적: 서비스 제공, 본인 확인, 문의 응대</li>
            <li>보유 기간: 회원 탈퇴 시까지 또는 수집 후 1년간 보관</li>
            <li>
              귀하는 개인정보 제공에 동의하지 않으실 수 있으며, 동의하지 않을
              경우 서비스 이용에 제한이 있을 수 있습니다.
            </li>
          </ol>
          <p className="mt-4">
            ※ 위 내용을 확인하였으며, 개인정보 수집 및 이용에 동의합니다.
          </p>
        </div>
        <div className="flex gap-2 justify-content-end">
          <button
            type="button"
            className="btn btn-sm btn-info"
            onClick={() => {
              onAgree(true); // 동의함
              onClose();
            }}
          >
            동의
          </button>
          <button
            type="button"
            className="btn btn-sm btn-neutral"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
