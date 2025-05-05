import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle network errors
    if (!error.response) {
      // Network error or server not responding
      toast.error('Network error. Please check your connection and try again.');
      
      // Add custom property to identify network errors
      error.isNetworkError = true;
      
      return Promise.reject(error);
    }
    
    // Handle server errors (5xx)
    if (error.response.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    
    // Handle unauthorized errors (401)
    if (error.response.status === 401) {
      // Check if this is not a login request
      if (!error.config.url.includes('/auth/login')) {
        // Clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Only redirect if in browser environment
        if (typeof window !== 'undefined') {
          // Add a small delay to allow the toast to be displayed
          setTimeout(() => {
            window.location.href = '/login?session=expired';
          }, 1000);
          
          toast.error('Your session has expired. Please log in again.');
        }
      }
    }
    
    // Handle forbidden errors (403)
    if (error.response.status === 403) {
      toast.error('You do not have permission to perform this action.');
    }
    
    // Handle not found errors (404)
    if (error.response.status === 404) {
      toast.error('The requested resource was not found.');
    }
    
    // Handle validation errors (422)
    if (error.response.status === 422) {
      const validationErrors = error.response.data.errors;
      
      if (validationErrors) {
        // Display the first validation error
        const firstError = Object.values(validationErrors)[0];
        if (firstError) {
          toast.error(firstError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Add retry functionality for network errors
api.retry = async (fn, maxRetries = 3, delay = 1000) => {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      if (!error.isNetworkError || retries === maxRetries - 1) {
        throw error;
      }
      
      retries++;
      toast.loading(`Retrying (${retries}/${maxRetries})...`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * retries));
    }
  }
};

export default api;
