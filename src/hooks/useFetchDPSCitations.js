import axios from 'axios';
import { logout } from '../features/auth/authSlice';

const useFetchDPSCitations = () => {
  return async ({ token, currentPage, pageSize, searchQuery, status, setCitations, setTotalPages, setError, dispatch, navigate }) => {
    try {
      const response = await axios.get('https://apps.laoagcity.gov.ph:3002/dpscitations', {
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
};

export default useFetchDPSCitations;
