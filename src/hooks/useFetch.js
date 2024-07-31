import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useFetch = (url, token) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized access. Please login again.');
          navigate('/login');
        } else {
          setError('Failed to fetch data. Please try again later.');
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [url, token, navigate]);

  return { data, loading, error };
};

export default useFetch;
