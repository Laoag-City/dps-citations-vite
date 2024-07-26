import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Container, ListGroup, Modal, Spinner, Table, Pagination } from 'react-bootstrap';
import TopBar from './TopBar';
import Footer from './Footer';
//tabbed-dashboard PR
const Dashboard = () => {
  const { token, user } = useSelector(state => state.auth);
  const [citations, setCitations] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDPSCitationsData = async () => {
      try {
        const response = await axios.get('https://apps.laoagcity.gov.ph:3002/dpscitations', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: currentPage,
            limit: pageSize,
            search: searchQuery,
          },
        });
        setCitations(response.data.dpsCitations);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          dispatch(logout());
          navigate('/login');
        } else {
          setError('Failed to fetch data. Please try again later.');
        }
      }
    };

    fetchDPSCitationsData();
  }, [token, navigate, dispatch, currentPage, pageSize, searchQuery]);

  const handleShow = (citation) => {
    setSelectedCitation(citation);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedCitation(null);
  };

  const formatDate = (date) => date ? new Date(date).toLocaleDateString() : null;

  const sumAmounts = (amounts) => {
    return amounts.map(item => item.amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  }

  const violationCount = (count) => { return count.length }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page on new search
  };

  const renderPaginationItems = () => {
    const items = [];
    const pageNeighbors = 2;
    const totalNumbers = (pageNeighbors * 2) + 3;
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

  const getRowClass = (dateApprehended) => {
    //const dateDifference = (new Date() - new Date(dateApprehended)) / (1000 * 60 * 60 * 24);
    const referenceDate = new Date(dateApprehended);
    const currentDate = new Date();
    const timeDifference = currentDate - referenceDate; // result is in milliseconds
    const dayDifference = timeDifference / (1000 * 60 * 60 * 24); // Convert milliseconds to days

    if (dayDifference > 7) return 'table-danger';
    if (dayDifference > 3) return 'table-warning';
    return '';
  };

  const handleAmendClick = (citation) => {
    // Perform the amend action here
    console.log('Amend action for citation:', citation);
  };


  if (!token) {
    return null;
  }

  return (
    <Container className="align-items-center">
      <TopBar username={user.username} userrole={user.userrole} bg="light" expand="lg" data-bs-theme="light" onSearch={handleSearch} />
      <h3 className="text-right">DPS Citation List</h3>
      {citations ? (
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
              <th>Commute Status</th>
              <th>Violations</th>
            </tr>
          </thead>
          <tbody>
            {citations.map((citation) => (
              <tr key={citation._id} onClick={() => handleShow(citation)} className={getRowClass(citation.dateApprehended)}>
                <td>{citation.ticketNumber}</td>
                <td>{citation.licenseNumber}</td>
                <td>{formatDate(citation.dateApprehended)}</td>
                <td>{citation.streetApprehended}</td>
                <td>{citation.plateNumber}</td>
                <td>{citation.vehicleColor}</td>
                <td>{citation.apprehendingOfficer}</td>
                <td>
                  {/*citation.amendStatus ? 'Commuted' : 'Not Commuted'*/}
                  {citation.amendStatus ? 'Commuted' : <Button variant="warning" onClick={() => handleAmendClick(citation)}>Commute</Button>}
                </td>
                <td>{violationCount(citation.violations)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        error ? <Alert variant="danger" className="mt-3">{error}</Alert> : <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>
      )}
      {citations && (
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Citation Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedCitation ? (
              <>
                <p>Apprehended on: {formatDate(selectedCitation.dateApprehended)}</p>
                <p>Name: {selectedCitation.lastName}, {selectedCitation.firstName}</p>
                <p>Apprehended by: {selectedCitation.apprehendingOfficer}</p>
                <p>Total: {sumAmounts(selectedCitation.violations)} | {selectedCitation.amendStatus ? 'Amended' : 'Not Amended'}</p>
                <ListGroup.Item><strong>Violation/s:</strong>
                  {selectedCitation.violations.map((violation) => (
                    <div key={violation._id}>
                      {violation.violation} - {violation.amount} on {violation.remarks}
                    </div>
                  ))}
                </ListGroup.Item>
              </>
            ) : (
              <p>Loading...</p>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      <Pagination className="mt-3">
        {renderPaginationItems()}
      </Pagination>
      <Footer />
    </Container>
  );
};

export default Dashboard;
