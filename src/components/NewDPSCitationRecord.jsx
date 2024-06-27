import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Form, Button, Accordion, Col, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import TopBar from './TopBar';
import Footer from './Footer';

function DPSCitationRecordForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    homeAddress: '',
    licenseNumber: '',
    dateApprehended: '',
    timeApprehended: '',
    streetApprehended: '',
    plateNumber: '',
    vehicleColor: '',
    apprehendingOfficer: '',
    amendStatus: false,
    violations: []
  });

  const navigate = useNavigate();
  const { token, user } = useSelector(state => state.auth);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  const backToHome = () => {
    navigate('/');
  };


  /* 
    const handleChange = (e, section, index) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;
  
      if (section) {
        const updatedSection = formData[section].map((item, idx) => {
          if (idx === index) {
            return { ...item, [name]: newValue };
          }
          return item;
        });
        setFormData(prev => ({ ...prev, [section]: updatedSection }));
      } else {
        setFormData(prev => ({ ...prev, [name]: newValue }));
      }
    };
    const handleDateChange = (value, name, index = null, section = null) => {
      if (index !== null && section) {
        setFormData((prev) => ({
          ...prev,
          [section]: prev[section].map((item, idx) =>
            idx === index ? { ...item, [name]: value } : item
          ),
        }));
      } else {
        setFormData({ ...formData, [name]: value });
      }
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
      console.log(formData);
      try {
        const response = await axios.post('https://apps.laoagcity.gov.ph:3002/dpscitations', JSON.stringify(formData), config);
        console.log("Response data: ", response.data);
        alert('New DPS Record accepted');
        navigate("/");
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('DPS New Record error.');
        navigate("/");
      }
    };

        <Container className="align-items-center">
      <TopBar username={user.username} userrole={user.userrole} bg="light" expand="lg" data-bs-theme="dark" />
      <h3 className="text-right">New OSCP Application</h3>
      <Form onSubmit={handleSubmit}>
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header>Applicant Information </Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-3">
                <Form.Label>Owner</Form.Label>
                <Form.Control
                  type="text"
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Type of Application</Form.Label>
                <Form.Select
                  name="cPermitType"
                  value={formData.cPermitType}
                  onChange={handleChange}
                >
                  <option value="">Select Permit Type</option>
                  <option value="building">Building</option>
                  <option value="fence">Fence</option>
                  <option value="demolition">Demolition</option>
                </Form.Select>
              </Form.Group>
              <Form.Group as={Col} controlId='dateapplied'>
                <Form.Label>Application Date:</Form.Label>
                <DatePicker
                  selected={formData.dateApplied}
                  onChange={(date) => handleDateChange(date, 'dateApplied')}
                  className="form-control"
                />
              </Form.Group>
            </Accordion.Body>
            <Button variant="primary" size="lg" type="submit">
              Submit
            </Button>{' '}
            <Button variant="secondary" size="lg" onClick={backToHome}>
              Back to Home
            </Button>{' '}
          </Accordion.Item>
        </Accordion>
      </Form>
      <Footer />
    </Container>
   */

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleViolationChange = (index, event) => {
    const { name, value } = event.target;
    const updatedViolations = formData.violations.map((violation, vIndex) => {
      if (index === vIndex) {
        return { ...violation, [name]: value };
      }
      return violation;
    });
    setFormData(prevState => ({
      ...prevState,
      violations: updatedViolations
    }));
  };

  const addViolation = () => {
    setFormData(prevState => ({
      ...prevState,
      violations: [...prevState.violations, { violation: '', amount: '', remarks: '' }]
    }));
  };

  const removeViolation = (index) => {
    setFormData(prevState => ({
      ...prevState,
      violations: prevState.violations.filter((_, vIndex) => vIndex !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      const response = await axios.post('https://apps.laoagcity.gov.ph:3002/dpscitations', JSON.stringify(formData), config);
      console.log("Response data: ", response.data);
      alert('New DPS Record accepted');
      navigate("/");
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('DPS New Record error.');
      navigate("/");
    }
  };

  return (
    <Container className="align-items-center">
      <TopBar username={user.username} userrole={user.userrole} bg="light" expand="lg" data-bs-theme="dark" />
      <h3 className="text-right">New OSCP Application</h3>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            </Form.Group>
          </Col>
        </Row>
        {/* Include other fields following the pattern above 
        <Form.Group controlId="amendStatus">
          <Form.Check type="checkbox" label="Amend Status" name="amendStatus" checked={formData.amendStatus} onChange={handleChange} />
        </Form.Group>*/}
        <h5>Violations</h5>
        {formData.violations.map((violation, index) => (
          <Row key={index}>
            <Col>
              <Form.Group controlId={`violation-${index}`}>
                <Form.Label>Violation</Form.Label>
                <Form.Control type="text" name="violation" value={violation.violation} onChange={(e) => handleViolationChange(index, e)} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId={`amount-${index}`}>
                <Form.Label>Amount</Form.Label>
                <Form.Control type="number" name="amount" value={violation.amount} onChange={(e) => handleViolationChange(index, e)} />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId={`remarks-${index}`}>
                <Form.Label>Remarks</Form.Label>
                <Form.Control type="text" name="remarks" value={violation.remarks} onChange={(e) => handleViolationChange(index, e)} />
              </Form.Group>
            </Col>
            <Col>
              <Button variant="danger" onClick={() => removeViolation(index)}>Remove</Button>
            </Col>
          </Row>
        ))}
        <Button variant="secondary" onClick={addViolation}>Add Violation</Button>
        <br />
        <Button type="submit" >Submit</Button>
        <Button variant="secondary" onClick={backToHome}>
          Back to Home
        </Button>{' '}

      </Form>
    </Container>
  );
}


export default DPSCitationRecordForm;
