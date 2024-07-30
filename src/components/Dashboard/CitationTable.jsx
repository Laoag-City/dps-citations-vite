import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';

import { Table, Button, Alert } from 'react-bootstrap';
import { formatDate } from '../../utils/dateUtils';
import { sumAmounts, getRowClass } from '../../utils/citationUtils';
import { useNavigate } from 'react-router-dom';

const CitationTable = ({ citations, isPaidTab = false }) => {
  // /console.log(userRole);
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  const handleCommuteClick = (citation) => {
    navigate(`/commute-update/${citation._id}`);
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
          <th>Amount/Paid</th>
          {!isPaidTab && <th>Commuted</th>}
          {!isPaidTab && <th>Paid</th>}
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
              <td>{sumAmounts(citation.violations) + " " + citation.amountPaid}</td>
              {!isPaidTab && (
                <td>
                  {/*console.log(user.userrole + "," + citation.commuteStatus)*/}
                  {user.userrole === 'dpshead' && (!citation.commuteStatus || citation.commuteStatus === undefined) ? <Button variant="warning" onClick={() => handleCommuteClick(citation)}>Commute</Button> : 'No'}
                </td>
              )}
              {!isPaidTab && (
                <td>
                  {/*console.log(user.userrole + "," + citation.PaymentStatus)*/}
                  {user.userrole === 'dpsstaff' && (!citation.paymentStatus || citation.paymentStatus === undefined) ? <Button variant="warning" onClick={() => handlePaymentClick(citation)}>Pay</Button> : 'No'}
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
    </Table >
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