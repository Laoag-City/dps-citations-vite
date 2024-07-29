import PropTypes from 'prop-types';
import { useState } from 'react';
import { Accordion, Form, Button, Row, Col } from 'react-bootstrap';

const PaymentForm = ({ citation, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    ...citation,
    paymentStatus: citation.paymentStatus || true,
    paymentORNumber: citation.paymentORNumber || '',
    amountPaid: citation.amountPaid || '',
    paymentDate: citation.paymentDate ? new Date(citation.paymentDate).toISOString().split('T')[0] : '',
    paymentRemarks: citation.paymentRemarks || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };
  const sumAmounts = (amounts) => {
    const total = amounts.map(item => item.amount)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return parseFloat(total.toFixed(2));
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
                <Form.Label>Date Apprehended</Form.Label>
                <Form.Control
                  type="date"
                  name="dateApprehended"
                  value={new Date(formData.dateApprehended).toISOString().split('T')[0]}
                  readOnly
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formTimeApprehended">
                <Form.Label>Time Apprehended</Form.Label>
                <Form.Control
                  type="time"
                  name="timeApprehended"
                  value={formData.timeApprehended ? new Date(formData.timeApprehended).toLocaleTimeString('en-US', { hour12: false }) : ''}
                  readOnly
                />
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="formStreetApprehended">
              <Form.Label>Street Apprehended</Form.Label>
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
          {/*           <Accordion.Header>Payment Information ({citation.paymentStatus ? 'Paid' : 'Unpaid'})</Accordion.Header>
 */}          <Accordion.Header>Payment Information - Amount Due is: Php{sumAmounts(citation.violations)}</Accordion.Header>
          <Accordion.Body>
            <Form.Group className="mb-3" controlId="formPaymentORNumber">
              <Form.Label>Payment OR Number</Form.Label>
              <Form.Control
                type="text"
                name="paymentORNumber"
                value={formData.paymentORNumber}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPaymentORNumber">
              <Form.Label>Amount Paid</Form.Label>
              <Form.Control
                type="number"
                name="amountPaid"
                value={formData.amountPaid}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPaymentDate">
              <Form.Label>Payment Date</Form.Label>
              <Form.Control
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPaymentRemarks">
              <Form.Label>Payment Remarks</Form.Label>
              <Form.Control
                type="text"
                name="paymentRemarks"
                value={formData.paymentRemarks}
                onChange={handleChange}
              />
            </Form.Group>
          </Accordion.Body>
        </Accordion.Item>
        <div className="text-end mt-3">
          <Button variant="primary" type="submit">
            Update Payment
          </Button>
          <Button variant="secondary" onClick={onCancel} className="ms-2">
            Cancel
          </Button>
        </div>
      </Accordion >
    </Form >
  );
};

PaymentForm.propTypes = {
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
    paymentStatus: PropTypes.bool,
    paymentORNumber: PropTypes.string,
    paymentDate: PropTypes.string,
    amountPaid: PropTypes.number,
    paymentRemarks: PropTypes.string,
    violations: PropTypes.array
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default PaymentForm;
