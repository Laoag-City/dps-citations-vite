// File path: src/components/Dashboard.jsx
//TODO: use env or production endpoints
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Table, Pagination, Tabs, Tab } from 'react-bootstrap';
import TopBar from './TopBar';
import Footer from './Footer';
import SearchResults from './SearchResultsPage';

const Dashboard = () => {
  const { token, user } = useSelector(state => state.auth);
  const [citations, setCitations] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('unpaid');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDPSCitationsData = async (status) => {
      try {
        const response = await axios.get('https://apps.laoagcity.gov.ph:3002/dpscitations', {
          //const response = await axios.get('http://localhost:3002/dpscitations', {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            page: currentPage,
            limit: pageSize,
            search: searchQuery,
            status,
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

    let status;
    switch (activeTab) {
      case 'paid':
        status = 'paid';
        break;
      case 'unpaid':
        status = 'unpaid';
        break;
      case 'delinquent':
        status = 'delinquent';
        break;
      case 'for-case-filing':
        status = 'for-case-filing';
        break;
      default:
        status = 'all';
    }

    fetchDPSCitationsData(status);
  }, [token, navigate, dispatch, currentPage, pageSize, searchQuery, activeTab]);

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
    const total = amounts.map(item => item.amount).reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return parseFloat(total.toFixed(2));
  };

  const violationCount = (count) => { return count.length };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    try {
      const response = await axios.get('https://apps.laoagcity.gov.ph:3002/dpscitations', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: 1,
          limit: pageSize,
          search: query,
        },
      });
      setSearchResults(response.data.dpsCitations);
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
    const dayDifference = (new Date() - new Date(dateApprehended)) / (1000 * 60 * 60 * 24);

    if (dayDifference > 30) return 'table-danger';
    if (dayDifference > 60) return 'table-warning';
    return '';
  };

  const handleCommuteClick = (citation) => {
    console.log('Commute action for citation:', citation);
  };

  const handlePaymentClick = (citation) => {
    navigate(`/payment-update/${citation._id}`); const handleCommuteClick = (citation) => {
      console.log('Commute action for citation:', citation);
    };

    const handlePaymentClick = (citation) => {
      navigate(`/payment-update/${citation._id}`);
    };

  };

  const filterCitations = (status) => {
    switch (status) {
      case 'paid':
        return citations.filter(citation => citation.paymentStatus);
      case 'unpaid':
        return citations.filter(citation => !citation.paymentStatus);
      case 'delinquent':
        return citations.filter(citation => !citation.paymentStatus && (new Date() - new Date(citation.dateApprehended)) > (30 * 24 * 60 * 60 * 1000));
      case 'for-case-filing':
        return citations.filter(citation => !citation.paymentStatus && (new Date() - new Date(citation.dateApprehended)) > (60 * 24 * 60 * 60 * 1000));
      default:
        return citations;
    }
  };

  if (!token) {
    return null;
  }

  return (
    <Container className="align-items-center">
      <TopBar username={user.username} userrole={user.userrole} bg="light" expand="lg" data-bs-theme="light" onSearch={handleSearch} />
      <h3 className="text-center">DPS Citation List</h3>
      {searchResults ? (
        <SearchResults
          searchResults={searchResults}
          error={error}
          handleShow={handleShow}
          handleClose={handleClose}
          getRowClass={getRowClass}
          handleCommuteClick={handleCommuteClick}
          handlePaymentClick={handlePaymentClick}
          formatDate={formatDate}
          violationCount={violationCount}
        />
      ) : (
        <>
          <Tabs activeKey={activeTab} onSelect={(k) => { setActiveTab(k); setCurrentPage(1); }}>
            <Tab eventKey="all" title="All">
              {renderCitationTable(filterCitations('all'), true)}
            </Tab>
            <Tab eventKey="paid" title="Paid">
              {renderCitationTable(filterCitations('paid'), true)}
            </Tab>
            <Tab eventKey="unpaid" title="Unpaid">
              {renderCitationTable(filterCitations('unpaid'))}
            </Tab>
            <Tab eventKey="delinquent" title="Delinquent">
              {renderCitationTable(filterCitations('delinquent'))}
            </Tab>
            <Tab eventKey="for-case-filing" title="For Case Filing">
              {renderCitationTable(filterCitations('for-case-filing'))}
            </Tab>
          </Tabs>
          <Pagination className="mt-3">
            {renderPaginationItems()}
          </Pagination>
        </>
      )}
      <Footer />
    </Container>
  );

  function renderCitationTable(filteredCitations, isPaidTab = false) {
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
            {/*             <th>Violations</th>*/}
            <th>Amount</th>
            {!isPaidTab && <th>Commute Status</th>}
            {!isPaidTab && <th>Payment Status</th>}
          </tr>
        </thead>
        <tbody>
          {filteredCitations.length > 0 ? (
            filteredCitations.map((citation) => (
              <tr key={citation._id} className={getRowClass(citation.dateApprehended)}>
                <td>{citation.ticketNumber}</td>
                <td>{citation.licenseNumber}</td>
                <td>{formatDate(citation.dateApprehended)}</td>
                <td>{citation.streetApprehended}</td>
                <td>{citation.plateNumber}</td>
                <td>{citation.vehicleColor}</td>
                <td>{citation.apprehendingOfficer}</td>
                {/*                 <td>{violationCount(citation.violations)}</td>*/}
                <td>{sumAmounts(citation.violations)}</td>
                {!isPaidTab && <td>{user.username === 'dpshead' ? < Button variant="warning" onClick={() => handleCommuteClick(citation)}>Commute</Button> : citation.commuteStatus ? 'Commuted' : 'Not Commuted'}</td>}
                {!isPaidTab && <td>{citation.paymentStatus ? 'Paid' : <Button variant="warning" onClick={() => handlePaymentClick(citation)}>Pay</Button>}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isPaidTab ? 8 : 10} className="text-center">No records available</td>
            </tr>
          )}
        </tbody>
      </Table >
    );
  }
};

export default Dashboard;
