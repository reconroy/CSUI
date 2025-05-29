import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

class SettingsService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
  }

  /**
   * Get all user settings from the database
   * @returns {Promise<Object>} User settings object
   */
  async getUserSettings() {
    try {
      const response = await this.api.get('/user/settings')
      return response.data
    } catch (error) {
      console.error('Error fetching user settings:', error)
      throw new Error('Failed to fetch user settings')
    }
  }

  /**
   * Save all user settings to the database
   * @param {Object} settings - Complete settings object
   * @returns {Promise<Object>} Updated settings
   */
  async saveUserSettings(settings) {
    try {
      const response = await this.api.put('/user/settings', settings)
      return response.data
    } catch (error) {
      console.error('Error saving user settings:', error)
      throw new Error('Failed to save user settings')
    }
  }

  /**
   * Update specific setting category
   * @param {string} category - Settings category (ui, editor, notifications, etc.)
   * @param {Object} categorySettings - Settings for the category
   * @returns {Promise<Object>} Updated settings
   */
  async updateSettingsCategory(category, categorySettings) {
    try {
      const response = await this.api.patch(`/user/settings/${category}`, categorySettings)
      return response.data
    } catch (error) {
      console.error(`Error updating ${category} settings:`, error)
      throw new Error(`Failed to update ${category} settings`)
    }
  }

  /**
   * Reset settings category to defaults
   * @param {string} category - Settings category to reset
   * @returns {Promise<Object>} Default settings for category
   */
  async resetSettingsCategory(category) {
    try {
      const response = await this.api.delete(`/user/settings/${category}`)
      return response.data
    } catch (error) {
      console.error(`Error resetting ${category} settings:`, error)
      throw new Error(`Failed to reset ${category} settings`)
    }
  }

  /**
   * Get current user settings formatted for stores
   * @returns {Promise<Object>} Formatted settings object
   */
  async getFormattedSettings() {
    try {
      const settings = await this.getUserSettings()
      
      return {
        ui: settings.ui || {},
        editor: settings.editor || {},
        notifications: settings.notifications || {},
        general: settings.general || {}
      }
    } catch (error) {
      console.error('Error formatting settings:', error)
      return {
        ui: {},
        editor: {},
        notifications: {},
        general: {}
      }
    }
  }

  /**
   * Sync local store settings with database
   * @param {Object} localSettings - Settings from local stores
   * @returns {Promise<boolean>} Success status
   */
  async syncSettings(localSettings) {
    try {
      // Prepare settings object for API
      const settingsPayload = {
        ui: localSettings.ui || {},
        editor: localSettings.editor || {},
        notifications: localSettings.notifications || {},
        general: localSettings.general || {},
        lastUpdated: new Date().toISOString()
      }

      await this.saveUserSettings(settingsPayload)
      return true
    } catch (error) {
      console.error('Error syncing settings:', error)
      return false
    }
  }

  /**
   * Load settings from database and update local stores
   * @param {Function} updateUISettings - UI settings store updater
   * @param {Function} updateEditorSettings - Editor settings store updater
   * @returns {Promise<boolean>} Success status
   */
  async loadAndApplySettings(updateUISettings, updateEditorSettings) {
    try {
      const settings = await this.getFormattedSettings()
      
      // Update UI settings store
      if (settings.ui && Object.keys(settings.ui).length > 0) {
        updateUISettings(settings.ui)
      }
      
      // Update Editor settings store
      if (settings.editor && Object.keys(settings.editor).length > 0) {
        updateEditorSettings(settings.editor)
      }
      
      return true
    } catch (error) {
      console.error('Error loading and applying settings:', error)
      return false
    }
  }

  /**
   * Export user settings for backup
   * @returns {Promise<Object>} Complete settings object
   */
  async exportSettings() {
    try {
      const settings = await this.getUserSettings()
      return {
        ...settings,
        exportedAt: new Date().toISOString(),
        version: '1.0'
      }
    } catch (error) {
      console.error('Error exporting settings:', error)
      throw new Error('Failed to export settings')
    }
  }

  /**
   * Import settings from backup
   * @param {Object} settingsBackup - Settings backup object
   * @returns {Promise<boolean>} Success status
   */
  async importSettings(settingsBackup) {
    try {
      // Validate backup format
      if (!settingsBackup || typeof settingsBackup !== 'object') {
        throw new Error('Invalid settings backup format')
      }

      // Remove metadata fields
      const { exportedAt, version, ...settings } = settingsBackup
      
      await this.saveUserSettings(settings)
      return true
    } catch (error) {
      console.error('Error importing settings:', error)
      throw new Error('Failed to import settings')
    }
  }

  /**
   * Get settings schema/defaults for validation
   * @returns {Promise<Object>} Settings schema
   */
  async getSettingsSchema() {
    try {
      const response = await this.api.get('/user/settings/schema')
      return response.data
    } catch (error) {
      console.error('Error fetching settings schema:', error)
      // Return basic schema if API fails
      return {
        ui: {
          showFooter: false,
          allowMultiplePanels: true,
          primaryPanelToggleBehavior: 'shrink',
          secondaryPanelToggleBehavior: 'shrink'
        },
        editor: {
          fontSize: 14,
          fontFamily: "'Fira Code', monospace",
          theme: 'vs-dark',
          tabSize: 2,
          wordWrap: 'on'
        },
        notifications: {
          email: true,
          push: false,
          desktop: true
        },
        general: {
          language: 'en',
          timezone: 'auto'
        }
      }
    }
  }
}

// Create singleton instance
const settingsService = new SettingsService()

export default settingsService

// Export individual methods for convenience
export const {
  getUserSettings,
  saveUserSettings,
  updateSettingsCategory,
  resetSettingsCategory,
  getFormattedSettings,
  syncSettings,
  loadAndApplySettings,
  exportSettings,
  importSettings,
  getSettingsSchema
} = settingsService
