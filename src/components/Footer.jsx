import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-success text-center text-light mt-auto"
      style={{
        height: '32px',                      // Fixed minimal height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container fluid>
        <Row className="justify-content-center text-center gx-2">
          <Col xs="auto" className="px-2">
            <span style={{ fontSize: '0.85rem' }}>
              &copy; {currentYear} HealSync. All rights reserved.
            </span>
          </Col>
          <Col xs="auto" className="px-2">
            <span style={{ fontSize: '0.85rem' }} role="button" className="text-white-50">
              Privacy Policy
            </span>
          </Col>
          <Col xs="auto" className="px-2">
            <span style={{ fontSize: '0.85rem' }} role="button" className="text-white-50">
              Terms of Service
            </span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
