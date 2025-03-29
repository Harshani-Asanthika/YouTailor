import React, { useState } from 'react';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { X, List } from 'react-bootstrap-icons'; // Icons for toggle button
import '../../css/Navbar.css'; // Ensure this path is correct

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage mobile menu open/close

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Main Navbar */}
      <BootstrapNavbar bg="dark" variant="dark" expand="lg" fixed="top" className="main-navbar">
        <Container fluid>
          {/* Brand on the left */}
          <BootstrapNavbar.Brand href="#home" className="me-auto">
            YouTailor
          </BootstrapNavbar.Brand>

          {/* Toggle button on the right */}
          <Button
            className="navbar-toggler-custom ms-auto"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            {isOpen ? <X size={24} /> : <List size={24} />}
          </Button>

          {/* Desktop Menu */}
          <BootstrapNavbar.Collapse id="basic-navbar-nav" className="desktop-menu">
            <Nav className="ms-auto">
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#cta">Get Started</Nav.Link>
              <Nav.Link href="/client-panel/signin">Sign In</Nav.Link>
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>

      {/* Mobile Menu (Sidebar Style) */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <Nav className="flex-column">
          <Nav.Link href="#features" onClick={toggleMenu}>Features</Nav.Link>
          <Nav.Link href="#cta" onClick={toggleMenu}>Get Started</Nav.Link>
          <Nav.Link href="/client-panel/signin" onClick={toggleMenu}>Sign In</Nav.Link>
        </Nav>
      </div>

      {/* Overlay for Mobile Menu */}
      {isOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </>
  );
};

export default Navbar;