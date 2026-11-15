// ============================================
// Axios API Client
// ============================================
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Handle auth errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const event = new CustomEvent('auth:expired');
      window.dispatchEvent(event);
    }
    return Promise.reject(error);
  }
);

export default api;
