import axios from 'axios';

// Get the URL from the environment variable (or fallback)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create and export the configured Axios instance
export const api = axios.create({
  baseURL: API_URL, 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to log requests
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received:`, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error);
    
    // Handle specific error cases
    if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to server. Please make sure the server is running.');
    } else if (error.code === 'NETWORK_ERROR') {
      console.error('Network error. Please check your internet connection.');
    }
    
    return Promise.reject(error);
  }
);