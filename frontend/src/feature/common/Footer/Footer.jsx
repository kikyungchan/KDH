import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-logo">KDH</div>
          <div className="footer-links">
            <a href="#">회사소개</a>
            <a href="#">이용약관</a>
            <a href="#">개인정보처리방침</a>
            <a href="#">고객센터</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 KDH. All rights reserved.</p>
          <p>Contact: support@kdhshop.com | 1234-5678</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
