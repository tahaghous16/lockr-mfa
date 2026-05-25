import axios from 'axios';

const api = axios.create({
  // Use VITE_API_URL if deployed, otherwise fallback to localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
