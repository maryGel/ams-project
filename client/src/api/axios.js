import axios from 'axios';

// In development with proxy, just use relative URLs
// In production, use the full URL with hostname
const API_URL = import.meta.env.PROD 
  ? (typeof window !== 'undefined' ? `http://${window.location.hostname}:3000` : 'http://localhost:3000')
  : '';

console.log(`🔧 Environment: ${import.meta.env.MODE}, API URL: ${API_URL || 'relative (proxy)'}`);


export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  withCredentials: true,
});

// Add request logging
api.interceptors.request.use(
  (config) => {
    // console.log(`Making ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);

    if (config.method?.toLowerCase() === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now() // This ensures each request is unique
      };
    }
    const token = localStorage.getItem('token')

    if(token){
      config.headers.Authorization = `Bearer ${token}`
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response logging
api.interceptors.response.use(
  (response) => {
    // console.log(`Response from: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.baseURL + error.config?.url,
      status: error.response?.status,
      message: error.message
    });
    return Promise.reject(error);
  }
);