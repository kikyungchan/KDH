import React, { useEffect, useState } from "react";

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Y 위치가 200px 이상일 때 버튼 보이기
      if (window.scrollY > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "instant", // 즉시 이동
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      style={{
        position: "fixed",
        bottom: "40px",
        right: "40px",
        padding: "10px 16px",
        fontSize: "16px",
        borderRadius: "8px",
        backgroundColor: "black",
        color: "white",
        border: "none",
        cursor: "pointer",
        zIndex: 999,
      }}
    >
      ↑
    </button>
  );
}

export default ScrollToTopButton;
