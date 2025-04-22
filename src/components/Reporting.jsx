import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Container, Form, Button, Alert, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
import { utils, writeFile } from 'xlsx'; // Import XLSX utilities

import TopBar from './TopBar';
import Footer from './Footer';

const Reporting = () => {
  const [startDate, setStartDate] = useState('');
  const { token, user } = useSelector((state) => state.auth);
  //const [searchQuery, setSearchQuery] = useState(''); // Search input for filtering citations
  const [data, setData] = useState(null);  // Holds API response data
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state
  const [error, setError] = useState('');  // Error state
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');  // New state for payment status filter
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

  const handleApplyFilters = () => {
    fetchDPSCitations();  // Fetch with updated filters
  };

  // Filter data based on payment status
  const filteredCitations = data
    ? data.dpsCitations.filter((citation) => {
      if (paymentStatusFilter === 'paid') {
        return citation.paymentStatus === true;
      }
      if (paymentStatusFilter === 'unpaid') {
        return citation.paymentStatus === false;
      }
      return true; // 'All' case
    })
    : [];

  // Function to download data as Excel file
  const downloadAsExcel = () => {
    const formattedData = filteredCitations
      .filter(citation => {
        if (paymentStatusFilter === 'paid') return citation.paymentStatus;
        if (paymentStatusFilter === 'unpaid') return !citation.paymentStatus;
        return true;
      })
      .map(citation => ({
        'Ticket Number': citation.ticketNumber,
        'Violations': citation.violations.map(violation => `${violation.violation} - ₱${violation.amount}`).join(', '),
        'Amount Paid': citation.amountPaid ? `₱${citation.amountPaid}` : 'N/A',
        ...(paymentStatusFilter === 'paid' && citation.paymentStatus && {
          '50% of Amount Paid': `₱${(citation.amountPaid * 0.5).toFixed(2)}`,
          '30% of Amount Paid': `₱${(citation.amountPaid * 0.3).toFixed(2)}`,
          '20% of Amount Paid': `₱${(citation.amountPaid * 0.2).toFixed(2)}`,
        }),
        'OR Number': citation.paymentORNumber,
        'Payment Date': `${citation.paymentDate ? new Date(citation.paymentDate).toLocaleDateString() : 'N/A'}`,
        'Apprehending Officer': citation.apprehendingOfficer,
        'Unit': citation.apprehendingUnitOf,
      }));

    const worksheet = utils.json_to_sheet(formattedData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, `DPS Citations Report`);
    writeFile(workbook, `DPS Citations ${startDate} to ${endDate}` + '.xlsx');
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
        {/* Dropdown for Payment Status */}
        <Form.Select
          value={paymentStatusFilter}
          onChange={(e) => setPaymentStatusFilter(e.target.value)}
          className="mb-2"
        >
          <option value="all">All</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
        </Form.Select>

        <Button variant="primary" onClick={handleApplyFilters} disabled={loading} className="mb-2">
          Apply Filters
        </Button>

        <Button variant="success" onClick={downloadAsExcel} className="mb-2">
          Download as PDF
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
                <th>Full Name</th>
                <th>Home Address</th>
                <th>License Number</th>
                <th>Date Apprehended</th>
                <th>Amount Paid</th>
                {paymentStatusFilter === 'paid' && (
                  <>
                    <th>50% Share</th>
                    <th>30% Share</th>
                    <th>20% Share</th>
                  </>
                )}
                <th>Violations</th>
                <th>Vehicle Type</th>
                <th>Plate No.</th>
                <th>Apprehending Officer</th>
                <th>Apprehending</th>
              </tr>
            </thead>
            <tbody>
              {filteredCitations
                .filter(citation => {
                  if (paymentStatusFilter === 'paid') return citation.paymentStatus;
                  if (paymentStatusFilter === 'unpaid') return !citation.paymentStatus;
                  return true;
                })
                .map(citation => (
                  <tr key={citation._id}>
                    <td>{citation.ticketNumber}</td>
                    <td>{`${citation.firstName} ${citation.middleName} ${citation.lastName}`}</td>
                    <td>{citation.homeAddress}</td>
                    <td>{citation.licenseNumber}</td>
                    <td>{new Date(citation.dateApprehended).toLocaleDateString()}</td>
                    <td>{citation.amountPaid ? `₱${citation.amountPaid}` : 'N/A'}</td>
                    {paymentStatusFilter === 'paid' && citation.paymentStatus && (
                      <>
                        <td>{`₱${(citation.amountPaid * 0.5).toFixed(2)}`}</td>  {/* 50% */}
                        <td>{`₱${(citation.amountPaid * 0.3).toFixed(2)}`}</td>  {/* 30% */}
                        <td>{`₱${(citation.amountPaid * 0.2).toFixed(2)}`}</td>  {/* 20% */}
                      </>
                    )}
                    <td>
                      <ul>
                        {citation.violations.map((violation, index) => (
                          <li key={index}>
                            Violation: {violation.violation}, Amount: ₱{violation.amount}, Remarks: {violation.remarks}
                          </li>
                        ))}
                      </ul>
                    </td>
                    {/*<td>{citation.paymentORNumber}</td>*/}
                    {/*<td>{citation.paymentDate ? new Date(citation.paymentDate).toLocaleDateString() : 'N/A'}</td>*/}
                    {/*<td>{citation.paymentRemarks}</td> */}
                    <td>{citation.vehicleColor}</td>
                    <td>{citation.plateNumber}</td>
                    <td>{citation.apprehendingOfficer}</td>
                    <td>{citation.apprehendingUnitOf}</td>
                  </tr>
                ))}
            </tbody>          </Table>
        </>
      )}
      <Footer />
    </Container>
  );
};

