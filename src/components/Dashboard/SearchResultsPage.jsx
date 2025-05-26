import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Form, Modal, Card, Table, Alert, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useUpdate from '../../hooks/useUpdate';
import useFetchApprehenders from '../../hooks/useFetchApprehenders';
import { useReactToPrint } from 'react-to-print';
import CitationPrint from './CitationPrint';
import './CitationTable.css';
import './CitationPrint.css';


const SearchResults = ({ searchResults, error, handleShow, getRowClass, handleCommuteClick, handlePaymentClick, formatDate, violationCount, userRole }) => {
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const { token, user } = useSelector((state) => state.auth);
  const updateUrl = selectedCitation ? `https://apps.laoagcity.gov.ph/dps-citations-api/dpscitations/${selectedCitation._id}` : '';
  const { apprehendersList, error: apprehendersError } = useFetchApprehenders(token);
  const { updateData, updateError } = useUpdate(updateUrl, token);
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Citation Details',
    onAfterPrint: () => setSelectedCitation(null)
  });

  const handlePrintClick = (citation) => {
    setSelectedCitation(citation);
    setTimeout(() => {
      handlePrint();
    }, 0);
  };

  const handleEditClick = (citation) => {
    setSelectedCitation(citation);
    setEditData(citation);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleApprehenderChange = (e) => {
    const selectedApprehenderId = e.target.value;
    const selectedApprehender = apprehendersList.find(apprehender => apprehender._id === selectedApprehenderId);

    setEditData({
      ...editData,
      apprehendingOfficerId: selectedApprehender._id,
      apprehendingOfficer: `${selectedApprehender.firstName} ${selectedApprehender.lastName}`,
    });
  };
  const handleEditSave = async () => {
    try {
      const updatedCitation = await updateData(editData);
      console.log('Update successful', updatedCitation);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating citation:', error);
    }
  };

  return (
    <div>
      <h3 className="text-right">Search Results</h3>
      {searchResults ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Ticket Number</th>
              <th>Name</th>
              <th>License Number</th>
              <th>Date Apprehended</th>
              <th>Street Apprehended</th>
              <th>Plate Number</th>
              <th>Vehicle Color</th>
              <th>Apprehending Officer</th>
              <th>Commute</th>
              <th>Payment</th>
              <th>Violations</th>
              <th>Print</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.length > 0 ? (
              searchResults.map((citation) => (
                <tr key={citation._id} className={getRowClass(citation.dateApprehended)}>
                  <td onClick={() => handleShow(citation)}>{citation.ticketNumber}</td>
                  <td>{citation.lastName === 'N/A' || citation.lastName === 'n/a' || citation.lastName === 'NA' ? 'N/A' : citation.lastName + ', ' + citation.firstName + " " + citation.middleName[0] + '.'}</td>
                  <td>{citation.licenseNumber}</td>
                  <td>{formatDate(citation.dateApprehended)}</td>
                  <td>{citation.streetApprehended}</td>
                  <td>{citation.plateNumber}</td>
                  <td>{citation.vehicleColor}</td>
                  <td>{citation.apprehendingOfficer}</td>
                  <td>
                    {user.userrole === 'dpshead' && (!citation.commuteStatus || citation.commuteStatus === undefined) ? <Button variant="warning" onClick={() => handleCommuteClick(citation._id)}>Commute</Button> : 'Not Commuted'}
                    {/*citation.commuteStatus ? 'Commuted' : citation.paymentStatus ? 'Not Commuted' : <Button variant="warning" onClick={() => handleCommuteClick(citation)}>Commute</Button>*/}
                  </td>
                  <td>
                    {user.userrole === 'dpsstaff' && (!citation.paymentStatus || citation.paymentStatus === undefined) ? <Button variant="warning" onClick={() => handlePaymentClick(citation._id)}>Pay</Button> : 'Paid'}
                    {/*citation.paymentStatus ? 'Paid' : userRole === 'dpsstaff' ? <Button variant="warning" onClick={() => handlePaymentClick(citation)}>Pay</Button> : 'Unpaid'*/}
                  </td>
                  <td>{violationCount(citation.violations)}</td>
                  <td><Link onClick={() => handlePrintClick(citation)}>Print</Link>
                    <br />
                    {user.userrole === 'dpsstaff' && (!citation.paymentStatus || citation.paymentStatus === undefined) ? <Link variant="warning" onClick={() => handleEditClick(citation)}>Edit</Link> : ''}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">No records available</td>
              </tr>
            )}
          </tbody>
        </Table>
      ) : (
        error ? <Alert variant="danger" className="mt-3">{error}</Alert> : <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
      )}
      {/* Hidden section for printing */}
      {selectedCitation && (
        /*<div style={{ display: 'none' }}>*/
        <div style={{ display: 'none' }}>
          <CitationPrint citation={selectedCitation} ref={printRef} />
        </div>
      )}
      {selectedCitation && (
        <div style={{ display: 'none' }}>
          <CitationPrint citation={selectedCitation} ref={printRef} />
        </div>
      )}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Citation</Modal.Title>
        </Modal.Header>
        <Card>
          <Card.Body>
            <Card.Title>Ticket: {editData.ticketNumber}, {formatDate(editData.dateApprehended, 'yyyy-MM-dd HH:mm:ss')} </Card.Title>
            <Form>
              <Form.Group controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={editData.lastName}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={editData.firstName}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formLicenseNumber">
                <Form.Label>License Number</Form.Label>
                <Form.Control
                  type="text"
                  name="licenseNumber"
                  value={editData.licenseNumber}
                  onChange={handleEditChange}
                  readOnly
                />
              </Form.Group>
              {/*<Form.Group controlId="formDateApprehended">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="dateApprehended"
                  value={editData.dateApprehended}
                  onChange={handleEditChange}
                />
              </Form.Group>*/}
              <Form.Group controlId="formStreetApprehended">
                <Form.Label>Street</Form.Label>
                <Form.Control
                  type="text"
                  name="streetApprehended"
                  value={editData.streetApprehended}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formPlateNumber">
                <Form.Label>Plate Number</Form.Label>
                <Form.Control
                  type="text"
                  name="plateNumber"
                  value={editData.plateNumber}
                  onChange={handleEditChange}
                />
              </Form.Group>
              <Form.Group controlId="formVehicleColor">
                <Form.Label>Vehicle Color</Form.Label>
                <Form.Control
                  type="text"
                  name="vehicleColor"
                  value={editData.vehicleColor}
                  onChange={handleEditChange}
                />
              </Form.Group>{/*
              <Form.Group controlId="formApprehendingOfficer">
                <Form.Label>Apprehending Officer</Form.Label>
                <Form.Control
                  type="text"
                  name="apprehendingOfficer"
                  value={editData.apprehendingOfficer}
                  onChange={handleEditChange}
                  readOnly
                />
              </Form.Group>*/}
              <Form.Group controlId="formApprehendingOfficerId">
                <Form.Label>Apprehending Officer</Form.Label>
                <Form.Control
                  as="select"
                  name="apprehendingOfficerId"
                  value={editData.apprehendingOfficerId}
                  onChange={handleApprehenderChange}
                >
                  <option value="">Select Apprehender</option>
                  {apprehendersList.map((apprehender) => (
                    <option key={apprehender._id} value={apprehender._id}>
                      {`${apprehender.firstName} ${apprehender.lastName} (${apprehender.designation})`}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>
        <Modal.Body>
          {updateError && <p className="text-danger">{updateError}</p>}
          {apprehendersError && <p className="text-danger">{apprehendersError}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleEditSave}>Save changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

SearchResults.propTypes = {
  searchResults: PropTypes.array.isRequired,
  error: PropTypes.string,
  handleShow: PropTypes.func.isRequired,
  getRowClass: PropTypes.func.isRequired,
  handleCommuteClick: PropTypes.func.isRequired,
  handlePaymentClick: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  violationCount: PropTypes.func.isRequired,
  userRole: PropTypes.string
};

export default SearchResults;
