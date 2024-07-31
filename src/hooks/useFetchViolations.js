// src/hooks/useFetchViolations.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchViolations = (token) => {
  const [violationsList, setViolationsList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchViolationsData = async () => {
      try {
        const response = await axios.get('https://apps.laoagcity.gov.ph:3002/violations', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setViolationsList(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setError('Unauthorized access. Please login again.');
        } else {
          setError('Failed to fetch violations data. Please try again later.');
        }
      }
    };

    fetchViolationsData();
  }, [token]);

  return { violationsList, error };
};

export default useFetchViolations;
