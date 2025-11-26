import axios from 'axios';

// Use Render backend for both development and production
const API_URL = import.meta.env.VITE_API_URL || 'https://ams-project-m93c.onrender.com';

// Create and export the configured Axios instance
export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add better error handling for Render
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - Render might be spinning up');
    }
    return Promise.reject(error);
  }
);