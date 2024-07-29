// File path: src/components/PaymentUpdatePage.jsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaymentForm from './PaymentForm';
import { Container, Spinner, Alert } from 'react-bootstrap';

const PaymentUpdatePage = ({ token }) => {
  const { citationId } = useParams();
  const navigate = useNavigate();
  const [citation, setCitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCitation = async () => {
      try {
        const response = await axios.get(`https://apps.laoagcity.gov.ph:3002/dpscitations/${citationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCitation(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized access. Please login again.');
          navigate('/login');
        } else {
          setError('Failed to fetch citation data. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchCitation();
  }, [citationId, token, navigate]);

  const handlePaymentUpdate = (updatedCitation) => {
    // Here you can make an API call to update the citation in the backend
    // For now, we just log the updated data
    console.log('Updated Citation:', updatedCitation);
    navigate('/dashboard'); // Navigate back to the dashboard after updating
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h3>Update Payment</h3>
      {citation && (
        <PaymentForm
          citation={citation}
          onUpdate={handlePaymentUpdate}
          onCancel={() => navigate('/dashboard')}
        />
      )}
    </Container>
  );
};

export default PaymentUpdatePage;
