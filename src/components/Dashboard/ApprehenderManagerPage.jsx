import { useState } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import useFetchApprehenders from '../hooks/useFetchApprehenders';

const ApprehenderManager = () => {
  const { apprehendersList, setApprehendersList, error: apprehendersError } = useFetchApprehenders(localStorage.getItem('token'));
  const [formData, setFormData] = useState({ title: '', firstName: '', lastName: '', midName: '', designation: '', unit: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.firstName || !formData.lastName || !formData.designation || !formData.unit) {
      setError('All required fields must be filled.');
      return;
    }

    try {
      if (editIndex !== null) {
        // Update existing apprehender
        const updatedApprehenders = [...apprehendersList];
        updatedApprehenders[editIndex] = formData;
        setApprehendersList(updatedApprehenders);
        // Normally, you would send a PUT request here if the API supports it
      } else {
        // Create new apprehender
        const response = await axios.post('https://apps.laoagcity.gov.ph:3002/apprehenders', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure proper authentication
          },
        });
        setApprehendersList([...apprehendersList, response.data]);
      }
      setFormData({ title: '', firstName: '', lastName: '', midName: '', designation: '', unit: '' });
      setEditIndex(null);
    } catch (error) {
      setError('Error saving apprehender');
    }
  };

  const handleEdit = (index) => {
    setFormData(apprehendersList[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedApprehenders = apprehendersList.filter((_, i) => i !== index);
    setApprehendersList(updatedApprehenders);
    // Normally, you would send a DELETE request here if the API supports it
  };

  return (
    <Container>
      <h2>Apprehender Manager</h2>
      {apprehendersError && <p className="text-danger">{apprehendersError}</p>}
      {error && <p className="text-danger">{error}</p>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="midName">
          <Form.Label>Middle Name</Form.Label>
          <Form.Control
            type="text"
            name="midName"
            value={formData.midName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="designation">
          <Form.Label>Designation</Form.Label>
          <Form.Control
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="unit">
          <Form.Label>Unit</Form.Label>
          <Form.Control
            as="select"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
          >
            <option value="">Select Unit</option>
            <option value="PNP">PNP</option>
            <option value="DPS">DPS</option>
            <option value="BRGY">BRGY</option>
          </Form.Control>
        </Form.Group>
        <Button type="submit" className="mt-3">
          {editIndex !== null ? 'Update Apprehender' : 'Add Apprehender'}
        </Button>
      </Form>
      <h3 className="mt-4">Existing Apprehenders</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Middle Name</th>
            <th>Designation</th>
            <th>Unit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apprehendersList.map((apprehender, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{apprehender.title}</td>
              <td>{apprehender.firstName}</td>
              <td>{apprehender.lastName}</td>
              <td>{apprehender.midName}</td>
              <td>{apprehender.designation}</td>
              <td>{apprehender.unit}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(index)} className="me-2">
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(index)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ApprehenderManager;
