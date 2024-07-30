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
