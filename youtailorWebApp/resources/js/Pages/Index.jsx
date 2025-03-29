import React, { useEffect } from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import Custom CSS
import '../../css/HeroSection.css';

const Index = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section text-white text-center d-flex align-items-center">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} data-aos="fade-right">
              <h1 className="hero-title" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
                Create Your Perfect Garment
              </h1>
              <p className="hero-subtitle" style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '1.2rem' }}>
                Choose from a variety of fabrics, styles, and customizations to design your own clothes.
              </p>
              <Link href="/design">
                <Button
                  className="hero-button"
                  size="lg"
                  style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', padding: '10px 20px' }}
                  data-aos="zoom-in"
                  data-aos-duration="2000"
                >
                  Start Designing
                </Button>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-4" data-aos="fade-up" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
            Why Choose Us?
          </h2>
          <Row className="g-4">
            {[
              { title: 'Custom Designs', text: 'Design clothes tailored exactly to your preferences.', icon: '🎨' },
              { title: 'Premium Fabrics', text: 'Choose from high-quality fabrics for style and comfort.', icon: '🧵' },
              { title: 'Fast Delivery', text: 'Receive your custom-designed clothes quickly.', icon: '🚀' }
            ].map((feature, index) => (
              <Col md={4} key={index} data-aos="fade-up" data-aos-delay={index * 200}>
                <Card className="shadow-lg border-0 text-center p-4" style={{ minHeight: '220px' }}>
                  <h1>{feature.icon}</h1>
                  <h5 className="mt-3" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                    {feature.title}
                  </h5>
                  <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '1rem' }}>{feature.text}</p>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section id="cta" className="py-5 text-center" style={{ backgroundColor: '#f1f1f1' }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={6} data-aos="fade-right">
              <h2 style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}>
                Ready to Design Your Custom Clothes?
              </h2>
              <p style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '1.1rem' }}>
                Start creating your own unique style with our easy-to-use platform.
              </p>
            </Col>
            <Col lg={6} data-aos="fade-left">
              <Button
                className="cta-button"
                size="lg"
                style={{ fontFamily: 'Poppins, sans-serif', fontSize: '1rem', padding: '10px 20px' }}
                onClick={() => Inertia.visit('/design')}
              >
                Start Designing
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default Index;