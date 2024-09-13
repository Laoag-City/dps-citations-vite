// src/hooks/useUpdate.js
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useUpdate = (url, token) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const updateData = async (updatedData) => {
    try {
      const response = await axios.put(url, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/dashboard'); // Navigate back to the dashboard after updating
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Unauthorized access. Please login again.');
        navigate('/login');
      } else {
        setError('Failed to update data. Please try again later.',error);
      }
      throw error;
    }
  };

  return { updateData, error };
};

export default useUpdate;
