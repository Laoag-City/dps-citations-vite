import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/dateUtils';
import { sumAmounts } from '../../utils/citationUtils';
//import './CitationPrint.css'; // Import the CSS file for print styles

const CitationPrint = React.forwardRef(({ citation }, ref) => {
  return (
    <div ref={ref} className="text-dark bg-white">
      <h3 className='text-center'>Citation Details</h3>
      <p><strong>ID: </strong>{citation._id}</p>
      <p><strong>Ticket Number: </strong> {citation.ticketNumber}</p>
      <p><strong>License Number: </strong> {citation.licenseNumber}</p>
      <p><strong>Date Apprehended: </strong> {formatDate(citation.dateApprehended)}</p>
      <p><strong>Street Apprehended: </strong> {citation.streetApprehended}</p>
      <p><strong>Plate Number: </strong> {citation.plateNumber}</p>
      <p><strong>Vehicle Color: </strong> {citation.vehicleColor}</p>
      <p><strong>Apprehending Officer: </strong> {citation.apprehendingOfficer}</p>
      <p><strong>Apprehending Unit Of: </strong> {citation.apprehendingUnitOf}</p>
      <p><strong>Commute Status: </strong> {citation.commuteStatus ? 'Yes' : 'No'}</p>
      <p><strong>Commute Date: </strong> {formatDate(citation.commuteDate)}</p>
      <p><strong>Commuted Violation: </strong> {citation.commutedViolation}</p>
      <p><strong>Commuted Violation Amount: </strong> Php{citation.commutedViolationAmount}</p>
      <p><strong>Commuted Violation Remark: </strong> {citation.commutedViolationRemark}</p>
      <p><strong>Payment Status: </strong> {citation.paymentStatus ? 'Yes' : 'No'}</p>
      <p><strong>Payment OR Number: </strong> {citation.paymentORNumber}</p>
      <p><strong>Amount Paid: </strong> Php{citation.amountPaid}</p>
      <p><strong>Payment Date: </strong> {formatDate(citation.paymentDate)}</p>
      <p><strong>Payment Remarks: </strong> {citation.paymentRemarks}</p>
      <p><strong>Amount Due/ Amount Paid: </strong> {sumAmounts(citation.violations) + " : " + citation.amountPaid}</p>
      <p><strong>Commuted: </strong> {citation.commuteStatus ? 'Yes' : 'No'}</p>
      <p><strong>Paid: </strong> {citation.paymentStatus ? 'Yes' : 'No'}</p>
      <p><strong>Violation/s: </strong>
        {/*       <ul>
        {citation.violations.map((violation, index) => (
          <li key={index}>{violation.violation}: Php{violation.amount}</li>
        ))}
      </ul>*/}
        {citation.violations.map((violation, index) => (
          <span key={index}>
            {violation.violation}: Php{violation.amount}
            {violation.remarks ? ` - ${violation.remarks}` : ''}
            {index < citation.violations.length - 1 && ', '}
          </span>
        ))}
      </p>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
});

CitationPrint.displayName = 'CitationPrint';
CitationPrint.propTypes = {
  citation: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    ticketNumber: PropTypes.string.isRequired,
    licenseNumber: PropTypes.string.isRequired,
    dateApprehended: PropTypes.string.isRequired,
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
    amountPaid: PropTypes.number,
    paymentStatus: PropTypes.bool,
    paymentORNumber: PropTypes.string,
    paymentDate: PropTypes.string,
    paymentRemarks: PropTypes.string,
    violations: PropTypes.arrayOf(
      PropTypes.shape({
        violation: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired
      })
    ).isRequired
  }).isRequired
};

export default CitationPrint;
