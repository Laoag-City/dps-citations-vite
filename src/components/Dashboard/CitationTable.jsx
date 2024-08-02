import PropTypes from 'prop-types';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Table, Button } from 'react-bootstrap';
import { formatDate } from '../../utils/dateUtils';
import { sumAmounts, getRowClass } from '../../utils/citationUtils';
import { Link, useNavigate } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';
import CitationPrint from './CitationPrint';
import './CitationTable.css'; // Import the CSS file for print styles
import './CitationPrint.css';

const CitationTable = ({ citations, isPaidTab = false }) => {
  const [sortField, setSortField] = useState('dateApprehended');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCitation, setSelectedCitation] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  //const tableRef = useRef();
  const printRef = useRef();

  const handleCommuteClick = (citation) => {
    navigate(`/commute-update/${citation._id}`);
  };

  const handlePaymentClick = (citation) => {
    navigate(`/payment-update/${citation._id}`);
  };

  const handleSortChange = (field) => {
    const order = (sortField === field && sortOrder === 'asc') ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
  };

  const handlePrintClick = (citation) => {
    setSelectedCitation(citation);
    setTimeout(() => {
      handlePrint();
    }, 0);
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'DPS Laoag City Citation Record Printout',
    onAfterPrint: () => setSelectedCitation(null)
  });

  /*   const handlePrint = useReactToPrint({
      content: () => tableRef.current,
      documentTitle: 'Citations',
      onAfterPrint: () => console.log('Print successful!')
    });
   */
  return (
    <>
      {/*<Table striped bordered hover ref={tableRef}>*/}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSortChange('ticketNumber')}>Ticket Number</th>
            <th onClick={() => handleSortChange('lastname')}>Name</th>
            <th onClick={() => handleSortChange('licenseNumber')}>License Number</th>
            <th onClick={() => handleSortChange('dateApprehended')}>Date Apprehended</th>
            <th onClick={() => handleSortChange('streetApprehended')}>Street Apprehended</th>
            <th onClick={() => handleSortChange('plateNumber')}>Plate Number</th>
            <th onClick={() => handleSortChange('vehicleColor')}>Vehicle Color</th>
            <th onClick={() => handleSortChange('apprehendingOfficer')}>Apprehending Officer</th>
            <th>Amount/Paid</th>
            {!isPaidTab && <th onClick={() => handleSortChange('commuteStatus')}>Commute</th>}
            {!isPaidTab && <th>Paid</th>}
            <th>Print</th>
          </tr>
        </thead>
        <tbody>
          {citations.length > 0 ? (
            citations.map((citation) => (
              <tr key={citation._id} className={getRowClass(citation.dateApprehended)}>
                <td>{citation.ticketNumber}</td>
                <td>{citation.lastName === 'N/A' || citation.lastName === 'n/a' || citation.lastName === 'NA' ? 'N/A' : citation.lastName + ', ' + citation.firstName + " " + citation.middleName[0] + '.'} </td>
                <td>{citation.licenseNumber}</td>
                <td>{formatDate(citation.dateApprehended)}</td>
                <td>{citation.streetApprehended}</td>
                <td>{citation.plateNumber}</td>
                <td>{citation.vehicleColor}</td>
                <td>{citation.apprehendingOfficer}</td>
                <td>{sumAmounts(citation.violations) + " : " + citation.amountPaid}</td>
                {!isPaidTab && (
                  <td>
                    {user.userrole === 'dpshead' && (!citation.commuteStatus || citation.commuteStatus === undefined) ? <Button variant="warning" onClick={() => handleCommuteClick(citation)}>Commute</Button> : 'No'}
                  </td>
                )}
                {!isPaidTab && (
                  <td>
                    {user.userrole === 'dpsstaff' && (!citation.paymentStatus || citation.paymentStatus === undefined) ? <Button variant="warning" onClick={() => handlePaymentClick(citation)}>Pay</Button> : 'No'}
                  </td>
                )}
                <td><Link onClick={() => handlePrintClick(citation)}>Print</Link></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isPaidTab ? 10 : 12} className="text-center">
                No records available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {/* Hidden section for printing */}
      {selectedCitation && (
/*         <div style={{ display: 'none' }}>
 */        <div style={{ display: 'none' }}>
          <CitationPrint citation={selectedCitation} ref={printRef} />
        </div>
      )}
    </>
  );
};

CitationTable.propTypes = {
  citations: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      ticketNumber: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      middleName: PropTypes.string,
      homeAddress: PropTypes.string,
      licenseNumber: PropTypes.string.isRequired,
      dateApprehended: PropTypes.string.isRequired,
      timeApprehended: PropTypes.string,
      streetApprehended: PropTypes.string,
      plateNumber: PropTypes.string,
      vehicleColor: PropTypes.string,
      apprehendingOfficer: PropTypes.string,
      apprehendingUnitOf: PropTypes.string,
      commuteStatus: PropTypes.bool,
      commuteDate: PropTypes.string,
      commutedViolation: PropTypes.string,
      commutedViolationAmount: PropTypes.number,
      commutedViolationRemark: PropTypes.string,
      paymentStatus: PropTypes.bool,
      paymentORNumber: PropTypes.string,
      amountPaid: PropTypes.number,
      paymentDate: PropTypes.string,
      paymentRemarks: PropTypes.string,
      violations: PropTypes.arrayOf(
        PropTypes.shape({
          violation: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
          remarks: PropTypes.string
        })
      ).isRequired
    })
  ).isRequired,
  isPaidTab: PropTypes.bool,
  userRole: PropTypes.string
};

export default CitationTable;
