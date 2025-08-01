import React from "react";

function StarRating({ rating, hoverRating, setRating, setHoverRating }) {
  return (
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
  );
}

export default StarRating;
