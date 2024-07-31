// src/hooks/useFetchApprehenders.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchApprehenders = (token) => {
  const [apprehendersList, setApprehendersList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApprehendersData = async () => {
      try {
        const response = await axios.get('https://apps.laoagcity.gov.ph:3002/apprehenders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApprehendersList(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized access. Please login again.');
        } else {
          setError('Failed to fetch apprehenders data. Please try again later.');
        }
      }
    };

    fetchApprehendersData();
  }, [token]);

  return { apprehendersList, error };
};

export default useFetchApprehenders;
