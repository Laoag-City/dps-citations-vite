import { useState } from 'react';
import { Navbar, Container, Nav, Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import PropTypes from 'prop-types';

const TopBar = ({ username, userrole, onSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  if (!username) {
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img
              src="/laoaglogo.png"
              width="40"
              height="40"
              className="d-inline-block align-center"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  } else {
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Brand href="/">
            <img
              src="/laoaglogo.png"
              width="40"
              height="40"
              className="d-inline-block align-center"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* <Navbar.Text className="me-auto">Hello {username}</Navbar.Text> */}
              {userrole === "dpsstaff" && <Nav.Link as={Link} to="/newdpscitation">New DPS Citation</Nav.Link>}
              {userrole === "dpsstaff" && <Nav.Link as={Link} to="/reporting">Reporting</Nav.Link>}
              {/*<Nav.Link as={Link} to="/reporting">Reporting</Nav.Link>*/}
            </Nav>
            <Form className="d-flex" onSubmit={handleSearch}>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-success" type="submit">Search</Button>
            </Form>
            <span className="mx-2"></span>
            <Button variant="primary" onClick={handleLogout}>Logout</Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
};

TopBar.propTypes = {
  username: PropTypes.string,
  userrole: PropTypes.string,
  onSearch: PropTypes.func,
};

export default TopBar;
