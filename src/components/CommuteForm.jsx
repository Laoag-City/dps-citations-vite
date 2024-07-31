import PropTypes from 'prop-types';
import { useState } from 'react';
import { Accordion, Form, Button, Row, Col } from 'react-bootstrap';
import { sumAmounts } from '../utils/citationUtils';

const CommuteForm = ({ citation, violationsList, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    ...citation,
    commuteStatus: citation.commuteStatus || true,
    commutedViolation: citation.commutedViolation || '',
    commutedViolationAmount: citation.commutedViolationAmount || '',
    commuteDate: citation.commuteDate ? new Date(citation.commuteDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    commutedViolationRemark: citation.commutedViolationRemark || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  const handleViolationChange = (event) => {
    const { value } = event.target;
    const selectedViolation = violationsList.find(v => v.violation === value);
    setFormData(prevState => ({
      ...prevState,
      commutedViolation: value,
      commutedViolationAmount: selectedViolation ? selectedViolation.amount : ''
    }));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Accordion defaultActiveKey="1">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Ticket Number: {formData.ticketNumber}</Accordion.Header>
          <Accordion.Body>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formTicketNumber">
                <Form.Label>Ticket Number</Form.Label>
                <Form.Control
                  type="text"
                  name="ticketNumber"
                  value={formData.ticketNumber}
                  readOnly
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formLicenseNumber">
                <Form.Label>License Number</Form.Label>
                <Form.Control
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  readOnly
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  readOnly
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formMiddleName">
                <Form.Label>Middle Name</Form.Label>
                <Form.Control
                  type="text"
                  name="middleName"
                  value={formData.middleName}
                  readOnly
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  readOnly
                />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="formHomeAddress">
              <Form.Label>Home Address</Form.Label>
              <Form.Control
                type="text"
                name="homeAddress"
                value={formData.homeAddress}
                readOnly
              />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formDateApprehended">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  name="dateApprehended"
                  value={new Date(formData.dateApprehended).toISOString().split('T')[0]}
                  readOnly
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formTimeApprehended">
                <Form.Label>Time</Form.Label>
                <Form.Control
                  type="time"
                  name="timeApprehended"
                  value={formData.timeApprehended ? new Date(formData.timeApprehended).toLocaleTimeString('en-US', { hour12: false }) : ''}
                  readOnly
                />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="formStreetApprehended">
              <Form.Label>Street</Form.Label>
              <Form.Control
                type="text"
                name="streetApprehended"
                value={formData.streetApprehended}
                readOnly
              />
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formPlateNumber">
                <Form.Label>Plate Number</Form.Label>
                <Form.Control
                  type="text"
                  name="plateNumber"
                  value={formData.plateNumber}
                  readOnly
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formVehicleColor">
                <Form.Label>Vehicle Color</Form.Label>
                <Form.Control
                  type="text"
                  name="vehicleColor"
                  value={formData.vehicleColor}
                  readOnly
                />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="formApprehendingOfficer">
              <Form.Label>Apprehending Officer</Form.Label>
              <Form.Control
                type="text"
                name="apprehendingOfficer"
                value={formData.apprehendingOfficer}
                readOnly
              />
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>
        <Accordion.Item eventKey="1">
          <Accordion.Header>Commute Citation - Amount Due is: Php{sumAmounts(citation.violations)}</Accordion.Header>
          <Accordion.Body>
            <Form.Group controlId="commutedViolation">
              <Form.Label>Change Violation To</Form.Label>
              <Form.Control as="select" name="commutedViolation" value={formData.commutedViolation} onChange={handleViolationChange}>
                <option value="">Select violation</option>
                {violationsList.map((violation, index) => (
                  <option key={index} value={violation.violation}>{violation.violation}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCommutedViolationAmount">
              <Form.Label>Amount</Form.Label>
              <Form.Control
                type="number"
                name="commutedViolationAmount"
                value={formData.commutedViolationAmount}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCommuteDate">
              <Form.Label>Citation Commutation Date</Form.Label>
              <Form.Control
                type="date"
                name="commuteDate"
                value={formData.commuteDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCommutedViolationRemark">
              <Form.Label>Commutation Remarks</Form.Label>
              <Form.Control
                type="text"
                name="commutedViolationRemark"
                value={formData.commutedViolationRemark}
                onChange={handleChange}
              />
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>
        <div className="text-end mt-3">
          <Button variant="primary" type="submit">
            Commute
          </Button>
          <Button variant="secondary" onClick={onCancel} className="ms-2">
            Cancel
          </Button>
        </div>
      </Accordion>
    </Form>
  );
};

CommuteForm.propTypes = {
  citation: PropTypes.shape({
    ticketNumber: PropTypes.string.isRequired,
    licenseNumber: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    middleName: PropTypes.string,
    homeAddress: PropTypes.string.isRequired,
    dateApprehended: PropTypes.string.isRequired,
    timeApprehended: PropTypes.string.isRequired,
    streetApprehended: PropTypes.string.isRequired,
    plateNumber: PropTypes.string.isRequired,
    vehicleColor: PropTypes.string.isRequired,
    apprehendingOfficer: PropTypes.string.isRequired,
    commuteStatus: PropTypes.bool,
    commuteDate: PropTypes.string,
    commutedViolation: PropTypes.string,
    commutedViolationAmount: PropTypes.number,
    commutedViolationRemark: PropTypes.string,
    violations: PropTypes.array
  }).isRequired,
  violationsList: PropTypes.array,
  onUpdate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CommuteForm;
