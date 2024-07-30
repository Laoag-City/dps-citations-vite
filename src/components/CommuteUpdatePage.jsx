import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
//import PropTypes from 'prop-types';
import { Container, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import CommuteForm from './CommuteForm';
import TopBar from './TopBar';
import Footer from './Footer';

const CommuteUpdatePage = () => {
  const { token, user } = useSelector(state => state.auth);
  const { citationId } = useParams();
  const navigate = useNavigate();
  const [citation, setCitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCitation = async () => {
      try {
        const response = await axios.get(`https://apps.laoagcity.gov.ph:3002/dpscitations/${citationId}`, {
          //const response = await axios.get(`http://localhost:3002/dpscitations/${citationId}`, {
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

  const handleCommuteUpdate = async (updatedCitation) => {
    try {
      const response = await axios.put(`https://apps.laoagcity.gov.ph:3002/dpscitations/${citationId}`, updatedCitation, {
        //const response = await axios.put(`http://localhost:3002/dpscitations/${citationId}`, updatedCitation, {
        headers: { Authorization: `Bearer ${token}` },
      });
      //console.log('Commuted Citation:', response.data);
      navigate('/dashboard'); // Navigate back to the dashboard after updating
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Unauthorized access. Please login again.');
        navigate('/login');
      } else {
        setError('Failed to update citation. Please try again later.');
      }
    }
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
      <TopBar username={user.username} userrole={user.userrole} bg="light" expand="lg" data-bs-theme="light" />
      <h3 className="text-center">Commute Citation</h3>
      {citation && (
        <CommuteForm
          citation={citation}
          onUpdate={handleCommuteUpdate}
          onCancel={() => navigate('/dashboard')}
        />
      )}
      <Footer />
    </Container>
  );
};

export default CommuteUpdatePage;
