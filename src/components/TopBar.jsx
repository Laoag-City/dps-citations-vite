import { useState } from 'react';
import { Navbar, Container, Nav, Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import propTypes from 'prop-types';

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
          <Navbar.Brand href="/login">Laoag City DPS Citations System</Navbar.Brand>
        </Container>
      </Navbar>
    )
  } else
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
            <Nav className="me-auto align-right">
              <Navbar.Text>Hello {username}</Navbar.Text>
            </Nav>
            <Nav>
              {userrole === "dpsstaff" && <Nav.Link href="/newdpscitation">New DPS Citation</Nav.Link>}
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
    )
};

TopBar.propTypes = {
  username: propTypes.string,
  userrole: propTypes.string,
  onSearch: propTypes.func.isRequired,
};

export default TopBar;
