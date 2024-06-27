// src/components/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Accordion, Alert, Container, Spinner, Table } from 'react-bootstrap';
import TopBar from './TopBar';
import Footer from './Footer';

const Dashboard = () => {
  const { token, user } = useSelector(state => state.auth);
  const [applications, setApplications] = useState(null);
  //const [showModal, setShowModal] = useState(false);
  //const [selectedApplication, setSelectedApplication] = useState(null);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchOSCPData = async () => {
      try {
        const response = await axios.get('https://apps.laoagcity.gov.ph:3001/oscpapplications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          dispatch(logout());
          navigate('/login');
        } else {
          setError('Failed to fetch data. Please try again later.');
        }
      }
    };

    fetchOSCPData();
  }, [token, navigate, dispatch]);
  /*   const handleShow = (application) => {
    setSelectedApplication(application);
  setShowModal(true);
  };
  
  const handleClose = () => {
    setShowModal(false);
  setSelectedApplication(null); // Reset selected application on close
  };
  
  */  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : null;

  /*   const handleInteraction = (applicationId) => {
    console.log("Interaction with application ID:", applicationId);
  // Example action can be to fetch more data, navigate to a detailed page, etc.
  };
  
  */
  if (!token) {
    return null;
  }

  return (
    <Container className="align-items-center">
      <TopBar username={user.username} userrole={user.userrole} bg="light" expand="lg" data-bs-theme="light" />
      <h3 className="text-right">OSCP Applications List</h3>
      <Accordion>
        {applications ? (applications.map((application, index) => (
          <Accordion.Item key={index} eventKey={String(index)}>
            <Accordion.Header>{application.owner} - Construction Permit Status: {application.cPermitStatus ? 'Approved' : 'Pending'}
            </Accordion.Header>
            <Accordion.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Detail Type</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>ID</td>
                    <td>{application._id}</td>
                  </tr>
                  <tr>
                    <td>Date Applied</td>
                    <td>{application.dateApplied}</td>
                  </tr>
                  <tr>
                    <td>Title</td>
                    <td>{application.applicationTitle}</td>
                  </tr>
                  <tr>
                    <td>Type of Application</td>
                    <td>{application.cPermitType}</td>
                  </tr>
                  {/*<tr>
        <td>Land Conversion</td>
        <td>{application.conversionStatus ? 'Converted' : 'conversion pending'}</td>
        </tr>
        <tr>
        <td>Conversion Signatories</td>
        <td>{application.conversionSignatories.map((signatory, index) => (
          <div key={index}>
        {signatory.signatory} - {signatory.status} on {formatDate(signatory.signDate)}
        </div>
        ))}</td>
        </tr>
        */}
                  <tr>
                    <td>Construction Permit</td>
                    <td>{application.cPermitStatus ? 'Released' : 'Permit pending'}</td>
                  </tr>
                  <tr>
                    <td>Construction Permit Signatories</td>
                    <td>{application.constructionPermitSignatories.map((signatory, index) => (
                      <div key={index}>
                        {signatory.signatory} - {signatory.status} on {formatDate(signatory.signDate)}
                      </div>
                    ))}</td>
                  </tr>
                </tbody>
              </Table>
            </Accordion.Body>
          </Accordion.Item>
        ))) : (
          error ? <Alert variant="danger" className="mt-3">{error}</Alert> : <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
        )}
      </Accordion>
      {/*
        <ListGroup>
        {applications ? (applications.map(application => (
          <ListGroup.Item key={application._id} action onClick={() => handleShow(application)}>
        {application.applicationTitle} - Status: {application.conversionStatus ? 'Converted' : 'Pending'}
        </ListGroup.Item>
        ))) : (
        error ? <Alert variant="danger" className="mt-3">{error}</Alert> : <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
        )}
        </ListGroup>
        <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Application Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {selectedApplication ? (
        <>
        <p>Title: {selectedApplication.title}</p>
        <p>Owner Name: {selectedApplication.ownerName}</p>
        <p>Date Applied: {formatDate(selectedApplication.dateApplied)}</p>
        <p>Conversion Status: {selectedApplication.conversionStatus ? 'Converted' : 'Pending'}</p>
        <p>Conversion Signatories: {selectedApplication.conversionSignatories?.length || 0}</p>
        <ListGroup.Item><strong>Conversion Signatories:</strong>
        {selectedApplication.conversionSignatories.map((signatory, index) => (
          <div key={index}>
        {signatory.signatory} - {signatory.status} on {formatDate(signatory.signDate)}
        </div>
        ))}
        </ListGroup.Item>
        <p>Permit Status: {selectedApplication.conversionStatus ? 'Released' : 'Pending'}</p>
        <p>Permit Signatories: {selectedApplication.constructionPermitSignatories?.length || 0}</p>
        <ListGroup.Item><strong>Construction Permit Signatories:</strong>
        {selectedApplication.constructionPermitSignatories.map((signatory, index) => (
          <div key={index}>
        {signatory.signatory} - {signatory.status} on {formatDate(signatory.signDate)}
        </div>
        ))}
        </ListGroup.Item>
        </>
        ) : (
        error ? <Alert variant="danger" className="mt-3">{error}</Alert> : <p>Error loading data...</p>
        )}
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
        Close
        </Button>
        </Modal.Footer>
        </Modal>
        applications ? (
        <Card className="mt-3">
        <Card.Body>
        <Card.Title>Application Details</Card.Title>
        <dl className="row">
        <dt className="col-sm-3">Owner</dt>
        <dd className="col-sm-9">{applications.ownerName}</dd>
        <dt className="col-sm-3">Title</dt>
        <dd className="col-sm-9">{applications.title}</dd>
        <dt className="col-sm-3">Application Title</dt>
        <dd className="col-sm-9">{applications.applicationTitle}</dd>
        <dt className="col-sm-3">Date Applied</dt>
        <dd className="col-sm-9">{new Date(applications.dateApplied).toLocaleDateString()}</dd>
        <dt className="col-sm-3">Conversion Status</dt>
        <dd className="col-sm-9">{applications.conversionStatus ? 'Completed' : 'In Progress'}</dd>
        <dt className="col-sm-3">Construction Permit Status</dt>
        <dd className="col-sm-9">{applications.cPermitStatus ? 'Approved' : 'Pending'}</dd>
        <dt className="col-sm-3">Construction Permit Type</dt>
        <dd className="col-sm-9">{applications.cPermitType}</dd>
        </dl>
        </Card.Body>
        </Card>
        ) : (
        error ? <Alert variant="danger" className="mt-3">{error}</Alert> : <p>Loading data...</p>
        )*/}
      <Footer />
    </Container>
  );
};

export default Dashboard;
