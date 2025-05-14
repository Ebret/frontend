/**
 * API utility for the application
 * 
 * This utility provides functions for making API requests with caching support.
 */

import { cacheFn, clearMemoryCache } from './cache';

// Default cache TTL in milliseconds (5 minutes)
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

// Default fetch options
const DEFAULT_FETCH_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * Make an API request with optional caching
 * 
 * @param {string} url - The API URL
 * @param {Object} options - Fetch options
 * @param {Object} cacheOptions - Cache options
 * @param {boolean} cacheOptions.useCache - Whether to use cache (default: true for GET requests)
 * @param {number} cacheOptions.ttl - Time to live in milliseconds (default: 5 minutes)
 * @param {boolean} cacheOptions.useLocalStorage - Whether to use localStorage (default: false)
 * @returns {Promise<any>} - The API response
 */
export const fetchApi = async (url, options = {}, cacheOptions = {}) => {
  const method = options.method || 'GET';
  const isGet = method === 'GET';
  
  // Determine if we should use cache
  const {
    useCache = isGet,
    ttl = DEFAULT_CACHE_TTL,
    useLocalStorage = false,
  } = cacheOptions;
  
  // Merge default options with provided options
  const fetchOptions = {
    ...DEFAULT_FETCH_OPTIONS,
    ...options,
    headers: {
      ...DEFAULT_FETCH_OPTIONS.headers,
      ...options.headers,
    },
  };
  
  // For non-GET requests or when cache is disabled, make a direct request
  if (!useCache || !isGet) {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    // For non-GET requests, clear cache for the URL to ensure fresh data on next GET
    if (!isGet) {
      clearMemoryCache(url);
    }
    
    return response.json();
  }
  
  // For GET requests with cache enabled, use cacheFn
  const fetchFn = async () => {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  };
  
  return cacheFn(fetchFn, url, { ttl, useLocalStorage });
};

/**
 * Make a GET request with optional caching
 * 
 * @param {string} url - The API URL
 * @param {Object} options - Fetch options
 * @param {Object} cacheOptions - Cache options
 * @returns {Promise<any>} - The API response
 */
export const get = (url, options = {}, cacheOptions = {}) => {
  return fetchApi(url, { ...options, method: 'GET' }, cacheOptions);
};

/**
 * Make a POST request
 * 
 * @param {string} url - The API URL
 * @param {Object} data - The request body
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - The API response
 */
export const post = (url, data, options = {}) => {
  return fetchApi(
    url,
    {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    },
    { useCache: false }
  );
};

/**
 * Make a PUT request
 * 
 * @param {string} url - The API URL
 * @param {Object} data - The request body
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - The API response
 */
export const put = (url, data, options = {}) => {
  return fetchApi(
    url,
    {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    },
    { useCache: false }
  );
};

/**
 * Make a PATCH request
 * 
 * @param {string} url - The API URL
 * @param {Object} data - The request body
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - The API response
 */
export const patch = (url, data, options = {}) => {
  return fetchApi(
    url,
    {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    },
    { useCache: false }
  );
};

/**
 * Make a DELETE request
 * 
 * @param {string} url - The API URL
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} - The API response
 */
export const del = (url, options = {}) => {
  return fetchApi(
    url,
    {
      ...options,
      method: 'DELETE',
    },
    { useCache: false }
  );
};

export default {
  fetchApi,
  get,
  post,
  put,
  patch,
  del,
};
