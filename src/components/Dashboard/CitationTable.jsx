import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button, Card, Modal, Form } from 'react-bootstrap';
import { formatDate } from '../../utils/dateUtils';
import { sumAmounts, getRowClass, useCitationActions } from '../../utils/citationUtils';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import useUpdate from '../../hooks/useUpdate';
import useFetchApprehenders from '../../hooks/useFetchApprehenders';
import CitationPrint from './CitationPrint';
import './CitationTable.css';
import './CitationPrint.css';

const CitationTable = ({ citations, isPaidTab = false }) => {
  const [sortField, setSortField] = useState('dateApprehended');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const { token, user } = useSelector((state) => state.auth);
  const printRef = useRef();

  const updateUrl = selectedCitation ? `https://apps.laoagcity.gov.ph/dps-citations-api/dpscitations/${selectedCitation._id}` : '';
  const { updateData, updateError } = useUpdate(updateUrl, token);
  const { apprehendersList, error: apprehendersError } = useFetchApprehenders(token);
  const { handleCommuteClick, handlePaymentClick } = useCitationActions();

  const handleSortChange = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const handlePrint = useReactToPrint({
    documentTitle: 'DPS Laoag City Citation Record Printout',
    contentRef: printRef || null,
    onAfterPrint: () => setSelectedCitation(null),
  });

  // Trigger print when selectedCitation and printRef.current are ready
  useEffect(() => {
    if (selectedCitation && printRef.current) {
      //console.log('Selected Citation:', selectedCitation);
      //console.log('Print Ref:', printRef.current);
      handlePrint();
    } else if (selectedCitation) {
      //console.log('Waiting for printRef.current to be set...');
    }
  }, [selectedCitation, handlePrint]);

  const handlePrintClick = (citation) => {
    //console.log('Printing citation:', citation);
    setSelectedCitation(citation); // This will trigger useEffect
  };

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

  const handleApprehenderChange = (e) => {
    const selectedApprehenderId = e.target.value;
    const selectedApprehender = apprehendersList.find(
      (apprehender) => apprehender._id === selectedApprehenderId
    );

    setEditData({
      ...editData,
      apprehendingOfficerId: selectedApprehender._id,
      apprehendingOfficer: `${selectedApprehender.firstName} ${selectedApprehender.lastName}`,
    });
  };

  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSortChange('ticketNumber')}>Ticket Number</th>
            <th onClick={() => handleSortChange('lastname')}>Name</th>
            <th onClick={() => handleSortChange('licenseNumber')}>License Number</th>
            <th onClick={() => handleSortChange('dateApprehended')}>
              Date Apprehended
            </th>
            <th onClick={() => handleSortChange('streetApprehended')}>
              Street Apprehended
            </th>
            <th onClick={() => handleSortChange('plateNumber')}>Plate Number</th>
            <th onClick={() => handleSortChange('vehicleColor')}>Vehicle Color</th>
            <th onClick={() => handleSortChange('apprehendingOfficer')}>
              Apprehending Officer
            </th>
            <th>Amount/Paid</th>
            {!isPaidTab && (
              <th onClick={() => handleSortChange('commuteStatus')}>Commuted</th>
            )}
            {!isPaidTab && <th>Paid</th>}
            <th>Print</th>
          </tr>
        </thead>
        <tbody>
          {citations.length > 0 ? (
            citations.map((citation) => (
              <tr
                key={citation._id}
                className={getRowClass(citation.dateApprehended)}
              >
                <td>{citation.ticketNumber}</td>
                <td>
                  {citation.lastName === 'N/A' ||
                    citation.lastName === 'n/a' ||
                    citation.lastName === 'NA'
                    ? 'N/A'
                    : `${citation.lastName}, ${citation.firstName} ${citation.middleName[0]}.`}
                </td>
                <td>{citation.licenseNumber}</td>
                <td>{formatDate(citation.dateApprehended)}</td>
                <td>{citation.streetApprehended}</td>
                <td>{citation.plateNumber}</td>
                <td>{citation.vehicleColor}</td>
                <td>{citation.apprehendingOfficer}</td>
                <td>
                  {sumAmounts(citation.violations) + ' : ' + citation.amountPaid}
                </td>
                {!isPaidTab && (
                  <td>
                    {user.userrole === 'dpshead' &&
                      (!citation.commuteStatus ||
                        citation.commuteStatus === undefined) ? (
                      <Button
                        variant="warning"
                        onClick={() => handleCommuteClick(citation._id)}
                      >
                        Commute
                      </Button>
                    ) : (
                      'No'
                    )}
                  </td>
                )}
                {!isPaidTab && (
                  <td>
                    {user.userrole === 'dpsstaff' &&
                      (!citation.paymentStatus ||
                        citation.paymentStatus === undefined) ? (
                      <Button
                        variant="warning"
                        onClick={() => handlePaymentClick(citation._id)}
                      >
                        Pay
                      </Button>
                    ) : (
                      'No'
                    )}
                  </td>
                )}
                <td>
                  <Link onClick={() => handlePrintClick(citation)}>Print</Link>
                  <br />
                  {user.userrole === 'dpsstaff' &&
                    (!citation.paymentStatus ||
                      citation.paymentStatus === undefined) ? (
                    <Link onClick={() => handleEditClick(citation)}>Edit</Link>
                  ) : (
                    ''
                  )}
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
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
          <CitationPrint citation={selectedCitation} ref={printRef} />
        </div>
      )}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Citation</Modal.Title>
        </Modal.Header>
        <Card>
          <Card.Body>
            <Card.Title>
              Ticket: {editData.ticketNumber},{' '}
              {formatDate(editData.dateApprehended, 'yyyy-MM-dd HH:mm:ss')}
            </Card.Title>
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
              </Form.Group>
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
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSave}>
            Save changes
          </Button>
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
        PropTypes.object,
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
          remarks: PropTypes.string,
        })
      ).isRequired,
    })
  ).isRequired,
  isPaidTab: PropTypes.bool,
};

export default CitationTable;