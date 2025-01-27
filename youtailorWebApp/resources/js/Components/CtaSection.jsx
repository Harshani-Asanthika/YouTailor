import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';

const CtaSection = () => {
  return (
    <section id="cta" className="py-5 bg-light">
      <Container>
        <Row>
          <Col lg={6}>
            <h2>Ready to Design Your Custom Clothes?</h2>
            <p>Get started with our easy-to-use platform, and design your perfect garment today!</p>
          </Col>
          <Col lg={6} className="d-flex align-items-center justify-content-center">
            <Button variant="primary" size="lg" href="#design">Start Designing</Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default CtaSection;
