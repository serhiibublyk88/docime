import { Container, Row, Col } from "react-bootstrap";
import styles from "./HomePage.module.css";

export const HomePage = () => {
  return (
    <Container fluid style={{ backgroundColor: "#0000" }}>
      <Row className="align-items-center" style={{ minHeight: "60vh" }}>
        <Col xs={12} md={8} lg={6} className="mx-auto text-center">
          
            <h1 className={styles.giantTitle}>DOKIME</h1>
          
          <h3>
            Der Test ist vorübergehend, aber das Wissen bleibt ewig{" "}
            <span className={`${styles.dots} fw-bold`}>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </span>
          </h3>
        </Col>
      </Row>
    </Container>
  );
};
