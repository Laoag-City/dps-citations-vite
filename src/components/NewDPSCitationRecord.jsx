import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Form, Button, Accordion, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import TopBar from './TopBar';
import Footer from './Footer';

function DPSCitationRecordForm() {
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

  const [formData, setFormData] = useState({
    owner: '',
    title: '',
    dateApplied: '',
    conversionStatus: true,
    cPermitStatus: false,
    cPermitType: '',
    ownerName: '',
    applicationTitle: '',
    conversionSignatories: [
      { signatory: 'BFP', status: '', remarks: '', signDate: '' },
      { signatory: 'Assessor', status: '', remarks: '', signDate: '' },
      { signatory: 'Zoning', status: '', remarks: '', signDate: '' },
    ],
    constructionPermitSignatories: [
      { signatory: 'Line and Grade', status: 'Pending', remarks: '', signDate: '' },
      { signatory: 'Structural', status: 'Pending', remarks: '', signDate: '' },
      { signatory: 'Architectural', status: 'Pending', remarks: '', signDate: '' },
      { signatory: 'Electrical', status: 'Pending', remarks: '', signDate: '' },
      { signatory: 'Sanitary', status: 'Pending', remarks: '', signDate: '' },
      { signatory: 'Mechanical', status: 'Pending', remarks: '', signDate: '' },
    ]
  });

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

  return (
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
  );
}

export default DPSCitationRecordForm;
