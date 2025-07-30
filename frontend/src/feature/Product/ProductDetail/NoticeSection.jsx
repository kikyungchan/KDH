import { Col, Row } from "react-bootstrap";
import noticeData from "./notice.json";

function NoticeSection({ style }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "75%",
        marginLeft: "180px",
        ...style,
      }}
    >
      <div style={{ marginTop: "35px" }}>
        <h2 className="mt-5">NOTICE</h2>
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
