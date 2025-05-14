import {
  setMemoryCache,
  getMemoryCache,
  clearMemoryCache,
  setLocalStorageCache,
  getLocalStorageCache,
  clearLocalStorageCache,
  cacheFn,
  createCachedFn,
  clearAllCaches,
} from '../cache';

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => {
      return store[key] || null;
    }),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    key: jest.fn(index => {
      return Object.keys(store)[index] || null;
    }),
    get length() {
      return Object.keys(store).length;
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock Date.now() for consistent testing
const originalDateNow = Date.now;
const mockDateNow = jest.fn(() => 1000);

describe('Cache Utility', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Reset localStorage
    localStorageMock.clear();
    
    // Reset memory cache
    clearMemoryCache();
    
    // Mock Date.now()
    Date.now = mockDateNow;
  });
  
  afterAll(() => {
    // Restore Date.now
    Date.now = originalDateNow;
  });
  
  describe('Memory Cache', () => {
    test('should set and get a value from memory cache', () => {
      const key = 'test-key';
      const value = { foo: 'bar' };
      
      setMemoryCache(key, value);
      
      expect(getMemoryCache(key)).toEqual(value);
    });
    
    test('should return null for non-existent key', () => {
      expect(getMemoryCache('non-existent')).toBeNull();
    });
    
    test('should respect TTL and return null for expired items', () => {
      const key = 'test-key';
      const value = { foo: 'bar' };
      const ttl = 500; // 500ms
      
      setMemoryCache(key, value, ttl);
      
      // Still within TTL
      expect(getMemoryCache(key)).toEqual(value);
      
      // Advance time beyond TTL
      Date.now = jest.fn(() => 1600);
      
      // Should be expired now
      expect(getMemoryCache(key)).toBeNull();
    });
    
    test('should clear all items from memory cache', () => {
      setMemoryCache('key1', 'value1');
      setMemoryCache('key2', 'value2');
      
      clearMemoryCache();
      
      expect(getMemoryCache('key1')).toBeNull();
      expect(getMemoryCache('key2')).toBeNull();
    });
    
    test('should clear only items with specified prefix', () => {
      setMemoryCache('prefix1:key1', 'value1');
      setMemoryCache('prefix1:key2', 'value2');
      setMemoryCache('prefix2:key1', 'value3');
      
      clearMemoryCache('prefix1:');
      
      expect(getMemoryCache('prefix1:key1')).toBeNull();
      expect(getMemoryCache('prefix1:key2')).toBeNull();
      expect(getMemoryCache('prefix2:key1')).toEqual('value3');
    });
  });
  
  describe('LocalStorage Cache', () => {
    test('should set and get a value from localStorage', () => {
      const key = 'test-key';
      const value = { foo: 'bar' };
      
      setLocalStorageCache(key, value);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        key,
        JSON.stringify({
          value,
          timestamp: 1000,
          ttl: null,
        })
      );
      
      expect(getLocalStorageCache(key)).toEqual(value);
    });
    
    test('should return null for non-existent key', () => {
      expect(getLocalStorageCache('non-existent')).toBeNull();
    });
    
    test('should respect TTL and return null for expired items', () => {
      const key = 'test-key';
      const value = { foo: 'bar' };
      const ttl = 500; // 500ms
      
      setLocalStorageCache(key, value, ttl);
      
      // Mock the localStorage.getItem to return our item
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          value,
          timestamp: 1000,
          ttl,
        })
      );
      
      // Still within TTL
      expect(getLocalStorageCache(key)).toEqual(value);
      
      // Advance time beyond TTL
      Date.now = jest.fn(() => 1600);
      
      // Mock the localStorage.getItem again
      localStorageMock.getItem.mockReturnValueOnce(
        JSON.stringify({
          value,
          timestamp: 1000,
          ttl,
        })
      );
      
      // Should be expired now
      expect(getLocalStorageCache(key)).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(key);
    });
    
    test('should clear all items from localStorage', () => {
      setLocalStorageCache('key1', 'value1');
      setLocalStorageCache('key2', 'value2');
      
      clearLocalStorageCache();
      
      expect(localStorageMock.clear).toHaveBeenCalled();
    });
    
    test('should clear only items with specified prefix', () => {
      // Setup localStorage with mock keys
      localStorageMock.key.mockImplementation(index => {
        const keys = ['prefix1:key1', 'prefix1:key2', 'prefix2:key1'];
        return keys[index] || null;
      });
      
      Object.defineProperty(localStorageMock, 'length', {
        get: () => 3,
      });
      
      clearLocalStorageCache('prefix1:');
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('prefix1:key1');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('prefix1:key2');
      expect(localStorageMock.removeItem).not.toHaveBeenCalledWith('prefix2:key1');
    });
  });
  
  describe('cacheFn', () => {
    test('should cache function results', async () => {
      const fn = jest.fn().mockResolvedValue('result');
      const key = 'test-fn';
      
      // First call should execute the function
      const result1 = await cacheFn(fn, key);
      
      expect(result1).toBe('result');
      expect(fn).toHaveBeenCalledTimes(1);
      
      // Second call should use the cached result
      const result2 = await cacheFn(fn, key);
      
      expect(result2).toBe('result');
      expect(fn).toHaveBeenCalledTimes(1); // Still only called once
    });
    
    test('should respect TTL for cached function results', async () => {
      const fn = jest.fn().mockResolvedValue('result');
      const key = 'test-fn';
      const ttl = 500; // 500ms
      
      // First call should execute the function
      const result1 = await cacheFn(fn, key, { ttl });
      
      expect(result1).toBe('result');
      expect(fn).toHaveBeenCalledTimes(1);
      
      // Advance time beyond TTL
      Date.now = jest.fn(() => 1600);
      
      // Second call should execute the function again
      const result2 = await cacheFn(fn, key, { ttl });
      
      expect(result2).toBe('result');
      expect(fn).toHaveBeenCalledTimes(2); // Called again
    });
  });
  
  describe('createCachedFn', () => {
    test('should create a cached version of a function', async () => {
      const fn = jest.fn().mockImplementation((a, b) => a + b);
      const keyFn = jest.fn().mockImplementation((a, b) => `sum:${a}:${b}`);
      
      const cachedFn = createCachedFn(fn, keyFn);
      
      // First call with (1, 2)
      const result1 = await cachedFn(1, 2);
      
      expect(result1).toBe(3);
      expect(fn).toHaveBeenCalledWith(1, 2);
      expect(keyFn).toHaveBeenCalledWith(1, 2);
      
      // Second call with same args should use cache
      const result2 = await cachedFn(1, 2);
      
      expect(result2).toBe(3);
      expect(fn).toHaveBeenCalledTimes(1); // Still only called once
      expect(keyFn).toHaveBeenCalledTimes(2);
      
      // Call with different args should execute function again
      const result3 = await cachedFn(2, 3);
      
      expect(result3).toBe(5);
      expect(fn).toHaveBeenCalledTimes(2);
      expect(keyFn).toHaveBeenCalledTimes(3);
    });
  });
  
  describe('clearAllCaches', () => {
    test('should clear both memory and localStorage caches', () => {
      setMemoryCache('key1', 'value1');
      setLocalStorageCache('key2', 'value2');
      
      clearAllCaches();
      
      expect(getMemoryCache('key1')).toBeNull();
      expect(localStorageMock.clear).toHaveBeenCalled();
    });
    
    test('should clear only items with specified prefix from both caches', () => {
      setMemoryCache('prefix1:key1', 'value1');
      setMemoryCache('prefix2:key1', 'value2');
      
      // Setup localStorage with mock keys
      localStorageMock.key.mockImplementation(index => {
        const keys = ['prefix1:key2', 'prefix2:key2'];
        return keys[index] || null;
      });
      
      Object.defineProperty(localStorageMock, 'length', {
        get: () => 2,
      });
      
      clearAllCaches('prefix1:');
      
      expect(getMemoryCache('prefix1:key1')).toBeNull();
      expect(getMemoryCache('prefix2:key1')).not.toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('prefix1:key2');
      expect(localStorageMock.removeItem).not.toHaveBeenCalledWith('prefix2:key2');
    });
  });
});
