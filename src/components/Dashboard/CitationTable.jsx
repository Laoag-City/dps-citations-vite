import { Table, Button } from 'react-bootstrap';
import { formatDate, getRowClass } from '../../utils/dateUtils';
import { sumAmounts } from '../../utils/citationUtils';
import { useNavigate } from 'react-router-dom';

const CitationTable = ({ citations, isPaidTab = false }) => {
  const navigate = useNavigate();

  const handleCommuteClick = (citation) => {
    console.log('Commute action for citation:', citation);
  };

  const handlePaymentClick = (citation) => {
    navigate(`/payment-update/${citation._id}`);
  };

  return (
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
          <th>Amount</th>
          {!isPaidTab && <th>Commute Status</th>}
          {!isPaidTab && <th>Payment Status</th>}
        </tr>
      </thead>
      <tbody>
        {citations.length > 0 ? (
          citations.map((citation) => (
            <tr key={citation._id} className={getRowClass(citation.dateApprehended)}>
              <td>{citation.ticketNumber}</td>
              <td>{citation.licenseNumber}</td>
              <td>{formatDate(citation.dateApprehended)}</td>
              <td>{citation.streetApprehended}</td>
              <td>{citation.plateNumber}</td>
              <td>{citation.vehicleColor}</td>
              <td>{citation.apprehendingOfficer}</td>
              <td>{sumAmounts(citation.violations)}</td>
              {!isPaidTab && (
                <td>
                  {citation.commuteStatus ? 'Commuted' : <Button variant="warning" onClick={() => handleCommuteClick(citation)}>Commute</Button>}
                </td>
              )}
              {!isPaidTab && (
                <td>
                  {citation.paymentStatus ? 'Paid' : <Button variant="warning" onClick={() => handlePaymentClick(citation)}>Pay</Button>}
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={isPaidTab ? 8 : 10} className="text-center">
              No records available
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
};

export default CitationTable;
