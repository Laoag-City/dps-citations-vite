import { useState } from 'react';
import { Button, Container, Form, Nav, Navbar, NavDropdown } from 'react-bootstrap';
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
          <Navbar.Brand href="/">
            <img
              src="/dps_official_seal.webp"
              width="40"
              height="40"
              className="d-inline-block align-center"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav className="flex mr-auto">
              {/* <Navbar.Text className="me-auto">Hello {username}</Navbar.Text> */}
              {userrole === "dpsstaff" && <Nav.Link as={Link} to="/newdpscitation">New DPS Citation</Nav.Link>}
              {userrole === "dpsstaff" && <Nav.Link as={Link} to="/reporting">Reporting</Nav.Link>}
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
              <NavDropdown title="Account" id="basic-nav-dropdown">
                {/*TODO:Conditional rendering*/}
                <NavDropdown.Item href="#action/3.2">Hello, {username}</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Edit Apprehenders</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Edit Violations</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Account Settings</NavDropdown.Item>
                <Nav.Link className="mr-auto" variant="primary" onClick={handleLogout}>Logout</Nav.Link>
              </NavDropdown>

            </Nav>

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
