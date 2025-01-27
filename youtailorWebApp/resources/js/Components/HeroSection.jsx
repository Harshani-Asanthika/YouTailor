import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
 import '.'

const HeroSection = () => {
  return (
    <section className="hero-section d-flex align-items-center" style={{ backgroundImage: 'url(/path-to-your-image.jpg)', backgroundSize: 'cover', height: '100vh' }}>
      <Container>
        <Row>
          <Col lg={6}>
            <h1 className="text-white">Create Your Perfect Garment</h1>
            <p className="text-white mb-4">Choose from a variety of fabrics, styles, and customizations to design your own clothes.</p>
            <Button variant="primary" size="lg" href="#design">Start Designing</Button>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default HeroSection;
