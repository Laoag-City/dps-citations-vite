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
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <div className="container mt-2">
      <TopBar onSearch={handleSearch} />
      <Col>
        <Container fluid="md" className="d-flex align-items-top justify-content-center">
          <Form onSubmit={handleLogin}>
            <h2 className="mb-4">Laoag City DPS Citations and Ticketing Login</h2>
            <Form.Group controlId="formBasicUsername" className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 mb-3">
              Login
            </Button>
            {error && (
              <Row className="mt-2">
                <Alert variant="danger" className="w-100">{error}</Alert>
              </Row>
            )}
          </Form>
        </Container>
      </Col>
      <Footer />
    </div >
  );
};

export default Login;
