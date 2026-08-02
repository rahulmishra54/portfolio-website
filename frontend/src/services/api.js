import axios from 'axios';
import { getToken, removeToken, isTokenExpired } from './auth';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

if (!import.meta.env.VITE_API_BASE_URL && import.meta.env.MODE !== 'development') {
  console.warn(
    'VITE_API_BASE_URL is not configured. Frontend requests will use /api and may 404 if the frontend is deployed separately from the backend.'
  );
}

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && isTokenExpired(token)) {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/login';
    }
    return config;
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = error.response && error.response.data && error.response.data.message
      ? new Error(error.response.data.message)
      : error;

    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/admin/login';
    }

    return Promise.reject(apiError);
  }
);

export default api;


