import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Container, Tabs, Tab } from 'react-bootstrap';
import TopBar from '../TopBar';
import Footer from '../Footer';
import SearchResults from '../SearchResultsPage';
import CitationTable from './CitationTable';
import CustomPagination from './Pagination';
import { logout } from '../../features/auth/authSlice';
import useFetchDPSCitations from '../../hooks/useFetchDPSCitations';
import { getStatusFromTab } from '../../utils/citationUtils';

const Dashboard = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [citations, setCitations] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('unpaid');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchDPSCitations = useFetchDPSCitations();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const status = getStatusFromTab(activeTab);
    fetchDPSCitations({ token, currentPage, pageSize, searchQuery, status, setCitations, setTotalPages, setError, dispatch, navigate });
  }, [token, navigate, dispatch, currentPage, pageSize, searchQuery, activeTab, fetchDPSCitations]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchDPSCitations({ token, currentPage: 1, pageSize, searchQuery: query, status: getStatusFromTab(activeTab), setCitations, setTotalPages, setError, dispatch, navigate });
  };

  if (!token) {
    return null;
  }

  return (
    <Container className="align-items-center">
      <TopBar username={user.username} userrole={user.userrole} bg="light" expand="lg" data-bs-theme="light" onSearch={handleSearch} />
      <h3 className="text-center">DPS Citation List</h3>
      {searchResults ? (
        <SearchResults searchResults={searchResults} error={error} />
      ) : (
        <>
          <Tabs activeKey={activeTab} onSelect={(k) => { setActiveTab(k); setCurrentPage(1); }}>
            <Tab eventKey="all" title="All">
              <CitationTable citations={citations} isPaidTab />
            </Tab>
            <Tab eventKey="paid" title="Paid">
              <CitationTable citations={citations} isPaidTab />
            </Tab>
            <Tab eventKey="unpaid" title="Unpaid">
              <CitationTable citations={citations} />
            </Tab>
            <Tab eventKey="delinquent" title="Delinquent">
              <CitationTable citations={citations} />
            </Tab>
            <Tab eventKey="for-case-filing" title="For Case Filing">
              <CitationTable citations={citations} />
            </Tab>
          </Tabs>
          <CustomPagination currentPage={currentPage} totalPages={totalPages} handlePageChange={setCurrentPage} />
        </>
      )}
      <Footer />
    </Container>
  );
};

export default Dashboard;
