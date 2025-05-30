import axios from 'axios'

class APIService {
  constructor() {
    // API base URL - automatically detects if running on LAN
    this.baseURL = this.getBaseUrl()

    // Create axios instance
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Add auth token to requests
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
      }
    )
  }

  getBaseUrl() {
    // If running on localhost, use localhost
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000/api'
    }
    // If running on LAN, use the same host but port 3000
    return `http://${window.location.hostname}:3000/api`
  }

  /**
   * Generic GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Response data
   */
  async GET(endpoint, params = {}) {
    try {
      const response = await this.client.get(endpoint, { params })
      return response.data
    } catch (error) {
      throw new Error(`GET ${endpoint} failed: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * Generic POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise<Object>} Response data
   */
  async POST(endpoint, data = {}) {
    try {
      const response = await this.client.post(endpoint, data)
      return response.data
    } catch (error) {
      throw new Error(`POST ${endpoint} failed: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * Generic PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise<Object>} Response data
   */
  async PUT(endpoint, data = {}) {
    try {
      const response = await this.client.put(endpoint, data)
      return response.data
    } catch (error) {
      throw new Error(`PUT ${endpoint} failed: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * Generic PATCH request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request body
   * @returns {Promise<Object>} Response data
   */
  async PATCH(endpoint, data = {}) {
    try {
      const response = await this.client.patch(endpoint, data)
      return response.data
    } catch (error) {
      throw new Error(`PATCH ${endpoint} failed: ${error.response?.data?.message || error.message}`)
    }
  }

  /**
   * Generic DELETE request
   * @param {string} endpoint - API endpoint
   * @returns {Promise<Object>} Response data
   */
  async DELETE(endpoint) {
    try {
      const response = await this.client.delete(endpoint)
      return response.data
    } catch (error) {
      throw new Error(`DELETE ${endpoint} failed: ${error.response?.data?.message || error.message}`)
    }
  }

  // ==================== SETTINGS ENDPOINTS ====================

  async getSettings() {
    return this.GET('/user/settings')
  }

  async updateSettings(settings) {
    return this.PUT('/user/settings', settings)
  }

  async updateSettingsCategory(category, settings) {
    return this.PATCH(`/user/settings/${category}`, settings)
  }

  async resetSettings(category = null) {
    return this.POST('/user/settings/reset', category ? { category } : {})
  }

  async exportSettings() {
    return this.GET('/user/settings/export')
  }

  async importSettings(settings, overwrite = false) {
    return this.POST('/user/settings/import', { settings, overwrite })
  }

  async getSettingsSchema() {
    return this.GET('/user/settings/schema')
  }

  // ==================== AUTH ENDPOINTS ====================

  async login(credentials) {
    return this.POST('/auth/login', credentials)
  }

  async register(userData) {
    return this.POST('/auth/register', userData)
  }

  async logout() {
    return this.POST('/auth/logout')
  }

  // ==================== USER ENDPOINTS ====================

  async getProfile() {
    return this.GET('/users/profile')
  }

  async updateProfile(profileData) {
    return this.PUT('/users/profile', profileData)
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Get API base URL
   * @returns {string} Base URL
   */
  getBaseURL() {
    return this.baseURL
  }

  /**
   * Update auth token
   * @param {string} token - JWT token
   */
  setAuthToken(token) {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }

  /**
   * Get current auth token
   * @returns {string|null} Current token
   */
  getAuthToken() {
    return localStorage.getItem('token')
  }

  /**
   * Clear auth token
   */
  clearAuthToken() {
    localStorage.removeItem('token')
  }
}

// Create and export singleton instance
const api = new APIService()

export default api

// Export individual methods for convenience
export const {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
  getSettings,
  updateSettings,
  updateSettingsCategory,
  resetSettings,
  exportSettings,
  importSettings,
  getSettingsSchema,
  login,
  register,
  logout,
  getProfile,
  updateProfile
} = api

// Legacy exports for backward compatibility
export const getApiUrl = () => api.getBaseURL()
export const get = (endpoint, requiresAuth = false) => api.GET(endpoint)
export const post = (endpoint, body, requiresAuth = false) => api.POST(endpoint, body)
export const put = (endpoint, body, requiresAuth = false) => api.PUT(endpoint, body)
export const del = (endpoint, requiresAuth = false) => api.DELETE(endpoint)
