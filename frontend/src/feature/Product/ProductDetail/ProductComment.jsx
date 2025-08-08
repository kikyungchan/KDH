import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router";
import StarRating from "./util/StarRating.jsx";
import { AuthenticationContext } from "../../common/AuthenticationContextProvider.jsx";

function ReviewSection({ productId, onReviewChange }) {
  const [isPurchasable, setIsPurchasable] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [editTargetId, setEditTargetId] = useState(null);
  const [editHoverRating, setEditHoverRating] = useState(0);
  const [editContent, setEditContent] = useState("");
  const [editRating, setEditRating] = useState(5);
  const [showInput, setShowInput] = useState(false);
  const [content, setContent] = useState("");
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(5);
  const { isAdmin } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let currentUserId = null;
  if (token) {
    const decoded = jwtDecode(token);
    currentUserId = parseInt(decoded.sub); // subject에 userId 있다고 가정
  }

  useEffect(() => {
    axios
      .get(`/api/product/comment/${productId}`)
      .then((res) => setComments(res.data));

    if (token) {
      axios
        .get(`/api/product/comment/check?productId=${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setIsPurchasable(res.data.hasPurchased);
          setAlreadyReviewed(res.data.alreadyReviewed);
        })
        .catch((err) => console.log(err));
    }
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
        onReviewChange && onReviewChange();

        return axios.get(`/api/product/comment/${productId}`);
      })
      .then((res) => setComments(res.data))
      .then(() => {
        return axios.get(`/api/product/comment/check?productId=${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then((res) => {
        setIsPurchasable(res.data.hasPurchased);
        setAlreadyReviewed(res.data.alreadyReviewed);
      });
  }

  function handleAddCommentButton() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    if (!isAdmin) {
      if (alreadyReviewed) {
        alert("구매한 상품은 한 번만 리뷰작성이 가능합니다.");
        return;
      }
      if (!isPurchasable) {
        alert("해당 상품을 구매한 회원만 리뷰 작성이 가능합니다.");
        return;
      }
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
        onReviewChange && onReviewChange();
        return axios.get(`/api/product/comment/${productId}`);
      })
      .then((res) => setComments(res.data))
      .then(() => {
        return axios.get(`/api/product/comment/check?productId=${commentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then((res) => {
        setAlreadyReviewed(res.data.alreadyReviewed);
      })
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
        onReviewChange && onReviewChange();
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
                <StarRating
                  rating={editRating}
                  hoverRating={editHoverRating}
                  setRating={setEditRating}
                  setHoverRating={setEditHoverRating}
                />
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
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => submitEdit(c.id)}
                >
                  저장
                </button>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => setEditTargetId(null)}
                >
                  취소
                </button>
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

              {(c.memberId === currentUserId || isAdmin) && (
                <div style={{ marginTop: "5px", marginBottom: "5px" }}>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleEdit(c)}
                  >
                    수정
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleDelete(c.id)}
                  >
                    삭제
                  </button>
                </div>
              )}
              <hr />
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
            <StarRating
              rating={rating}
              hoverRating={editHoverRating}
              setRating={setRating}
              setHoverRating={setEditHoverRating}
            />
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
