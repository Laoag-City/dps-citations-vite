import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import useFetch from '../hooks/useFetch';
import useUpdate from '../hooks/useUpdate';
//import PaymentForm from './PaymentForm';
import CommuteForm from './CommuteForm';
import useFetchViolations from '../hooks/useFetchViolations';
import TopBar from './TopBar';
import Footer from './Footer';

const CommuteUpdatePage = () => {
  const { token, user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const { citationId } = useParams();
  const fetchUrl = `https://apps.laoagcity.gov.ph:3002/dpscitations/${citationId}`;
  const updateUrl = `https://apps.laoagcity.gov.ph:3002/dpscitations/${citationId}`;

  const { violationsList, error: violationsError } = useFetchViolations(token);
  const { data: citation, loading, error: fetchError } = useFetch(fetchUrl, token);
  const { updateData, error: updateError } = useUpdate(updateUrl, token);

  const handleCommuteUpdate = async (updatedCitation) => {
    await updateData(updatedCitation);
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (fetchError || updateError) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{fetchError || updateError}</Alert>
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
          violationsList={violationsList}
          onUpdate={handleCommuteUpdate}
          onCancel={() => navigate('/dashboard')}
        />
      )}
      <Footer />
    </Container>
  );
};

export default CommuteUpdatePage;

{/* for testing 
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import mongoose from 'mongoose'; // Assuming you're using MongoDB's ObjectId

const PaymentUpdate = () => {
  const { citationId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Validate the citationId format (assuming it's a MongoDB ObjectId)
    if (!citationId || !mongoose.Types.ObjectId.isValid(citationId)) {
      // Redirect to the previous page or a safe page if the citationId is invalid
      navigate(-1); // Go back to the previous page
    }
  }, [citationId, navigate]);

  // If citationId is valid, proceed with the component's logic
  return (
    <div>
      <h1>Payment Update for Citation ID: {citationId}</h1>
      {/* Your component logic here */}
      </div >
    );
  };

export default PaymentUpdate;
*/}