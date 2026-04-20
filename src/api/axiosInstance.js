import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9069/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

console.log('API Base URL:', API_BASE_URL);

// Request interceptor: attach JWT
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor: handle token expiry and network errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response success:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.response) {
      // Server responded with error status
      console.error('Error data:', error.response.data);
      
      if (error.response.status === 401) {
        // Clear storage and redirect on 401
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response
      console.error('No response received. Backend may not be running on', API_BASE_URL);
      error.message = 'Network Error: Could not reach server. Make sure backend is running on ' + API_BASE_URL;
    } else {
      console.error('Error message:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
