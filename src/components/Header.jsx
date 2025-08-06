import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import HealSyncLogo from '../assets/HealSync.png';

const Header = () => {
  return (
    <Navbar bg="success" variant="dark" expand="lg" sticky="top" className="py-2"> {/* Increased padding */}
      <Container fluid="md" className="gx-2">
        <LinkContainer to="/">
          <Navbar.Brand as="span" className="d-flex align-items-center">
            <img
              src={HealSyncLogo}
              alt="HealSync Logo"
              height="60"  // Increased logo size from 50 to 60
              className="d-inline-block align-top"
            />
            <span className="ms-3 d-none d-md-block fs-3"> {/* Increased font size */}
              HealSync <small className="text-light opacity-75 fs-6">- Unified Multi-Hospital Appointment Platform</small>
            </span>
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 p-1" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <LinkContainer to="/">
              <Nav.Link className="px-3 fs-5 text-white">  {/* Increased font size */}
                Login
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/register">
              <Nav.Link className="px-3 fs-5 text-white">  {/* Increased font size */}
                Register
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
