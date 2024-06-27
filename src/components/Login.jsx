// src/components/Login.jsx
import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import TopBar from './TopBar';
import Footer from './Footer';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://apps.laoagcity.gov.ph:3002/users/login', {
        username,
        password
      });
      dispatch(setCredentials({
        token: response.data.token,
        user: {
          _id: response.data._id,
          username: response.data.username,
          userrole: response.data.userrole,
        }
      }));
      navigate('/dashboard');
    } catch (error) {
      setError('Login failed. Please check your credentials and try again.');
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="container mt-2">
      <TopBar />
      <Col>
        <Container fluid="md" className="d-flex align-items-top justify-content-center">
          <Form onSubmit={handleLogin}>
            <h2 className="mb-2">OSCP Login</h2>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-4 w-100">
              Login
            </Button>
            <Row className="mt-2">
              {error && <Alert variant="danger">{error}</Alert>}
            </Row>
          </Form>
        </Container>
      </Col>
      <Footer />
    </div >
  );
};

export default Login;
