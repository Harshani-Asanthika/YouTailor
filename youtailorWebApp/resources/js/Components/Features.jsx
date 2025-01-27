import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Features = () => {
  return (
    <section id="features" className="py-5">
      <Container>
        <h2 className="text-center mb-4">Why Choose Us?</h2>
        <Row>
          <Col md={4}>
            <Card>
              <Card.Body>
                <h5>Custom Designs</h5>
                <p>Design clothes tailored exactly to your preferences, from fabric to fit.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <h5>Wide Range of Fabrics</h5>
                <p>Choose from a variety of fabrics to match your style and comfort.</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card>
              <Card.Body>
                <h5>Fast Delivery</h5>
                <p>Get your custom-designed clothes delivered to your doorstep in no time.</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Features;
