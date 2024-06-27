import { Navbar, Container, Nav, Form, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import propTypes from 'prop-types';

const TopBar = ({ username, userrole }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  if (!username) {
    return (
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/login">OSCP Laoag City</Navbar.Brand>
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
              <Navbar.Text>Hello {username}
              </Navbar.Text>
            </Nav>
            <Nav>{userrole === "oscpreceiving" && <Nav.Link href="/newoscpapplication">New OSCP Application</Nav.Link>}
              {/*               <Nav.Link href="#deets">More deets</Nav.Link>*/}            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
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
  userrole: propTypes.string
};
export default TopBar;
