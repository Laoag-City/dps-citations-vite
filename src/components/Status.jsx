import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import TopBar from './TopBar';
import Footer from './Footer';

const Status = () => {
  const [ticket, setTicket] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await axios.post('https://apps.laoagcity.gov.ph:3002/users/login', {
        ticket
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
          <Form onSubmit={handleSubmit}>
            <h2 className="mb-2">Laoag City DPS Citations and Ticketing status check</h2>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Ticket Number</Form.Label>
              <Form.Control type="text" placeholder="Enter Ticker Number" value={ticket} onChange={(e) => setTicket(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-4 w-100">
              Check
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

export default Status;