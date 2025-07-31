import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";

function ReviewSection({ productId }) {
  const [editTargetId, setEditTargetId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [showInput, setShowInput] = useState(false);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [hoverRating, setHoverRating] = useState(5);
  const [rating, setRating] = useState(5);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let currentUserId = null;
  if (token) {
    const decoded = jwtDecode(token);
    currentUserId = parseInt(decoded.sub); // subject에 userId 있다고 가정
  }
  // TODO: 본인리뷰에만 수정삭제버튼이보이는지 추후 테스트.
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

    const payload = {
      productId,
      content,
      rating,
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
    // TODO: 구매자 여부 체크 예정
  }

  function handleAddCommentButton() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    setShowInput(true);
  }

  function handleEdit(c) {
    setEditTargetId(c.id);
    setEditContent(c.content);
    setEditRating(c.rating);
  }

  function handleDelete(commentId) {
    const token = localStorage.getItem("token");
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    axios
      .delete(`/api/product/comment/${commentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("리뷰가 삭제되었습니다.");
        return axios.get(`/api/product/comment/${productId}`);
      })
      .then((res) => setComments(res.data))
      .catch((err) => console.log(err));
  }

  function submitEdit(commentId) {
    const token = localStorage.getItem("token");
    const payload = {
      content: editContent,
      rating: editRating,
    };
    axios
      .put(`/api/product/comment/${commentId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("리뷰가 수정되었습니다.");
        setEditTargetId(null);
        return axios.get(`/api/product/comment/${productId}`);
      })
      .then((res) => setComments(res.data))
      .catch((err) => console.log(err));
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
          <strong>
            {c.memberLoginId ? `${c.memberLoginId.slice(0, -4)}****` : "회원"}
          </strong>

          {/* 별점 표시 (수정 중일 때만 별점 수정 UI로 대체) */}
          {editTargetId === c.id ? (
            <>
              {/* 별점 수정 */}
              <div style={{ margin: "4px 0" }}>
                {[1, 2, 3, 4, 5].map((num) => (
                  <span
                    key={num}
                    style={{
                      fontSize: "24px",
                      cursor: "pointer",
                      color: num <= editRating ? "gold" : "#ccc",
                      marginRight: "4px",
                    }}
                    onClick={() => setEditRating(num)}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* 텍스트 수정 */}
              <textarea
                style={{
                  width: "100%",
                  height: "80px",
                  resize: "none",
                  padding: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  marginTop: "6px",
                }}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              ></textarea>

              <div style={{ marginTop: "8px" }}>
                <button onClick={() => submitEdit(c.id)}>저장</button>
                <button onClick={() => setEditTargetId(null)}>취소</button>
              </div>
            </>
          ) : (
            <>
              {/* 별점 보기 */}
              <div style={{ margin: "4px 0" }}>
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    style={{ color: i < c.rating ? "gold" : "#ccc" }}
                  >
                    ★
                  </span>
                ))}
              </div>

              <p style={{ margin: "4px 0" }}>{c.content}</p>
              <small style={{ color: "#666" }}>
                {c.createdAt?.replace("T", " ").slice(0, 16)}
              </small>

              {c.memberId === currentUserId && (
                <div style={{ marginTop: "5px" }}>
                  <button onClick={() => handleEdit(c)}>수정</button>
                  <button onClick={() => handleDelete(c.id)}>삭제</button>
                </div>
              )}
            </>
          )}
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
          onClick={handleAddCommentButton}
        >
          구매평 작성
        </button>
      )}

      {showInput && (
        <>
          <div style={{ marginTop: "10px" }}>
            {[1, 2, 3, 4, 5].map((num) => {
              const isFilled = num <= (hoverRating || rating);
              const canHover = num > rating;

              return (
                <span
                  key={num}
                  style={{
                    fontSize: "24px",
                    cursor: "pointer",
                    color: isFilled ? "gold" : "#ccc",
                    marginRight: "4px",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={() => {
                    if (canHover) setHoverRating(num);
                  }}
                  onMouseLeave={() => {
                    if (canHover) setHoverRating(0);
                  }}
                  onClick={() => {
                    setRating(num);
                    setHoverRating(0); // 클릭하면 호버 초기화
                  }}
                >
                  ★
                </span>
              );
            })}
          </div>
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
