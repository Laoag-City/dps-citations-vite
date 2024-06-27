import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Accordion, Alert, Button, Container, Form, ListGroup, Modal, Spinner, Table } from 'react-bootstrap';
import TopBar from './TopBar';
import Footer from './Footer';

const Dashboard = () => {
  const { token, user } = useSelector(state => state.auth);
  const [citations, setCitations] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDPSCitationsData = async () => {
      try {
        const response = await axios.get('https://apps.laoagcity.gov.ph:3002/dpscitations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCitations(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          dispatch(logout());
          navigate('/login');
        } else {
          setError('Failed to fetch data. Please try again later.');
        }
      }
    };

    fetchDPSCitationsData();
  }, [token, navigate, dispatch]);

  const handleShow = (citation) => {
    setSelectedCitation(citation);
    setShowModal(+true);
  };

  const handleClose = () => {
    setShowModal(+false);
    setSelectedCitation(null); // Reset selected application on close
  };

  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : null;

  const sumAmounts = (amounts) => {
    return amounts.map(item => item.amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }
  const violationCount = (count) => { return count.length }

  if (!token) {
    return null;
  }

  return (
    <Container className="align-items-center">
      <TopBar username={user.username} userrole={user.userrole} bg="light" expand="lg" data-bs-theme="light" />
      <h3 className="text-right">DPS Citation List</h3>
      <Accordion>
        {citations ? (citations.map((citation, index) => (
          <Accordion.Item key={index} eventKey={String(index)}>
            <Accordion.Header>{citation.firstName} {citation.middleName[0]}. {citation.lastName} : {citation.amendStatus ? 'Commuted' : 'Not Commuted'}
            </Accordion.Header>
            <Accordion.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>License Number</th>
                    <th>Date Apprehended</th>
                    <th>Street Apprehended</th>
                    <th>Plate Number</th>
                    <th>Vehicle Color</th>
                    <th>Apprehending Officer</th>
                    <th>Amend Status</th>
                    <th>Violations</th>
                  </tr>
                </thead>
                <tbody>
                  <tr key={citation._id} onClick={() => handleShow(citation)}>
                    <td>{citation.licenseNumber}</td>
                    <td>{formatDate(citation.dateApprehended)}</td>
                    <td>{citation.streetApprehended}</td>
                    <td>{citation.plateNumber}</td>
                    <td>{citation.vehicleColor}</td>
                    <td>{citation.apprehendingOfficer}</td>
                    <td>{citation.amendStatus ? 'Amended' : 'Not Amended'}</td>
                    <td>{violationCount(citation.violations)}</td>
                  </tr>
                </tbody>
              </Table>
              <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Citation Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedCitation ? (
                    <>
                      <p>Apprehended on: {formatDate(selectedCitation.dateApprehended)}</p>
                      <p>Name: {selectedCitation.lastName}, {selectedCitation.firstName}</p>
                      <p>Apprehended by: {selectedCitation.apprehendingOfficer}</p>
                      <p>Total: {sumAmounts(selectedCitation.violations)} | {selectedCitation.amendStatus ? 'Amended' : 'Not Amended'}</p>
                      <Form>
                        {['checkbox'].map((type) => (
                          <div key={`inline-${type}`} className="mb-3">
                            <Form.Check
                              inline
                              label="1"
                              name="group1"
                              type={type}
                              id={`inline-${type}-1`}
                            />
                            <Form.Check
                              inline
                              label="2"
                              name="group1"
                              type={type}
                              id={`inline-${type}-2`}
                            />
                            <Form.Check
                              inline
                              label="3"
                              type={type}
                              id={`inline-${type}-3`}
                            />
                          </div>
                        ))}
                      </Form>
                      <ListGroup.Item><strong>Violation/s:</strong>
                        {selectedCitation.violations.map((violation) => (
                          <div key={violation._id}>
                            {violation.violation} - {violation.amount} on {violation.remarks}
                          </div>
                        ))}
                      </ListGroup.Item>
                    </>
                  ) : (
                    <p>Loading...</p>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>

            </Accordion.Body>
          </Accordion.Item>
        ))) : (
          error ? <Alert variant="danger" className="mt-3">{error}</Alert> : <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
        )}
      </Accordion>
      <Footer />
    </Container>
  );
};

export default Dashboard;
