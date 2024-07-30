import { Pagination } from 'react-bootstrap';

const CustomPagination = ({ currentPage, totalPages, handlePageChange }) => {
  const renderPaginationItems = () => {
    const items = [];
    const pageNeighbors = 2;
    const totalNumbers = pageNeighbors * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbors);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbors);

      items.push(
        <Pagination.Item key={1} active={currentPage === 1} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );

      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }

      for (let page = startPage; page <= endPage; page++) {
        items.push(
          <Pagination.Item key={page} active={currentPage === page} onClick={() => handlePageChange(page)}>
            {page}
          </Pagination.Item>
        );
      }

      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }

      items.push(
        <Pagination.Item key={totalPages} active={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    } else {
      for (let page = 1; page <= totalPages; page++) {
        items.push(
          <Pagination.Item key={page} active={currentPage === page} onClick={() => handlePageChange(page)}>
            {page}
          </Pagination.Item>
        );
      }
    }

    return items;
  };

  return <Pagination className="mt-3">{renderPaginationItems()}</Pagination>;
};

export default CustomPagination;
