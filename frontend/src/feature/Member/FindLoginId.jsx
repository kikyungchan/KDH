import {
  Card,
  Col,
  Container,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
  Row,
} from "react-bootstrap";

export function FindLoginId() {
  return (
    <Container>
      <Card>
        <Row>
          <Col>
            <FormGroup>
              <FormLabel></FormLabel>
              <FormText>회원가입시 등록한 이메일을 입력해주세요.</FormText>
              <FormControl />
            </FormGroup>
          </Col>
        </Row>
      </Card>
    </Container>
  );
}
