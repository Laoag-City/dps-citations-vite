import { useNavigate } from 'react-router-dom';

export const sumAmounts = (amounts) => {
  const total = amounts.map((item) => item.amount).reduce((acc, curr) => acc + curr, 0);
  return parseFloat(total.toFixed(2));
};

export const getStatusFromTab = (tab) => {
  switch (tab) {
    case 'paid':
      return 'paid';
    case 'unpaid':
      return 'unpaid';
    case 'delinquent':
      return 'delinquent';
    case 'for-case-filing':
      return 'for-case-filing';
    default:
      return 'all';
  }
};

export const getRowClass = (dateApprehended) => {
  const dayDifference = (new Date() - new Date(dateApprehended)) / (1000 * 60 * 60 * 24);

  if (dayDifference > 30) return 'table-danger';
  if (dayDifference > 60) return 'table-warning';
  return '';
};

export const useCitationActions = () => {
  const navigate = useNavigate();

  const handleCommuteClick = (citationId) => {
    navigate(`/commute-update/${citationId}`);
  };

  const handlePaymentClick = (citationId) => {
    navigate(`/payment-update/${citationId}`);
  };

  return {
    handleCommuteClick,
    handlePaymentClick,
  };
};

  export function toPascalCase(inputstr) {
    return inputstr
      .toLowerCase()
      .replace(/(?:^|\s+)(.)/g, function(match, chr) {
        return chr.toUpperCase();
      });
  }