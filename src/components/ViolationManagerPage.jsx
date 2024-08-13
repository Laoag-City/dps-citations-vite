import { useState } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import useFetchViolations from '../hooks/useFetchViolations';

const ViolationManagerPage = () => {
  const { violationsList, setViolationsList, error: violationsError } = useFetchViolations(localStorage.getItem('token'));
  const [formData, setFormData] = useState({ violation: '', amount: '' });
  const [editIndex, setEditIndex] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.violation || !formData.amount) {
      setError('All fields are required.');
      return;
    }

    try {
      if (editIndex !== null) {
        // Update existing violation
        const updatedViolations = [...violationsList];
        updatedViolations[editIndex] = formData;
        setViolationsList(updatedViolations);
        // Normally, you would send a PUT request here if the API supports it
      } else {
        // Create new violation
        const response = await axios.post('https://apps.laoagcity.gov.ph:3002/dpscitations', formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Ensure proper authentication
          },
        });
        setViolationsList([...violationsList, response.data]);
      }
      setFormData({ violation: '', amount: '' });
      setEditIndex(null);
    } catch (error) {
      setError('Error saving violation');
    }
  };

  const handleEdit = (index) => {
    setFormData(violationsList[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedViolations = violationsList.filter((_, i) => i !== index);
    setViolationsList(updatedViolations);
    // Normally, you would send a DELETE request here if the API supports it
    alert("Not implemented")
  };

  return (
    <Container>
      <h2>Violation Manager</h2>
      {violationsError && <p className="text-danger">{violationsError}</p>}
      {error && <p className="text-danger">{error}</p>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="violation">
          <Form.Label>Violation</Form.Label>
          <Form.Control
            type="text"
            name="violation"
            value={formData.violation}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="amount">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type="submit" className="mt-3">
          {editIndex !== null ? 'Update Violation' : 'Add Violation'}
        </Button>
        <Link onClick={() => navigate("/")}>Back to Dashboard</Link>
      </Form>
      <h3 className="mt-4">Existing Violations</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Violation</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {violationsList.map((violation, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{violation.violation}</td>
              <td>{violation.amount}</td>
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

export default ViolationManagerPage;
