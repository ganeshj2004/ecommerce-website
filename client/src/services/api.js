import axios from 'axios';

// In production (Vercel), VITE_API_URL points to the Railway backend.
// In development (localhost), Vite proxy rewrites /api → http://localhost:5000/api
const rawApiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const API = axios.create({
  baseURL: rawApiUrl ? `${rawApiUrl}/api` : '/api',
});

// Request Interceptor: Attach JWT Token if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('aquacraft_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global Error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized
      if (localStorage.getItem('aquacraft_token')) {
        localStorage.removeItem('aquacraft_token');
        localStorage.removeItem('aquacraft_user');
        window.dispatchEvent(new Event('authChange'));
      }
    }
    return Promise.reject(error);
  }
);

export default API;
