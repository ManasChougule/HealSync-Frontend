import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import HealSyncLogo from '../assets/HealSync.png';

const Header = ({ userData }) => {
  return (
    <Navbar bg="success" variant="dark" expand="lg" sticky="top" className="py-2">
      <Container fluid="md" className="gx-2">
        <LinkContainer to="/">
          <Navbar.Brand as="span" className="d-flex align-items-center">
            <img
              src={HealSyncLogo}
              alt="HealSync Logo"
              height="60"
              className="d-inline-block align-top"
            />
            <span className="ms-3 d-none d-md-block fs-3">
              HealSync{' '}
              <small className="text-light opacity-75 fs-6">
                - Unified Multi-Hospital Appointment Platform
              </small>
            </span>
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 p-1" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {userData && (
              <Nav.Link
                className="px-3 fs-5 text-white"
                onClick={() => {
                  localStorage.removeItem('user'); // Clear user data on logout
                  window.location.reload(); // Reload the page to reflect changes
                }}
              >
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
