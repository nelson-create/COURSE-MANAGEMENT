import axios from 'axios';

// Get API URL - for production, use relative path; for development, proxy through Vite
const getBaseURL = () => {
  // In production, use relative URLs (same origin)
  if (import.meta.env.PROD) {
    return '/api';
  }
  // In development, use the Vite proxy
  return (import.meta.env.VITE_API_URL || '') + '/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;