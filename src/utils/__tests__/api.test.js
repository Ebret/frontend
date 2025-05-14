import { fetchApi, get, post, put, patch, del } from '../api';
import * as cacheUtils from '../cache';

// Mock the cache utility
jest.mock('../cache', () => ({
  cacheFn: jest.fn(),
  clearMemoryCache: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('API Utility', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock successful fetch response
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ data: 'test' }),
      status: 200,
      statusText: 'OK',
    });
    
    // Mock cacheFn to pass through to the function
    cacheUtils.cacheFn.mockImplementation((fn) => fn());
  });
  
  describe('fetchApi', () => {
    test('should make a GET request with default options', async () => {
      const url = 'https://api.example.com/data';
      
      const result = await fetchApi(url);
      
      expect(global.fetch).toHaveBeenCalledWith(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      });
      
      expect(result).toEqual({ data: 'test' });
    });
    
    test('should use cache for GET requests by default', async () => {
      const url = 'https://api.example.com/data';
      
      await fetchApi(url);
      
      expect(cacheUtils.cacheFn).toHaveBeenCalledWith(
        expect.any(Function),
        url,
        expect.objectContaining({
          ttl: 5 * 60 * 1000, // 5 minutes
          useLocalStorage: false,
        })
      );
    });
    
    test('should not use cache for non-GET requests', async () => {
      const url = 'https://api.example.com/data';
      
      await fetchApi(url, { method: 'POST' });
      
      expect(cacheUtils.cacheFn).not.toHaveBeenCalled();
    });
    
    test('should clear cache for non-GET requests', async () => {
      const url = 'https://api.example.com/data';
      
      await fetchApi(url, { method: 'POST' });
      
      expect(cacheUtils.clearMemoryCache).toHaveBeenCalledWith(url);
    });
    
    test('should throw an error for non-OK responses', async () => {
      const url = 'https://api.example.com/data';
      
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      });
      
      await expect(fetchApi(url)).rejects.toThrow('API error: 404 Not Found');
    });
    
    test('should merge custom headers with default headers', async () => {
      const url = 'https://api.example.com/data';
      const options = {
        headers: {
          'Authorization': 'Bearer token',
        },
      };
      
      await fetchApi(url, options);
      
      expect(global.fetch).toHaveBeenCalledWith(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token',
        },
        method: 'GET',
      });
    });
    
    test('should respect cache options', async () => {
      const url = 'https://api.example.com/data';
      const cacheOptions = {
        ttl: 10000,
        useLocalStorage: true,
      };
      
      await fetchApi(url, {}, cacheOptions);
      
      expect(cacheUtils.cacheFn).toHaveBeenCalledWith(
        expect.any(Function),
        url,
        expect.objectContaining({
          ttl: 10000,
          useLocalStorage: true,
        })
      );
    });
    
    test('should disable cache when useCache is false', async () => {
      const url = 'https://api.example.com/data';
      const cacheOptions = {
        useCache: false,
      };
      
      await fetchApi(url, {}, cacheOptions);
      
      expect(cacheUtils.cacheFn).not.toHaveBeenCalled();
    });
  });
  
  describe('HTTP Method Helpers', () => {
    test('get should make a GET request with caching', async () => {
      const url = 'https://api.example.com/data';
      
      await get(url);
      
      expect(global.fetch).toHaveBeenCalledWith(url, expect.objectContaining({
        method: 'GET',
      }));
      
      expect(cacheUtils.cacheFn).toHaveBeenCalled();
    });
    
    test('post should make a POST request with JSON body', async () => {
      const url = 'https://api.example.com/data';
      const data = { name: 'Test' };
      
      await post(url, data);
      
      expect(global.fetch).toHaveBeenCalledWith(url, expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(data),
      }));
      
      expect(cacheUtils.cacheFn).not.toHaveBeenCalled();
    });
    
    test('put should make a PUT request with JSON body', async () => {
      const url = 'https://api.example.com/data/1';
      const data = { name: 'Updated Test' };
      
      await put(url, data);
      
      expect(global.fetch).toHaveBeenCalledWith(url, expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(data),
      }));
      
      expect(cacheUtils.cacheFn).not.toHaveBeenCalled();
    });
    
    test('patch should make a PATCH request with JSON body', async () => {
      const url = 'https://api.example.com/data/1';
      const data = { name: 'Partially Updated Test' };
      
      await patch(url, data);
      
      expect(global.fetch).toHaveBeenCalledWith(url, expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify(data),
      }));
      
      expect(cacheUtils.cacheFn).not.toHaveBeenCalled();
    });
    
    test('del should make a DELETE request', async () => {
      const url = 'https://api.example.com/data/1';
      
      await del(url);
      
      expect(global.fetch).toHaveBeenCalledWith(url, expect.objectContaining({
        method: 'DELETE',
      }));
      
      expect(cacheUtils.cacheFn).not.toHaveBeenCalled();
    });
  });
});
