/* import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const token = useSelector(state => state.auth.token);
  const navigate = useNavigate();
  useEffect(() => { !token ? navigate('/login') : navigate('/dashboard') });
};
export default Home;
 */
// src/components/Home.js

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import TopBar from './TopBar';
import Footer from './Footer';

const Home = () => {
  const { token, user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [ticketNumberValue, setTicketNumberValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };


  return (
    <Container>
      <TopBar username={user.username} userrole={user.userrole} bg="light" expand="lg" data-bs-theme="light" onSearch={handleSearch} />
      <Row className="justify-content-md-center">
        <Col md="auto">
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
