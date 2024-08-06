// File path: components/CitationTable.jsx

import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { formatDate } from '../../utils/dateUtils';
import { sumAmounts, getRowClass } from '../../utils/citationUtils';
import { Link, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import useUpdate from '../../hooks/useUpdate';
import CitationPrint from './CitationPrint';
import './CitationTable.css';
import './CitationPrint.css';

const CitationTable = ({ citations, isPaidTab = false }) => {
  const [sortField, setSortField] = useState('dateApprehended');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const printRef = useRef();

  const updateUrl = selectedCitation ? `https://apps.laoagcity.gov.ph:3002/dpscitations/${selectedCitation._id}` : '';
  const { updateData, error } = useUpdate(updateUrl, token);

  const handleCommuteClick = (citation) => {
    navigate(`/commute-update/${citation._id}`);
  };

  const handlePaymentClick = (citation) => {
    navigate(`/payment-update/${citation._id}`);
  };

  const handleSortChange = (field) => {
    const order = (sortField === field && sortOrder === 'asc') ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const handlePrintClick = (citation) => {
    setSelectedCitation(citation);
    setTimeout(() => {
      handlePrint();
    }, 0);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'DPS Laoag City Citation Record Printout',
    onAfterPrint: () => setSelectedCitation(null)
  });

  const handleEditClick = (citation) => {
    setSelectedCitation(citation);
    setEditData(citation);
    setShowEditModal(true);
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSortChange('ticketNumber')}>Ticket Number</th>
            <th onClick={() => handleSortChange('lastname')}>Name</th>
            <th onClick={() => handleSortChange('licenseNumber')}>License Number</th>
            <th onClick={() => handleSortChange('dateApprehended')}>Date Apprehended</th>
            <th onClick={() => handleSortChange('streetApprehended')}>Street Apprehended</th>
            <th onClick={() => handleSortChange('plateNumber')}>Plate Number</th>
            <th onClick={() => handleSortChange('vehicleColor')}>Vehicle Color</th>
            <th onClick={() => handleSortChange('apprehendingOfficer')}>Apprehending Officer</th>
            <th>Amount/Paid</th>
            {!isPaidTab && <th onClick={() => handleSortChange('commuteStatus')}>Commute</th>}
            {!isPaidTab && <th>Paid</th>}
            <th>Print</th>
          </tr>
        </thead>
        <tbody>
          {citations.length > 0 ? (
            citations.map((citation) => (
              <tr key={citation._id} className={getRowClass(citation.dateApprehended)}>
                <td>{citation.ticketNumber}</td>
                <td>{citation.lastName === 'N/A' || citation.lastName === 'n/a' || citation.lastName === 'NA' ? 'N/A' : citation.lastName + ', ' + citation.firstName + " " + citation.middleName[0] + '.'} </td>
                <td>{citation.licenseNumber}</td>
                <td>{formatDate(citation.dateApprehended)}</td>
                <td>{citation.streetApprehended}</td>
                <td>{citation.plateNumber}</td>
                <td>{citation.vehicleColor}</td>
                <td>{citation.apprehendingOfficer}</td>
                <td>{sumAmounts(citation.violations) + " : " + citation.amountPaid}</td>
                {!isPaidTab && (
                  <td>
                    {user.userrole === 'dpshead' && (!citation.commuteStatus || citation.commuteStatus === undefined) ? <Button variant="warning" onClick={() => handleCommuteClick(citation)}>Commuted</Button> : 'No'}
                  </td>
                )}
                {!isPaidTab && (
                  <td>
                    {user.userrole === 'dpsstaff' && (!citation.paymentStatus || citation.paymentStatus === undefined) ? <Button variant="warning" onClick={() => handlePaymentClick(citation)}>Paid</Button> : 'No'}
                  </td>
                )}
                <td>
                  <Link onClick={() => handlePrintClick(citation)}>Print</Link>
                  <br />
                  {user.userrole === 'dpsstaff' && (!citation.paymentStatus || citation.paymentStatus === undefined) ? <Link variant="warning" onClick={() => handleEditClick(citation)}>Edit</Link> : 'No'}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isPaidTab ? 10 : 12} className="text-center">
                No records available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {selectedCitation && (
        <div style={{ display: 'none' }}>
          <CitationPrint citation={selectedCitation} ref={printRef} />
        </div>
      )}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Citation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formTicketNumber">
              <Form.Label>Ticket Number</Form.Label>
              <Form.Control
                type="text"
                name="ticketNumber"
                value={editData.ticketNumber}
                onChange={handleEditChange}
              />
            </Form.Group>
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
              />
            </Form.Group>
            <Form.Group controlId="formDateApprehended">
              <Form.Label>Date Apprehended</Form.Label>
              <Form.Control
                type="date"
                name="dateApprehended"
                value={editData.dateApprehended}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formStreetApprehended">
              <Form.Label>Street Apprehended</Form.Label>
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
            </Form.Group>
            <Form.Group controlId="formApprehendingOfficer">
              <Form.Label>Apprehending Officer</Form.Label>
              <Form.Control
                type="text"
                name="apprehendingOfficer"
                value={editData.apprehendingOfficer}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formAmountPaid">
              <Form.Label>Amount Paid</Form.Label>
              <Form.Control
                type="number"
                name="amountPaid"
                value={editData.amountPaid}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group controlId="formPaymentStatus">
              <Form.Label>Payment Status</Form.Label>
              <Form.Control
                as="select"
                name="paymentStatus"
                value={editData.paymentStatus}
                onChange={handleEditChange}
              >
                <option value={true}>Paid</option>
                <option value={false}>Not Paid</option>
              </Form.Control>
            </Form.Group>
          </Form>
          {error && <p className="text-danger">{error}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleEditSave}>Save changes</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

CitationTable.propTypes = {
  citations: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      ticketNumber: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      middleName: PropTypes.string,
      homeAddress: PropTypes.string,
      licenseNumber: PropTypes.string.isRequired,
      dateApprehended: PropTypes.string.isRequired,
      timeApprehended: PropTypes.string,
      streetApprehended: PropTypes.string,
      plateNumber: PropTypes.string,
      vehicleColor: PropTypes.string,
      apprehendingOfficer: PropTypes.string,
      apprehendingUnitOf: PropTypes.string,
      apprehendingOfficerId: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object // Updated to support ObjectId
      ]),
      commuteStatus: PropTypes.bool,
      commuteDate: PropTypes.string,
      commutedViolation: PropTypes.string,
      commutedViolationAmount: PropTypes.number,
      commutedViolationRemark: PropTypes.string,
      paymentStatus: PropTypes.bool,
      paymentORNumber: PropTypes.string,
      amountPaid: PropTypes.number,
      paymentDate: PropTypes.string,
      paymentRemarks: PropTypes.string,
      violations: PropTypes.arrayOf(
        PropTypes.shape({
          violation: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
          remarks: PropTypes.string
        })
      ).isRequired
    })
  ).isRequired,
  isPaidTab: PropTypes.bool,
  userRole: PropTypes.string
};

export default CitationTable;
