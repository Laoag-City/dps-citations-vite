export const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : null);

export const getRowClass = (dateApprehended) => {
  const dayDifference = (new Date() - new Date(dateApprehended)) / (1000 * 60 * 60 * 24);

  if (dayDifference > 30) return 'table-danger';
  if (dayDifference > 60) return 'table-warning';
  return '';
};
