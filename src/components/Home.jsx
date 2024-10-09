import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import TopBar from './TopBar';
import Footer from './Footer';

const Home = () => {
  const { token } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [ticketNumberValue, setTicketNumberValue] = useState('');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted with:', ticketNumberValue);
    // Handle form submission logic here
  };

  return (
    <Container className="align-items-top justify-content-center">
      <TopBar bg="light" expand="lg" data-bs-theme="light" />
      <Row className="justify-content-center">
        <Col xs lg="4" className="text-center">
          {!token && (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicInput">
                <h2 className="mb-4">Check Ticket Status</h2>

                <Form.Label>Enter your ticket Number:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ticket Number"
                  value={ticketNumberValue}
                  onChange={(e) => setTicketNumberValue(e.target.value)}
                  required
                />
              </Form.Group>
              <Button className="justify-content-center" variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          )}
        </Col>
      </Row>
      <Footer />
    </Container>
  );
};

export default Home;
