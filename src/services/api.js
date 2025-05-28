/**
 * API service for making HTTP requests to the backend
 */

// API base URL - automatically detects if running on LAN
const getBaseUrl = () => {
  // If running on localhost, use localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000/api';
  }
  // If running on LAN, use the same host but port 3000
  return `http://${window.location.hostname}:3000/api`;
};

const API_URL = getBaseUrl();

/**
 * Get the API URL
 * @returns {string} - API URL
 */
export const getApiUrl = () => API_URL;

/**
 * Make a GET request
 * @param {string} endpoint - API endpoint
 * @param {boolean} requiresAuth - Whether the request requires authentication
 * @returns {Promise} - Response data
 */
export const get = async (endpoint, requiresAuth = false) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  // Add authorization header if required
  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`Error in GET ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Make a POST request
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @param {boolean} requiresAuth - Whether the request requires authentication
 * @returns {Promise} - Response data
 */
export const post = async (endpoint, body, requiresAuth = false) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  // Add authorization header if required
  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`Error in POST ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Make a PUT request
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @param {boolean} requiresAuth - Whether the request requires authentication
 * @returns {Promise} - Response data
 */
export const put = async (endpoint, body, requiresAuth = false) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  // Add authorization header if required
  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`Error in PUT ${endpoint}:`, error);
    throw error;
  }
};

/**
 * Make a DELETE request
 * @param {string} endpoint - API endpoint
 * @param {boolean} requiresAuth - Whether the request requires authentication
 * @returns {Promise} - Response data
 */
export const del = async (endpoint, requiresAuth = false) => {
  const headers = {
    'Content-Type': 'application/json'
  };

  // Add authorization header if required
  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`Error in DELETE ${endpoint}:`, error);
    throw error;
  }
};
