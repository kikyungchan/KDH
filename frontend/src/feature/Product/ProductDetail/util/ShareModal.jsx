import { Button, Modal } from "react-bootstrap";
import { FaCopy } from "react-icons/fa";
import { SiKakaotalk, SiNaver } from "react-icons/si";

function ShareModal({ show, onHide, shareUrl, productName }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("URL이 복사되었습니다.");
  };

  const handleNaverShare = () => {
    const url = `https://share.naver.com/web/shareView.nhn?url=${encodeURIComponent(
      shareUrl,
    )}&title=${encodeURIComponent(productName)}`;
    window.open(url, "_blank");
  };

  const handleKakaoShare = () => {
    const url = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(
      shareUrl,
    )}&title=${encodeURIComponent(productName)}`;
    window.open(url, "_blank");
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>공유하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <SiNaver
            size={40}
            color="#03c75a"
            style={{ cursor: "pointer" }}
            onClick={handleNaverShare}
            title="네이버로 공유"
          />
          <SiKakaotalk
            size={40}
            color="#fee500"
            style={{ cursor: "pointer" }}
            onClick={handleKakaoShare}
            title="카카오톡으로 공유"
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <input
            type="text"
            readOnly
            value={shareUrl}
            style={{ flex: 1, padding: "6px" }}
          />
          <Button variant="outline-secondary" onClick={handleCopy}>
            <FaCopy /> 복사
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ShareModal;
