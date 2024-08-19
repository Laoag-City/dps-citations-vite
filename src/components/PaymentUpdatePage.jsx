import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Spinner, Alert } from 'react-bootstrap';
import useFetch from '../hooks/useFetch';
import useUpdate from '../hooks/useUpdate';
import PaymentForm from './PaymentForm';
import TopBar from './TopBar';
import Footer from './Footer';
import mongoose from 'mongoose';

const PaymentUpdatePage = () => {
  const { token, user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const { citationId } = useParams();

  // Validate the citationId
  useEffect(() => {
    if (!citationId || !mongoose.Types.ObjectId.isValid(citationId)) {
      // Redirect to the previous page or dashboard if the citationId is invalid
      navigate(-1); // Go back to the previous page
    }
  }, [citationId, navigate]);

  const fetchUrl = `https://apps.laoagcity.gov.ph:3002/dpscitations/${citationId}`;
  const updateUrl = `https://apps.laoagcity.gov.ph:3002/dpscitations/${citationId}`;

  const { data: citation, loading, error: fetchError } = useFetch(fetchUrl, token);
  const { updateData, error: updateError } = useUpdate(updateUrl, token);

  const handlePaymentUpdate = async (updatedCitation) => {
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
      <h3 className="text-center">Update Payment</h3>
      {citation && (
        <PaymentForm
          citation={citation}
          onUpdate={handlePaymentUpdate}
          onCancel={() => navigate('/dashboard')}
        />
      )}
      <Footer />
    </Container>
  );
};

export default PaymentUpdatePage;
