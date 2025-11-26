import axios from 'axios';

// Get the URL from the environment variable (or fallback)
// This is the correct place to define the base URL logic once.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Create and export the configured Axios instance
export const api = axios.create({
  baseURL: API_URL, 
  timeout: 10000,
});

// Optional: Add request/response interceptors here for error handling or tokens

// If you want to use the proxy logic for development, this is where you'd implement it:
/*
export const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? API_URL // Full URL for production deployment (Vercel)
    : '/api', // Relative path for Vite dev server proxy
  timeout: 10000,
});
*/