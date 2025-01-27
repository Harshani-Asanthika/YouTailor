import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal'; // Import AuthModal
import AOS from 'aos'; // For animation
import 'aos/dist/aos.css'; // Import AOS CSS

// css folder
import '../../css/HeroSection.css';

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    AOS.init();
  }, []);

  const handleAuthModalToggle = () => setShowAuthModal((prev) => !prev);

  return (
    <div>
      <Navbar onSignInClick={handleAuthModalToggle} /> {/* Pass the handler to Navbar */}

      {/* Hero Section */}
      <section className="hero-section d-flex align-items-center">
        <Container>
          <Row>
            <Col lg={6}>
              <h1 className="hero-title" data-aos="fade-up" data-aos-duration="1500">
                Create Your Perfect Garment
              </h1>
              <p className="hero-subtitle" data-aos="fade-up" data-aos-duration="1800">
                Choose from a variety of fabrics, styles, and customizations to design your own clothes.
              </p>
              <Button
  className="hero-button"
  size="lg"
  data-aos="zoom-in"
  data-aos-duration="2000"
  onClick={() => Inertia.visit('/dress-customizer')}
>
  Start Designing
</Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
        <Container>
          <h2 className="text-center mb-4" data-aos="fade-up" data-aos-duration="1500">
            Why Choose Us?
          </h2>
          <Row>
            <Col md={4} data-aos-duration="1800">
              <Card>
                <Card.Body>
                  <h5>Custom Designs</h5>
                  <p>Design clothes tailored exactly to your preferences, from fabric to fit.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} data-aos="fade-up" data-aos-duration="1800">
              <Card>
                <Card.Body>
                  <h5>Wide Range of Fabrics</h5>
                  <p>Choose from a variety of fabrics to match your style and comfort.</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} data-aos="fade-up" data-aos-duration="1800">
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

      {/* Call to Action Section */}
      <section id="cta" className="py-5" style={{ backgroundColor: "#f1f1f1" }}>
        <Container>
          <Row>
            <Col lg={6} data-aos="fade-up" data-aos-duration="1500">
              <h2>Ready to Design Your Custom Clothes?</h2>
              <p>
                Get started with our easy-to-use platform, and design your perfect garment today!
              </p>
            </Col>
            <Col
              lg={6}
              className="d-flex align-items-center justify-content-center"
              data-aos="fade-up"
              data-aos-duration="1500"
            >
              <Button variant="primary" size="lg" href="#design">
                Start Designing
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Auth Modal */}
      <AuthModal show={showAuthModal} onHide={handleAuthModalToggle} />

      <Footer />
    </div>
  );
};

export default Index;
