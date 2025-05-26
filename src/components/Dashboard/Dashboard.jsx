import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { Card, Container, Pagination, Tabs, Tab } from 'react-bootstrap';
import TopBar from '../../components/TopBar';
import Footer from '../../components/Footer';
import SearchResults from './SearchResultsPage';
import CitationTable from './CitationTable';
import useFetchDPSCitations from '../../hooks/useFetchDPSCitations';
import { formatDate } from '../../utils/dateUtils';
import { getStatusFromTab, getRowClass, useCitationActions } from '../../utils/citationUtils';

const Dashboard = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [citations, setCitations] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState(null);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('unpaid');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCitations = useFetchDPSCitations(token, dispatch, navigate, setCitations, setTotalPages, setError);
  const { handleCommuteClick, handlePaymentClick } = useCitationActions();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const status = getStatusFromTab(activeTab);
    fetchCitations(status, currentPage, pageSize, searchQuery);
  }, [token, navigate, dispatch, currentPage, pageSize, searchQuery, activeTab, fetchCitations]);

  const handleShow = (citation) => {
    setSelectedCitation(citation);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedCitation(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    try {
      const response = await axios.get('https://apps.laoagcity.gov.ph/dps-citations-api/dpscitations', {
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

  const violationCount = (count) => { return count.length };

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

  const filterCitations = (status) => {
    switch (status) {
      case 'paid':
        return citations.filter((citation) => citation.paymentStatus);
      case 'unpaid':
        return citations.filter((citation) => !citation.paymentStatus);
      case 'delinquent':
        return citations.filter(
          (citation) =>
            !citation.paymentStatus &&
            new Date() - new Date(citation.dateApprehended) > 30 * 24 * 60 * 60 * 1000
        );
      case 'for-case-filing':
        return citations.filter(
          (citation) =>
            !citation.paymentStatus &&
            new Date() - new Date(citation.dateApprehended) > 60 * 24 * 60 * 60 * 1000
        );
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
      <Card>
        <Card.Body>
          <Card.Title className='text-center'>DPS Citations Dashboard</Card.Title>
          {searchResults ? (
            <SearchResults
              searchResults={searchResults}
              error={error}
              handleShow={handleShow}
              handleClose={handleClose}
              getRowClass={getRowClass}
              handlePaymentClick={handlePaymentClick}
              handleCommuteClick={handleCommuteClick}
              formatDate={formatDate}
              violationCount={violationCount}
              userRole={user.userrole}
            />
          ) : (
            <>
              {/* was setCurrentPage(1)*/}
              <Tabs activeKey={activeTab} onSelect={(k) => { setActiveTab(k); setCurrentPage(currentPage); }}>
                <Tab eventKey="all" title="All">
                  <CitationTable citations={filterCitations('all')} userRole={user.userrole} isPaidTab={true} />
                </Tab>
                <Tab eventKey="paid" title="Paid">
                  <CitationTable citations={filterCitations('paid')} isPaidTab={true} />
                </Tab>
                <Tab eventKey="unpaid" title="Unpaid">
                  <CitationTable citations={filterCitations('unpaid')} />
                </Tab>
                <Tab eventKey="delinquent" title="Delinquent">
                  <CitationTable citations={filterCitations('delinquent')} />
                </Tab>
                <Tab eventKey="for-case-filing" title="For Case Filing">
                  <CitationTable citations={filterCitations('for-case-filing')} />
                </Tab>
              </Tabs>
              <Pagination className="mt-3">
                {renderPaginationItems()}
              </Pagination>
            </>
          )}
        </Card.Body>
      </Card>
      <Footer />
    </Container>
  );
};

export default Dashboard;