export default Reporting;
{/* OLD CODE
  import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Container, Form, Button, Alert, Spinner, Table } from 'react-bootstrap';
import axios from 'axios';
import { utils, writeFile } from 'xlsx'; // Import XLSX utilities

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
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('All');  // New state for payment status filter
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

  const handleApplyFilters = () => {
    fetchDPSCitations();  // Fetch with updated filters
  };

  // Filter data based on payment status
  const filteredCitations = data
    ? data.dpsCitations.filter((citation) => {
      if (paymentStatusFilter === 'Paid') {
        return citation.paymentStatus === true;
      }
      if (paymentStatusFilter === 'Unpaid') {
        return citation.paymentStatus === false;
      }
      return true; // 'All' case
    })
    : [];

  // Function to download data as Excel file
  const downloadAsExcel = () => {
    const formattedData = filteredCitations.map(citation => ({
      'Ticket Number': citation.ticketNumber,
      'Full Name': `${citation.firstName} ${citation.middleName} ${citation.lastName}`,  // Combined full name
      'Home Address': citation.homeAddress,
      'License Number': citation.licenseNumber,
      'Amount Paid': citation.amountPaid ? `PhP${citation.amountPaid}` : 'N/A',  // Changed to ₱
      'Payment Date': citation.paymentDate ? new Date(citation.paymentDate).toLocaleDateString() : 'N/A',
      'Payment Remarks': citation.paymentRemarks,
      'Date Apprehended': new Date(citation.dateApprehended).toLocaleDateString(),
      'Apprehending Officer': citation.apprehendingOfficer,
      'Unit': citation.apprehendingUnitOf,
      'Paid': citation.paymentStatus ? 'Paid' : 'Unpaid',
      'OR Number': citation.paymentORNumber,
      'Violations': citation.violations.map(violation => `${violation.violation} - PhP${violation.amount}`).join(', '),  // Comma-separated violations
      '000000': '-------',
      'Time Apprehended': citation.timeApprehended ? new Date(citation.timeApprehended).toLocaleTimeString() : 'N/A',
      'Street Apprehended': citation.streetApprehended,
      'Vehicle Color': citation.vehicleColor,
      'Commute Status': citation.commuteStatus ? 'Yes' : 'No',
      'Commute Date': citation.commuteDate ? new Date(citation.commuteDate).toLocaleDateString() : 'N/A',
      'Commuted Violation': citation.commutedViolation,
      'Commuted ViolationAmount': citation.commutedViolationAmount ? `₱${citation.commutedViolationAmount}` : 'N/A',
      'Commuted ViolationRemark': citation.commutedViolationRemark,
      'Payment Status': citation.paymentStatus ? 'Paid' : 'Unpaid',
      'Payment OR Number': citation.paymentORNumber,
    }));

    const worksheet = utils.json_to_sheet(formattedData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'DPS Citations');
    writeFile(workbook, 'DPS_Citations.xlsx');
  };


  return (
    <Container className="align-items-center">
      <TopBar username={user.username} userrole={user.userrole} bg="light" expand="lg" data-bs-theme="light" />

      <h3 className="text-center">DPS Citations Search and Filter</h3>

// Filters Section
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
  // Dropdown for Payment Status
  <Form.Select
    value={paymentStatusFilter}
    onChange={(e) => setPaymentStatusFilter(e.target.value)}
    className="mb-2"
  >
    <option value="All">All</option>
    <option value="Paid">Paid</option>
    <option value="Unpaid">Unpaid</option>
  </Form.Select>

  <Button variant="primary" onClick={handleApplyFilters} disabled={loading} className="mb-2">
    Apply Filters
  </Button>

  <Button variant="success" onClick={downloadAsExcel} className="mb-2">
    Download as Excel
  </Button>
</Form>

// Data Loading, Error, and Display Section 
{ loading && <Spinner animation="border" className="mt-3" /> }
{ error && <Alert variant="danger" className="mt-3">{error}</Alert> }

// Table to Display Citations
{
  data && !loading && (
    <>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Ticket Number</th>
            <th>Full Name</th>
            <th>License Number</th>
            <th>Date Apprehended</th>
            <th>Apprehending Officer</th>
            <th>Apprehending</th>
                 <th>Commuted</th>
                <th>Commute Date</th>
                <th>Commuted Violation</th>
                <th>Commuted Violation Amount</th>
                <th>Commuted Violation Remark</th>
                <th>Paid</th>
            <th>Payment OR Number</th>
            <th>Amount Paid</th>
            <th>Payment Date</th>
            <th>Payment Remarks</th>
            <th>Violation/s</th>
          </tr >
        </thead >
  <tbody>
    {filteredCitations.map((citation) => (
      <tr key={citation._id}>
        <td>{citation.ticketNumber}</td>
        <td>{`${citation.firstName} ${citation.middleName} ${citation.lastName}`}</td>
        <td>{citation.licenseNumber}</td>
        <td>{new Date(citation.dateApprehended).toLocaleDateString()}</td>
        <td>{citation.apprehendingOfficer}</td>
        <td>{citation.apprehendingUnitOf}</td>
                           <td>{citation.commuteStatus ? 'Yes' : 'No'}</td>
                  <td>{citation.commuteDate ? new Date(citation.commuteDate).toLocaleDateString() : 'N/A'}</td>
                  <td>{citation.commutedViolation}</td>
                  <td>{citation.commutedViolationAmount ? `₱${citation.commutedViolationAmount}` : 'N/A'}</td>
                  <td>{citation.commutedViolationRemark}</td>
                  <td>{citation.paymentStatus ? 'Paid' : 'Unpaid'}</td>
        <td>{citation.paymentORNumber}</td>
        <td>{citation.amountPaid ? `Php${citation.amountPaid}` : 'N/A'}</td>
        <td>{citation.paymentDate ? new Date(citation.paymentDate).toLocaleDateString() : 'N/A'}</td>
        <td>{citation.paymentRemarks}</td>
        <td>
          <ul>
            {citation.violations.map((violation, index) => (
              <li key={index}>
                Violation: {violation.violation}, Amount: ₱{violation.amount}, Remarks: {violation.remarks}
              </li>
            ))}
          </ul>
        </td>
      </tr >
    ))}
  </tbody >
      </Table >
    </>
  )
}
<Footer />
    </Container >
  );
};

export default Reporting;

  
  */}
