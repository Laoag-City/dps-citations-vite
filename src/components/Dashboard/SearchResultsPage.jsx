import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { Table, Alert, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import CitationPrint from './CitationPrint';
import './CitationTable.css'; // Import the CSS file for print styles
import './CitationPrint.css';


const SearchResults = ({ searchResults, error, handleShow, getRowClass, handleCommuteClick, handlePaymentClick, formatDate, violationCount, userRole }) => {
  const [selectedCitation, setSelectedCitation] = useState(null);
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Citation Details',
    onAfterPrint: () => setSelectedCitation(null)
  });

  const handlePrintClick = (citation) => {
    setSelectedCitation(citation);
    setTimeout(() => {
      handlePrint();
    }, 0);
  };

  return (
    <div>
      <h3 className="text-right">Search Results</h3>
      {searchResults ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Ticket Number</th>
              <th>Name</th>
              <th>License Number</th>
              <th>Date Apprehended</th>
              <th>Street Apprehended</th>
              <th>Plate Number</th>
              <th>Vehicle Color</th>
              <th>Apprehending Officer</th>
              <th>Commute Status</th>
              <th>Payment Status</th>
              <th>Violations</th>
              <th>Print</th>
            </tr>
          </thead>
          <tbody>
            {searchResults.length > 0 ? (
              searchResults.map((citation) => (
                <tr key={citation._id} className={getRowClass(citation.dateApprehended)}>
                  <td onClick={() => handleShow(citation)}>{citation.ticketNumber}</td>
                  <td>{citation.lastName === 'N/A' || citation.lastName === 'n/a' || citation.lastName === 'NA' ? 'N/A' : citation.lastName + ', ' + citation.firstName + " " + citation.middleName[0] + '.'}</td>
                  <td>{citation.licenseNumber}</td>
                  <td>{formatDate(citation.dateApprehended)}</td>
                  <td>{citation.streetApprehended}</td>
                  <td>{citation.plateNumber}</td>
                  <td>{citation.vehicleColor}</td>
                  <td>{citation.apprehendingOfficer}</td>
                  <td>
                    {userRole === 'dpshead' && (!citation.commuteStatus || citation.commuteStatus === undefined) ? <Button variant="warning" onClick={() => handleCommuteClick(citation)}>Commute</Button> : 'No'}
                    {/*citation.commuteStatus ? 'Commuted' : citation.paymentStatus ? 'Not Commuted' : <Button variant="warning" onClick={() => handleCommuteClick(citation)}>Commute</Button>*/}
                  </td>
                  <td>
                    {userRole === 'dpsstaff' && (!citation.paymentStatus || citation.paymentStatus === undefined) ? <Button variant="warning" onClick={() => handlePaymentClick(citation)}>Pay</Button> : 'No'}
                    {/*citation.paymentStatus ? 'Paid' : userRole === 'dpsstaff' ? <Button variant="warning" onClick={() => handlePaymentClick(citation)}>Pay</Button> : 'Unpaid'*/}
                  </td>
                  <td>{violationCount(citation.violations)}</td>
                  <td><Link onClick={() => handlePrintClick(citation)}>Print</Link></td>
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
      {/* Hidden section for printing */}
      {selectedCitation && (
        /*<div style={{ display: 'none' }}>*/
        <div style={{ display: 'none' }}>
          <CitationPrint citation={selectedCitation} ref={printRef} />
        </div>
      )}
    </div>
  );
};

SearchResults.propTypes = {
  searchResults: PropTypes.array.isRequired,
  error: PropTypes.string,
  handleShow: PropTypes.func.isRequired,
  getRowClass: PropTypes.func.isRequired,
  handleCommuteClick: PropTypes.func.isRequired,
  handlePaymentClick: PropTypes.func.isRequired,
  formatDate: PropTypes.func.isRequired,
  violationCount: PropTypes.func.isRequired,
  userRole: PropTypes.string
};

export default SearchResults;
