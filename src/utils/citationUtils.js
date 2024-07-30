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
