import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';

const Navbar = ({ onSignInClick }) => {
  return (
    <BootstrapNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <BootstrapNavbar.Brand href="#home">YouTailor</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#features">Features</Nav.Link>
            <Nav.Link href="#cta">Get Started</Nav.Link>
            {/* Sign In link that triggers the modal */}
            <Nav.Link onClick={onSignInClick} style={{ cursor: 'pointer' }}>
              Sign In
            </Nav.Link>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
