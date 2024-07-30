import { useCallback } from 'react';
import axios from 'axios';
import { logout } from '../features/auth/authSlice';

const useFetchDPSCitations = (token, dispatch, navigate, setCitations, setTotalPages, setError) => {
  const fetchCitations = useCallback(async (status, currentPage, pageSize, searchQuery) => {
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
  }, [token, dispatch, navigate, setCitations, setTotalPages, setError]);

  return fetchCitations;
};

export default useFetchDPSCitations;
