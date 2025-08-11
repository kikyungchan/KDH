import { FaCopy } from "react-icons/fa";
import { SiKakaotalk, SiNaver } from "react-icons/si";

function ShareModal({ show, onClose, shareUrl }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("URL이 복사되었습니다.");
  };

  return (
    <>
      {show && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">공유하기</h3>

            <div className="flex justify-center gap-6 mb-6">
              <SiNaver
                size={40}
                color="#03c75a"
                className="cursor-pointer"
                title="네이버로 공유"
              />
              <SiKakaotalk
                size={40}
                color="#fee500"
                className="cursor-pointer"
                title="카카오톡으로 공유"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="input input-bordered flex-1"
              />
              <button className="btn btn-outline" onClick={handleCopy}>
                <FaCopy /> 복사
              </button>
            </div>

            <div className="modal-action mt-6">
              <button className="btn" onClick={onClose}>
                닫기
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}

export default ShareModal;
