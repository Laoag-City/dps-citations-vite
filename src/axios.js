// src/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://apps.laoagcity.gov.ph:3001/',
  headers: {
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default instance;
