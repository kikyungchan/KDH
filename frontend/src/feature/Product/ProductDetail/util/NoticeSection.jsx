import { Col, Row } from "react-bootstrap";
import noticeData from "./notice.json";

function NoticeSection() {
  return (
    <div className="notice-section-wrapper">
      <div className="notice-section-inner">
        <h2 className="notice-title">NOTICE</h2>
        <Row>
          <Col>
            {noticeData.sections.map((section, idx) => (
              <div key={idx}>
                <hr />
                {section.title && (
                  <Col className="fw-bold">{section.title}</Col>
                )}
                {section.items.map((item, i) => (
                  <Col key={i}>{item}</Col>
                ))}
              </div>
            ))}
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default NoticeSection;
