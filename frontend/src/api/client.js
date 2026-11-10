import axios from 'axios';
import toast from 'react-hot-toast';
import { getFriendlyError } from '../utils/errorMessages';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request interceptor — attach token
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

// Response interceptor — friendly errors + auth redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Auth failure → redirect to login (but not for auth endpoints themselves)
    if (status === 401) {
      const path = window.location.pathname;
      const isAuthPath = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
      ].some((p) => path.startsWith(p));
      const isAuthEndpoint =
        error.config?.url?.includes('/auth/login') ||
        error.config?.url?.includes('/auth/register');

      if (!isAuthPath && !isAuthEndpoint) {
        localStorage.clear();
        toast.error('Your session expired. Please sign in again.');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    // Attach friendly message to the error object for consistent use
    error.friendlyMessage = getFriendlyError(error);

    return Promise.reject(error);
  }
);

export default api;