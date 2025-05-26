import { useEffect } from 'react';
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
import mongoose from 'mongoose';

const CommuteUpdatePage = () => {
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

  const fetchUrl = `https://apps.laoagcity.gov.ph/dps-citations-api/dpscitations/${citationId}`;
  const updateUrl = `https://apps.laoagcity.gov.ph/dps-citations-api/dpscitations/${citationId}`;

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

//for testing 