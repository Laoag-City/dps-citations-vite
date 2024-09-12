import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container, Form, Button, Alert, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';

import TopBar from './TopBar';
import Footer from './Footer';

const Reporting = () => {
  const [startDate, setStartDate] = useState('');
  const { token, user } = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState(''); // Search input for filtering citations
  const [data, setData] = useState(null);  // Holds API response data
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState('');  // Error state
  const apiUrl = 'https://apps.laoagcity.gov.ph:3002/dpscitations';  // API endpoint

  // Fetch DPS Citations based on filters
  const fetchDPSCitations = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          startDate,
          endDate,
          limit: 99999  // Large limit to fetch all results
        }
      });
      console.log(response);
      setData(response.data);
    } catch (error) {
      setError('Failed to fetch DPS Citations', error);
    }
    setLoading(false);
  };

  // Fetch data when filters are applied
  //useEffect(() => {
  //  fetchDPSCitations();
  //}, [startDate, endDate, searchQuery]);

  const handleApplyFilters = () => {
    fetchDPSCitations();  // Fetch with updated filters
  };

  return (
    <Container className="align-items-center">
      <TopBar username={user.username} userrole={user.userrole} bg="light" expand="lg" data-bs-theme="light" />

      <h3 className="text-center">DPS Citations Search and Filter</h3>

      {/* Filters Section */}
      <Form className="d-flex flex-column align-items-center">
        <Form.Control
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="mb-2"
        />
        <Form.Control
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="mb-2"
        />
        <Form.Control
          type="text"
          placeholder="Search Citations"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-2"
        />
        <Button variant="primary" onClick={handleApplyFilters} disabled={loading}>
          Apply Filters
        </Button>
      </Form>

      {/* Data Loading, Error, and Display Section */}
      {loading && <Spinner animation="border" className="mt-3" />}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {/* Table to Display Citations */}
      {data && !loading && (
        <>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Ticket Number</th>
                <th>First Name</th>
                <th>Middle Name</th>
                <th>Last Name</th>
                <th>Home Address</th>
                <th>License Number</th>
                <th>Date Apprehended</th>
                <th>Time Apprehended</th>
                <th>Street Apprehended</th>
                <th>Plate Number</th>
                <th>Vehicle Color</th>
                <th>Apprehending Officer</th>
                <th>Apprehending Unit</th>
                <th>Commute Status</th>
                <th>Commute Date</th>
                <th>Commuted Violation</th>
                <th>Commuted Violation Amount</th>
                <th>Commuted Violation Remark</th>
                <th>Payment Status</th>
                <th>Payment OR Number</th>
                <th>Amount Paid</th>
                <th>Payment Date</th>
                <th>Payment Remarks</th>
                <th>Violations</th>
              </tr>
            </thead>
            <tbody>
              {data.dpsCitations.map(citation => (
                <tr key={citation._id}>
                  <td>{citation.ticketNumber}</td>
                  <td>{citation.firstName}</td>
                  <td>{citation.middleName}</td>
                  <td>{citation.lastName}</td>
                  <td>{citation.homeAddress}</td>
                  <td>{citation.licenseNumber}</td>
                  <td>{new Date(citation.dateApprehended).toLocaleDateString()}</td>
                  <td>{citation.timeApprehended ? new Date(citation.timeApprehended).toLocaleTimeString() : 'N/A'}</td>
                  <td>{citation.streetApprehended}</td>
                  <td>{citation.plateNumber}</td>
                  <td>{citation.vehicleColor}</td>
                  <td>{citation.apprehendingOfficer}</td>
                  <td>{citation.apprehendingUnitOf}</td>
                  <td>{citation.commuteStatus ? 'Yes' : 'No'}</td>
                  <td>{citation.commuteDate ? new Date(citation.commuteDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{citation.commutedViolation}</td>
                  <td>{citation.commutedViolationAmount ? `$${citation.commutedViolationAmount}` : 'N/A'}</td>
                  <td>{citation.commutedViolationRemark}</td>
                  <td>{citation.paymentStatus ? 'Paid' : 'Unpaid'}</td>
                  <td>{citation.paymentORNumber}</td>
                  <td>{citation.amountPaid ? `$${citation.amountPaid}` : 'N/A'}</td>
                  <td>{citation.paymentDate ? new Date(citation.paymentDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{citation.paymentRemarks}</td>
                  <td>
                    <ul>
                      {citation.violations.map((violation, index) => (
                        <li key={index}>
                          Violation: {violation.violation}, Amount: ${violation.amount}, Remarks: {violation.remarks}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
      <Footer />
    </Container>
  );
};

export default Reporting;
