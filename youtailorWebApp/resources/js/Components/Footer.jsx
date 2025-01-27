// src/components/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <Container>
        <Row>
          <Col md={6}>
            <h5>YouTailor</h5>
            <p>Tailoring Your Dreams, One Stitch at a Time.</p>
          </Col>
          <Col md={6} className="text-md-end">
            <h5>Follow Us</h5>
            <p>
              <a href="#" className="text-white me-3">Facebook</a>
              <a href="#" className="text-white me-3">Instagram</a>
              <a href="#" className="text-white">Twitter</a>
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
