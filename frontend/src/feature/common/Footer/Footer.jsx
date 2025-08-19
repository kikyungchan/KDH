import React, { useEffect } from "react";

const Footer = () => {
  useEffect(() => {
    import("./Footer.css");
  }, []);
  return (
    <footer className="footer">
      <div className="container">
        {/* 상단 섹션 */}
        <div className="footer-content">
          <div className="footer-brand">
            <div className="footer-logo">KDH</div>
            <div className="footer-links">
              <a href="#">회사소개</a>
              <a href="#">이용약관</a>
              <a href="#">개인정보처리방침</a>
              <a href="#">고객센터</a>
            </div>
          </div>
          <div className="footer-right">
            <div className="footer-info">
              <div className="info-title">고객센터 운영시간</div>
              <div className="info-text">평일 10:00 ~ 18:00</div>
              <div className="info-text">(점심시간 12:00 ~ 13:00)</div>
              <div className="info-text">주말 및 공휴일 휴무</div>
            </div>
            <div className="footer-sns">
              <a href="https://www.instagram.com/"
                 target="_blank"
                 rel="noopener noreferrer">
                <img src="../../../../public/logo/insta.webp" alt="Instagram" />
                Instagram
              </a>
              <a href="https://www.youtube.com/"
                 target="_blank"
                 rel="noopener noreferrer">
                <img src="../../../../public/logo/Youtube.png" alt="YouTube" />
                YouTube
              </a>
              <a href="https://www.kakaocorp.com/"
                 target="_blank"
                 rel="noopener noreferrer">
                <img src="../../../../public/logo/KakaoTalk.svg" alt="Kakao" />
                Kakao
              </a>
            </div>
          </div>
        </div>

        {/* 하단 섹션 */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>© 2025 KDH. All rights reserved.</p>
            <p>문의: support@kdhshop.com | 1234-5678</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
