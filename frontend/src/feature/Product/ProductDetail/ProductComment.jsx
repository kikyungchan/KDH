import React, { useState } from "react";

function ReviewSection({ productId }) {
  const [showInput, setShowInput] = useState(false);
  const [content, setContent] = useState("");

  function handleSubmit() {
    // TODO: 구매자 여부 체크 및 서버로 리뷰 저장 로직 추가 예정
    alert("리뷰가 등록되었습니다.");
    setContent("");
    setShowInput(false);
  }

  return (
    <div
      style={{
        marginTop: "50px",
        padding: "20px",
        width: "100%",
      }}
    >
      <h4>상품 리뷰</h4>

      {/* 예시 리뷰 */}
      <div style={{ marginBottom: "15px" }}>
        <strong>홍길동</strong>
        <p style={{ margin: "4px 0" }}>
          배송 빠르고 상품 상태 좋습니다. 만족합니다!
        </p>
      </div>

      {!showInput && (
        <button
          style={{
            backgroundColor: "black",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "4px",
          }}
          onClick={() => setShowInput(true)}
        >
          구매평 작성
        </button>
      )}

      {showInput && (
        <>
          <textarea
            style={{
              width: "100%",
              height: "100px",
              resize: "none",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              marginTop: "10px",
            }}
            placeholder="리뷰를 작성해 주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <button
              style={{
                backgroundColor: "black",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "4px",
              }}
              onClick={handleSubmit}
            >
              등록
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ReviewSection;
