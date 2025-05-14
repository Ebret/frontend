/**
 * Cache utility for the application
 * 
 * This utility provides functions for caching data in memory and localStorage
 * with support for TTL (Time To Live) and automatic cache invalidation.
 */

// In-memory cache
const memoryCache = new Map();

/**
 * Set a value in the memory cache with optional TTL
 * 
 * @param {string} key - The cache key
 * @param {any} value - The value to cache
 * @param {number} ttl - Time to live in milliseconds (optional)
 */
export const setMemoryCache = (key, value, ttl = null) => {
  const item = {
    value,
    timestamp: Date.now(),
    ttl,
  };
  
  memoryCache.set(key, item);
};

/**
 * Get a value from the memory cache
 * 
 * @param {string} key - The cache key
 * @returns {any|null} - The cached value or null if not found or expired
 */
export const getMemoryCache = (key) => {
  const item = memoryCache.get(key);
  
  if (!item) {
    return null;
  }
  
  // Check if the item has expired
  if (item.ttl && Date.now() - item.timestamp > item.ttl) {
    memoryCache.delete(key);
    return null;
  }
  
  return item.value;
};

/**
 * Clear the memory cache
 * 
 * @param {string} keyPrefix - Optional prefix to clear only keys starting with this prefix
 */
export const clearMemoryCache = (keyPrefix = null) => {
  if (keyPrefix) {
    // Clear only keys with the specified prefix
    for (const key of memoryCache.keys()) {
      if (key.startsWith(keyPrefix)) {
        memoryCache.delete(key);
      }
    }
  } else {
    // Clear the entire cache
    memoryCache.clear();
  }
};

/**
 * Set a value in localStorage with optional TTL
 * 
 * @param {string} key - The cache key
 * @param {any} value - The value to cache
 * @param {number} ttl - Time to live in milliseconds (optional)
 */
export const setLocalStorageCache = (key, value, ttl = null) => {
  const item = {
    value,
    timestamp: Date.now(),
    ttl,
  };
  
  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (error) {
    console.error('Error setting localStorage cache:', error);
  }
};

/**
 * Get a value from localStorage
 * 
 * @param {string} key - The cache key
 * @returns {any|null} - The cached value or null if not found or expired
 */
export const getLocalStorageCache = (key) => {
  try {
    const itemStr = localStorage.getItem(key);
    
    if (!itemStr) {
      return null;
    }
    
    const item = JSON.parse(itemStr);
    
    // Check if the item has expired
    if (item.ttl && Date.now() - item.timestamp > item.ttl) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (error) {
    console.error('Error getting localStorage cache:', error);
    return null;
  }
};

/**
 * Clear localStorage cache
 * 
 * @param {string} keyPrefix - Optional prefix to clear only keys starting with this prefix
 */
export const clearLocalStorageCache = (keyPrefix = null) => {
  try {
    if (keyPrefix) {
      // Clear only keys with the specified prefix
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(keyPrefix)) {
          localStorage.removeItem(key);
        }
      }
    } else {
      // Clear the entire cache
      localStorage.clear();
    }
  } catch (error) {
    console.error('Error clearing localStorage cache:', error);
  }
};

/**
 * Cache a function call result
 * 
 * @param {Function} fn - The function to cache
 * @param {string} cacheKey - The cache key
 * @param {Object} options - Cache options
 * @param {number} options.ttl - Time to live in milliseconds
 * @param {boolean} options.useLocalStorage - Whether to use localStorage (default: false)
 * @param {Array} args - Arguments to pass to the function
 * @returns {Promise<any>} - The function result
 */
export const cacheFn = async (fn, cacheKey, options = {}, ...args) => {
  const { ttl = null, useLocalStorage = false } = options;
  
  // Try to get from cache first
  const getCacheFn = useLocalStorage ? getLocalStorageCache : getMemoryCache;
  const setCacheFn = useLocalStorage ? setLocalStorageCache : setMemoryCache;
  
  const cachedResult = getCacheFn(cacheKey);
  
  if (cachedResult !== null) {
    return cachedResult;
  }
  
  // Not in cache, call the function
  const result = await fn(...args);
  
  // Cache the result
  setCacheFn(cacheKey, result, ttl);
  
  return result;
};

/**
 * Create a cached version of a function
 * 
 * @param {Function} fn - The function to cache
 * @param {Function} keyFn - Function to generate cache key from arguments
 * @param {Object} options - Cache options
 * @param {number} options.ttl - Time to live in milliseconds
 * @param {boolean} options.useLocalStorage - Whether to use localStorage (default: false)
 * @returns {Function} - The cached function
 */
export const createCachedFn = (fn, keyFn, options = {}) => {
  return async (...args) => {
    const cacheKey = keyFn(...args);
    return cacheFn(fn, cacheKey, options, ...args);
  };
};

/**
 * Clear all caches (memory and localStorage)
 * 
 * @param {string} keyPrefix - Optional prefix to clear only keys starting with this prefix
 */
export const clearAllCaches = (keyPrefix = null) => {
  clearMemoryCache(keyPrefix);
  clearLocalStorageCache(keyPrefix);
};

export default {
  setMemoryCache,
  getMemoryCache,
  clearMemoryCache,
  setLocalStorageCache,
  getLocalStorageCache,
  clearLocalStorageCache,
  cacheFn,
  createCachedFn,
  clearAllCaches,
};
