import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { useNavigate } from "react-router";

function LikeButton({ productId }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    axios
      .get(`/api/product/${productId}/like-status`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then((res) => {
        setLikeCount(res.data.count);
        if (token) {
          setLiked(res.data.liked);
        }
      });
  }, [productId, token]);

  const handleToggleLike = () => {
    if (!token) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/login");
      return;
    }
    axios
      .post(`/api/product/${productId}/toggle-like`, null, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLiked(res.data.liked);
        setLikeCount(res.data.count);
      });
  };

  return (
    <span
      onClick={handleToggleLike}
      style={{ cursor: "pointer", marginLeft: "20px" }}
    >
      {liked ? <GoHeartFill color="black" /> : <GoHeart />}
      <span style={{ marginLeft: "5px" }}>{likeCount}</span>
    </span>
  );
}

export default LikeButton;
