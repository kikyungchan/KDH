import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import axios from "axios";
import { GoHeart, GoHeartFill } from "react-icons/go";

function LikeButton({ productId }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    axios.get(`/api/product/${productId}/like-status`).then((res) => {
      setLiked(res.data.liked);
      setLikeCount(res.data.count);
    });
  }, [productId]);

  const handleToggleLike = () => {
    axios.post(`/api/product/${productId}/toggle-like`).then((res) => {
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
