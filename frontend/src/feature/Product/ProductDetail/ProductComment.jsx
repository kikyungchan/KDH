import React, { useEffect, useState } from "react";
import axios from "axios";

function ReviewSection({ productId }) {
  const [showInput, setShowInput] = useState(false);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/product/comment/${productId}`)
      .then((res) => {
        console.log("댓글:", res.data);
        setComments(res.data);
      })
      .catch((err) => console.log(err));
  }, [productId]);

  function handleSubmit() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    const payload = {
      productId,
      content,
    };

    axios
      .post(`/api/product/comment`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("리뷰가 등록되었습니다.");
        setContent("");
        setShowInput(false);

        return axios.get(`/api/product/comment/${productId}`);
      })
      .then((res) => setComments(res.data));
    // TODO: 구매자 여부 체크 및 서버로 리뷰 저장 로직 추가 예정
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

      {/* 등록된 리뷰들 */}
      {comments.map((c) => (
        <div key={c.id} style={{ marginBottom: "15px" }}>
          <strong>{c.member?.name ?? "회원"}</strong>
          <p style={{ margin: "4px 0" }}>{c.content}</p>
          <small style={{ color: "#666" }}>
            {c.createdAt?.replace("T", " ").slice(0, 16)}
          </small>
        </div>
      ))}

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
