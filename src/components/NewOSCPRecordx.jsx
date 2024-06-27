import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Col, Row } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import TopBar from './TopBar';
import Footer from './Footer';

const NewOSCPRecord = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    owner: '',
    title: '',
    dateApplied: new Date(),
    conversionStatus: false,
    cPermitStatus: false,
    cPermitType: '',
    ownerName: '',
    applicationTitle: '',
    conversionSignatories: [
      { signatory: 'BFP', status: '', remarks: '', signDate: new Date() },
      { signatory: 'Assessor', status: '', remarks: '', signDate: new Date() },
      { signatory: 'Zoning', status: '', remarks: '', signDate: new Date() },
    ],
    constructionPermitSignatories: [
      { signatory: 'Line and Grade', status: '', remarks: '', signDate: new Date() },
      { signatory: 'Structural', status: '', remarks: '', signDate: new Date() },
      { signatory: 'Architectural', status: '', remarks: '', signDate: new Date() },
      { signatory: 'Electrical', status: '', remarks: '', signDate: new Date() },
      { signatory: 'Sanitary', status: '', remarks: '', signDate: new Date() },
      { signatory: 'Mechanical', status: '', remarks: '', signDate: new Date() },
    ],
  });
  const { token, user } = useSelector(state => state.auth);
  const backToHome = () => {
    navigate('/');
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("Changing:", name, value)
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
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

  const handleSignatoryChange = (index, key, value, section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((signatory, i) =>
        i === index ? { ...signatory, [key]: value } : signatory
      ),
    }));
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData)
    //console.log(JSON.stringify(formData));
    try {
      const response = await axios.post('https://apps.laoagcity.gov.ph:3001/oscpapplications', JSON.stringify(formData), config);
      console.log("Response data: ", response.data);
      alert('New OSCP Application accepted');
      //const data = await response.json(); // Assuming response is JSON
      navigate("/");
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('OSCP New Application error.');
      navigate("/");
    }
  };

  return (
    <div>
      <TopBar username={user.username} userrole={user.userrole} />
      <Container className="py-3 text-center">
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId='owner'>
              <Form.Label>Owner</Form.Label>
              <Form.Control
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleInputChange}
                placeholder="Owner"
              />
            </Form.Group>

            <Form.Group as={Col} controlId='title'>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Construction Permit Type</Form.Label>
              <Form.Select
                name="cPermitType"
                value={formData.cPermitType}
                onChange={handleInputChange}
              >
                <option value="">Select Permit Type</option>
                <option value="building">Building</option>
                <option value="fence">Fence</option>
                <option value="demolition">Demolition</option>
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} controlId='dateapplied'>
              <Form.Label>Date Applied</Form.Label>
              <DatePicker
                selected={formData.dateApplied}
                onChange={(date) => handleDateChange(date, 'dateApplied')}
                className="form-control"
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Type Of Application:</Form.Label>
              <DatePicker
                selected={formData.dateApplied}
                onChange={(date) => handleDateChange(date, 'dateApplied')}
                className="form-control"
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Conversion Status</Form.Label>
              <Form.Check
                type="switch"
                id="conversion-status-switch"
                name="conversionStatus"
                checked={formData.conversionStatus}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Construction Permit Status</Form.Label>
              <Form.Check
                type="switch"
                id="construction-permit-status-switch"
                name="cPermitStatus"
                checked={formData.cPermitStatus}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Row>

          {/* Additional fields for ownerName and applicationTitle */}
          <Row className="mb-3">
            <Form.Group as={Col}>
              <Form.Label>Owner Name</Form.Label>
              <Form.Control
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                placeholder="Owner Name"
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>Application Title</Form.Label>
              <Form.Control
                type="text"
                name="applicationTitle"
                value={formData.applicationTitle}
                onChange={handleInputChange}
                placeholder="Application Title"
              />
            </Form.Group>
          </Row>
          {/* Conversion Signatories Section */}
          <h3>Conversion Signatories</h3>
          {/* Labels Row */}
          <Row className="mb-2">
            <Col><strong>Signatory</strong></Col>
            <Col><strong>Status</strong></Col>
            <Col><strong>Remarks</strong></Col>
            <Col><strong>Sign Date</strong></Col>
          </Row>
          {formData.conversionSignatories.map((signatory, index) => (
            <Row className="mb-3" key={`conversion-signatory-${index}`}>
              <Col>
                <Form.Control
                  type="text"
                  readOnly
                  defaultValue={signatory.signatory}
                />
              </Col>
              <Col>
                <Form.Control
                  as="select"
                  value={signatory.status}
                  onChange={(e) => handleSignatoryChange(index, 'status', e.target.value, 'conversionSignatories')}
                >
                  <option value="">Select Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </Form.Control>
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  value={signatory.remarks}
                  onChange={(e) => handleSignatoryChange(index, 'remarks', e.target.value, 'conversionSignatories')}
                />
              </Col>
              <Col>
                <DatePicker
                  selected={new Date(signatory.signDate)}
                  onChange={(date) => handleDateChange(date, 'signDate', index, 'conversionSignatories')}
                  className="form-control"
                />
              </Col>
            </Row>
          ))}

          {/* Construction Permit Signatories Section */}
          <h3>Construction Permit Signatories</h3>
          {/* Labels Row */}
          <Row className="mb-2">
            <Col><strong>Signatory</strong></Col>
            <Col><strong>Status</strong></Col>
            <Col><strong>Remarks</strong></Col>
            <Col><strong>Sign Date</strong></Col>
          </Row>
          {/* Signatories Rows */}
          {formData.constructionPermitSignatories.map((signatory, index) => (
            <Row className="mb-3" key={`construction-signatory-${index}`}>
              <Col>
                <Form.Control
                  type="text"
                  readOnly
                  defaultValue={signatory.signatory}
                />
              </Col>
              <Col>
                <Form.Control
                  as="select"
                  value={signatory.status}
                  onChange={(e) => handleSignatoryChange(index, 'status', e.target.value, 'constructionPermitSignatories')}
                >
                  <option value="">Select Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </Form.Control>
              </Col>
              <Col>
                <Form.Control
                  type="text"
                  value={signatory.remarks}
                  onChange={(e) => handleSignatoryChange(index, 'remarks', e.target.value, 'constructionPermitSignatories')}
                />
              </Col>
              <Col>
                <DatePicker
                  selected={new Date(signatory.signDate)}
                  onChange={(date) => handleDateChange(date, 'signDate', index, 'constructionPermitSignatories')}
                  className="form-control"
                />
              </Col>
            </Row>
          ))}
          <Button variant="primary" type="submit">Submit</Button>
          <Button onClick={backToHome} variant="secondary">Back</Button>
        </Form>
      </Container>
      <Footer />
    </div>
  );
};

export default NewOSCPRecord;
