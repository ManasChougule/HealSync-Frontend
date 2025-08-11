import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import HealSyncLogo from '../assets/HealSync.png';
import { FaSignOutAlt,FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const Header = ({ loggedIn, setLoggedIn }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/'; // redirect to login page or home
  };

    const handleBack = () => {
        navigate(-1);
    };


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
              HealSync <small className="text-light opacity-75 fs-6">- Unified Multi-Hospital Appointment Booking Platform</small>
            </span>
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 p-1" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {!loggedIn ? (
              <>
                <LinkContainer to="/">
                  <Nav.Link className="px-3 fs-5 text-white">Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link className="px-3 fs-5 text-white">Register</Nav.Link>
                </LinkContainer>
              </>
            ) : (
                <>
                    <Button variant="secondary" onClick={handleBack} className="me-2">
                        <FaArrowLeft className="me-1" /> Back
                    </Button>
                    <Button variant="danger" onClick={handleLogout}>
                        <FaSignOutAlt className="me-1" /> Logout
                    </Button>
                </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
