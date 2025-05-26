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
      const response = await axios.post('https://apps.laoagcity.gov.ph/dps-citations-api/users/login', {
        //const response = await axios.post('http://localhost:3002/users/login', {
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
      <Container className="align-items-top justify-content-center">
        <Row className="justify-content-center">
          <Col xs lg="8" className="text-center">
            <h2 className="mb-8">DPS Citations Monitoring System Login</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col sm={3}>
            <Form onSubmit={handleLogin} className="text-center">
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
              <Button className="justify-content-center" variant="primary" type="submit">
                Login
              </Button>
              {error && (
                <Row className="mt-2 justify-content-center">
                  <Alert variant="danger" className="w-100">{error}</Alert>
                </Row>
              )}
            </Form>
          </Col>
        </Row>
      </Container>
      <Footer />
    </div >
  );
};

export default Login;
