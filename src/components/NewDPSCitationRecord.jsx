import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card, Container, Form, Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import useFetchApprehenders from '../hooks/useFetchApprehenders';
import useFetchViolations from '../hooks/useFetchViolations';
import TopBar from './TopBar';
import Footer from './Footer';
/* const violationsList = [
{ violation: 'arrogant driver', amount: 150 },
{ violation: 'jaywalking', amount: 150 },
{ violation: 'invalid/fake registration or unregistered', amount: 3000 },
{ violation: 'improper display of licence plates', amount: 150 },
{ violation: 'overspeeding', amount: 150 },
{ violation: 'overloading', amount: 150 },
{ violation: 'driving under influence of liquor', amount: 5000 },
{ violation: 'defective accessories (side mirror, tail and head lights)', amount: 150 },
{ violation: 'anti-nuisance', amount: 150 },
{ violation: 'failure to wear helmet (driver)', amount: 1000 },
{ violation: 'failure to wear helmet (backride)', amount: 1000 },
{ violation: 'inappropriate use of helmet', amount: 1000 },
{ violation: 'using mobile phone/ any similar device/ gadgets while driving or operating motorized vehicle', amount: 150 },
{ violation: 'allowing children of any age to sit on the gas tank of any motorcycle while in motion', amount: 150 },
{ violation: 'failure of driver of a 4-wheel vehicle including the front seat passenger to wear seatbelts', amount: 150 },
{ violation: 'driving without driver\'s license', amount: 3000 },
{ violation: 'driving with expired driver\'s license', amount: 3000 },
{ violation: 'failure to carry driver\'s license while driving or operating a motorized vehicle', amount: 3000 },
{ violation: 'failure to present driver\'s license', amount: 3000 },
{ violation: 'driving with student permit', amount: 150 },
{ violation: 'blocking pedestrian lane', amount: 150 },
{ violation: 'no parking', amount: 150 },
{ violation: 'no loading/unloading zone', amount: 150 },
{ violation: 'wrong parking', amount: 150 },
{ violation: 'double parking', amount: 150 },
{ violation: 'obstruction', amount: 150 },
{ violation: 'six meters', amount: 150 },
{ violation: 'no trade name disregarding traffic sign/signal', amount: 150 },
{ violation: 'no u-turn', amount: 150 },
{ violation: 'no entry', amount: 150 },
{ violation: 'no left turn', amount: 150 },
{ violation: 'no right turn', amount: 150 },
{ violation: 'driving on the wrong side', amount: 150 },
{ violation: 'overspeeding', amount: 150 },
{ violation: 'overcharging', amount: 1500 },
{ violation: 'failure to display fare guide', amount: 150 },
{ violation: 'failure to register at night', amount: 150 },
{ violation: 'failure to carry mtop', amount: 150 },
{ violation: 'failure to display "not for hire"', amount: 150 },
{ violation: 'driving without tdic', amount: 150 },
{ violation: 'expired tricycle driver i.d', amount: 250 },
{ violation: 'plying national road', amount: 150 },
{ violation: 'no trashcan', amount: 150 },
{ violation: 'wearing slippers/sandals', amount: 150 },
{ violation: 'using bonnet or mask', amount: 150 },
{ violation: 'backriding', amount: 150 },
{ violation: 'overloading', amount: 150 },
{ violation: 'refuse conveyance', amount: 1000 },
{ violation: 'using in the commission of a crime', amount: 5000 },
{ violation: 'no fare guide', amount: 1500 },
{ violation: 'speed limit of 50 kph passing through gilbert bridge', amount: 200 },
{ violation: 'no loading or unloading along the southern and northern approach of the gilbert bridge', amount: 1000 }
];
*/
function DPSCitationRecordForm() {
  const { token, user } = useSelector((state) => state.auth);
  const { apprehendersList, error: apprehendersError } = useFetchApprehenders(token);
  const { violationsList, error: violationsError } = useFetchViolations(token);
  const [formData, setFormData] = useState({
    ticketNumber: '',
    firstName: '',
    lastName: '',
    middleName: '',
    homeAddress: '',
    licenseNumber: '',
    dateApprehended: '',
    timeApprehended: new Date().toISOString().slice(0, 16), // ISO string for datetime-local input
    streetApprehended: '',
    plateNumber: '',
    vehicleColor: '',
    apprehendingOfficer: '',
    apprehendingUnitOf: '',
    commuteStatus: false,
    commuteDate: null,
    paymentStatus: false,
    paymentDate: null,
    violations: [],
  });

  const navigate = useNavigate();

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  const backToHome = () => {
    navigate('/');
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleViolationChange = (index, event) => {
    const { name, value } = event.target;
    const updatedViolations = formData.violations.map((violation, vIndex) => {
      if (index === vIndex) {
        const selectedViolation = violationsList.find((v) => v.violation === value);
        return {
          ...violation,
          [name]: value,
          amount: selectedViolation ? selectedViolation.amount : '',
        };
      }
      return violation;
    });
    setFormData((prevState) => ({
      ...prevState,
      violations: updatedViolations,
    }));
  };

  const addViolation = () => {
    setFormData((prevState) => ({
      ...prevState,
      violations: [...prevState.violations, { violation: '', amount: '', remarks: '' }],
    }));
  };

  const removeViolation = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      violations: prevState.violations.filter((_, vIndex) => vIndex !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://apps.laoagcity.gov.ph:3002/dpscitations',
        JSON.stringify(formData),
        config
      );
      alert('New DPS Record accepted');
      navigate('/');
    } catch (error) {
      alert('DPS New Record error.');
      navigate('/');
    }
  };

  return (
    <Container className="align-items-center">
      <TopBar username={user.username} userrole={user.userrole} bg="light" expand="lg" data-bs-theme="dark" />
      <h3 className="text-center">New DPS Citation Record</h3>
      {apprehendersError && <p className="text-danger">{apprehendersError}</p>}
      {violationsError && <p className="text-danger">{violationsError}</p>}
      <Form onSubmit={handleSubmit}>
        <Card>
          <Card.Body>
            <Card.Title>Violator Information</Card.Title>
            <Row>
              <Col>
                <Form.Group controlId="ticketNumber">
                  <Form.Label>Ticket Number</Form.Label>
                  <Form.Control type="text" name="ticketNumber" value={formData.ticketNumber} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="middleName">
                  <Form.Label>Middle Name</Form.Label>
                  <Form.Control type="text" name="middleName" value={formData.middleName} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="homeAddress">
                  <Form.Label>Home Address</Form.Label>
                  <Form.Control type="text" name="homeAddress" value={formData.homeAddress} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="licenseNumber">
                  <Form.Label>License Number</Form.Label>
                  <Form.Control type="text" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Apprehension Information</Card.Title>
            <Row>
              <Col>
                <Form.Group controlId="dateApprehended">
                  <Form.Label>Date Apprehended</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="dateApprehended"
                    value={formData.dateApprehended}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="timeApprehended">
                  <Form.Label>Time Apprehended</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="timeApprehended"
                    value={formData.timeApprehended}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="streetApprehended">
                  <Form.Label>Street Apprehended</Form.Label>
                  <Form.Control type="text" name="streetApprehended" value={formData.streetApprehended} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="plateNumber">
                  <Form.Label>Plate Number</Form.Label>
                  <Form.Control type="text" name="plateNumber" value={formData.plateNumber} onChange={handleChange} />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="vehicleColor">
                  <Form.Label>Vehicle Color</Form.Label>
                  <Form.Control type="text" name="vehicleColor" value={formData.vehicleColor} onChange={handleChange} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="apprehendingOfficer">
                  <Form.Label>Apprehending Officer</Form.Label>
                  <Form.Control
                    as="select"
                    name="apprehendingOfficer"
                    value={formData.apprehendingOfficer}
                    onChange={handleChange}
                  >
                    <option value="">Select apprehending officer</option>
                    {apprehendersList.map((officer) => (
                      <option key={officer._id} value={officer.firstName + ' ' + officer.lastName}>
                        {officer.firstName} {officer.lastName} ({officer.designation})
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="apprehendingUnitOf">
                  <Form.Label>Apprehending Unit Of</Form.Label>
                  <Form.Control as="select" name="apprehendingUnitOf" value={formData.apprehendingUnitOf} onChange={handleChange}>
                    <option value="">Select unit</option>
                    <option value="PNP">PNP</option>
                    <option value="DPS">DPS</option>
                    <option value="Traffic Aide">Traffic Aide</option>
                    <option value="Barangay">Barangay</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <Card.Title>Violations</Card.Title>
            {formData.violations.map((violation, index) => (
              <Row key={index}>
                <Col>
                  <Form.Group controlId={`violation-${index}`}>
                    <Form.Label>Violation</Form.Label>
                    <Form.Control
                      as="select"
                      name="violation"
                      value={violation.violation}
                      onChange={(e) => handleViolationChange(index, e)}
                    >
                      <option value="">Select violation</option>
                      {violationsList.map((violation) => (
                        <option key={violation.violation} value={violation.violation}>
                          {violation.violation}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId={`amount-${index}`}>
                    <Form.Label>Amount</Form.Label>
                    <Form.Control type="number" name="amount" value={violation.amount} readOnly />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId={`remarks-${index}`}>
                    <Form.Label>Remarks</Form.Label>
                    <Form.Control type="text" name="remarks" value={violation.remarks} onChange={(e) => handleViolationChange(index, e)} />
                  </Form.Group>
                </Col>
                <Col className="text-end mt-3">
                  <Button variant="danger" onClick={() => removeViolation(index)}>
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <div className="text-end mt-3">
              <Button variant="warning" onClick={addViolation}>
                Add Violation
              </Button>
            </div>
          </Card.Body>
        </Card>
        <div className="text-end mt-3">
          <Button type="submit">Submit</Button>
          <span className="mx-2"></span>
          <Button variant="secondary" onClick={backToHome}>
            Back to Home
          </Button>
        </div>
      </Form>
      <Footer />
    </Container>
  );
}

export default DPSCitationRecordForm;
