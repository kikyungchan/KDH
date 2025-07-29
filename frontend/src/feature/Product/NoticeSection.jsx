import { Col, Row } from "react-bootstrap";
import noticeData from "./notice.json"; // JSON 따로 만들었을 경우

function NoticeSection() {
  return (
    <div style={{ marginTop: "35px" }}>
      <h2 className="mt-5">NOTICE</h2>
      <Row>
        <Col>
          {noticeData.sections.map((section, idx) => (
            <div key={idx}>
              <hr />
              {section.title && <Col className="fw-bold">{section.title}</Col>}
              {section.items.map((item, i) => (
                <Col key={i}>{item}</Col>
              ))}
            </div>
          ))}
        </Col>
      </Row>
    </div>
  );
}

export default NoticeSection;
