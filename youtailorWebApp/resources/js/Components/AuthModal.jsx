import React from 'react';
import { Modal, Tab, Nav, Button, Form, Row, Col } from 'react-bootstrap';
import '../../css/AuthModal.css';

const AuthModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
       
      </Modal.Header>
      <Modal.Body>
        <Tab.Container defaultActiveKey="signin">
          {/* Tabs for Sign In and Sign Up */}
          <Nav variant="pills" className="justify-content-center mb-3  ">
            <Nav.Item>
              <Nav.Link eventKey="signin" className="">Sign In</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="signup">Sign Up</Nav.Link>
            </Nav.Item>
          </Nav>

          <Tab.Content>
            {/* Sign In Form */}
            <Tab.Pane eventKey="signin">
              <Form>
                <Form.Group className="mb-3" controlId="signinEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="signinPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Button type="submit">
                  Sign In
                </Button>
              </Form>
            </Tab.Pane>

            {/* Sign Up Form */}
            <Tab.Pane eventKey="signup">
              <Form>
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="signupFirstName">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter your first name" />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="signupLastName">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control type="text" placeholder="Enter your last name" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="signupMobile">
                      <Form.Label>Mobile</Form.Label>
                      <Form.Control type="tel" placeholder="Enter your mobile number" />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="signupEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control type="email" placeholder="Enter your email" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Form.Group className="mb-3" controlId="signupAddress">
                      <Form.Label>Address</Form.Label>
                      <Form.Control as="textarea" rows={2} placeholder="Enter your address" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group className="mb-3" controlId="signupPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control type="password" placeholder="Enter a secure password" />
                    </Form.Group>
                  </Col>
                </Row>
                <Button  type="submit">
                  Sign Up
                </Button>
              </Form>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;
