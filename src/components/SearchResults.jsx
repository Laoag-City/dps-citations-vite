// File path: src/components/SearchResults.jsx

import { Table, Alert, Spinner, Button } from 'react-bootstrap';

const SearchResults = ({ searchResults, error, handleShow, getRowClass, handleAmendClick, formatDate, violationCount }) => {
  return (
    <div>
      <h3 className="text-right">Search Results</h3>
      {searchResults ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Ticket Number</th>
              <th>License Number</th>
              <th>Date Apprehended</th>
              <th>Street Apprehended</th>
              <th>Plate Number</th>
              <th>Vehicle Color</th>
              <th>Apprehending Officer</th>
              <th>Commute Status</th>
              <th>Payment Status</th>
              <th>Violations</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.length > 0 ? (
              searchResults.map((citation) => (
                <tr key={citation._id} className={getRowClass(citation.dateApprehended)}>
                  <td onClick={() => handleShow(citation)}>{citation.ticketNumber}</td>
                  <td>{citation.licenseNumber}</td>
                  <td>{formatDate(citation.dateApprehended)}</td>
                  <td>{citation.streetApprehended}</td>
                  <td>{citation.plateNumber}</td>
                  <td>{citation.vehicleColor}</td>
                  <td>{citation.apprehendingOfficer}</td>
                  <td>{citation.commuteStatus ? 'Commuted' : <Button variant="warning" onClick={() => handleAmendClick(citation)}>Commute</Button>}</td>
                  <td>{citation.paymentStatus ? 'Paid' : <Button variant="warning" onClick={() => handleAmendClick(citation)}>Pay</Button>}</td>
                  <td>{violationCount(citation.violations)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">No records available</td>
              </tr>
            )}
          </tbody>
        </Table>
      ) : (
        error ? <Alert variant="danger" className="mt-3">{error}</Alert> : <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
      )}
    </div>
  );
};

export default SearchResults;
