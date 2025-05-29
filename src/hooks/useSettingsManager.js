import { useState, useCallback } from 'react'
import useUISettingsStore from '../stores/uiSettingsStore'
import useEditorSettingsStore from '../stores/editorSettingsStore'
import settingsService from '../services/settingsService'

/**
 * Comprehensive settings management hook
 * Provides unified interface for all settings operations
 */
const useSettingsManager = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastSyncTime, setLastSyncTime] = useState(null)

  // UI Settings Store
  const {
    showFooter,
    allowMultiplePanels,
    primaryPanelToggleBehavior,
    secondaryPanelToggleBehavior,
    isPrimaryPanelCollapsed,
    isSecondaryPanelCollapsed,
    toggleFooter,
    setAllowMultiplePanels,
    setPrimaryPanelToggleBehavior,
    setSecondaryPanelToggleBehavior,
    togglePrimaryPanel,
    toggleSecondaryPanel,
    resetUISettings
  } = useUISettingsStore()

  // Editor Settings Store
  const {
    settings: editorSettings,
    updateSetting: updateEditorSetting,
    updateNestedSetting: updateNestedEditorSetting,
    updateMultipleSettings: updateMultipleEditorSettings,
    resetToDefaults: resetEditorDefaults,
    resetCategory: resetEditorCategory,
    getMonacoOptions,
    getSettingsForAPI: getEditorSettingsForAPI,
    loadSettingsFromAPI: loadEditorSettingsFromAPI,
    getDefaults: getEditorDefaults
  } = useEditorSettingsStore()

  /**
   * Get all current settings formatted for API
   */
  const getAllSettingsForAPI = useCallback(() => {
    return {
      ui: {
        showFooter,
        allowMultiplePanels,
        primaryPanelToggleBehavior,
        secondaryPanelToggleBehavior,
        isPrimaryPanelCollapsed,
        isSecondaryPanelCollapsed
      },
      editor: getEditorSettingsForAPI(),
      notifications: {
        email: true,
        push: false,
        desktop: true
      },
      general: {
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    }
  }, [
    showFooter,
    allowMultiplePanels,
    primaryPanelToggleBehavior,
    secondaryPanelToggleBehavior,
    isPrimaryPanelCollapsed,
    isSecondaryPanelCollapsed,
    getEditorSettingsForAPI
  ])

  /**
   * Save all settings to database
   */
  const saveAllSettings = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const allSettings = getAllSettingsForAPI()
      await settingsService.saveUserSettings(allSettings)
      setLastSyncTime(new Date())
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [getAllSettingsForAPI])

  /**
   * Load all settings from database
   */
  const loadAllSettings = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const settings = await settingsService.getFormattedSettings()
      
      // Apply UI settings
      if (settings.ui) {
        const uiStore = useUISettingsStore.getState()
        Object.entries(settings.ui).forEach(([key, value]) => {
          if (key in uiStore && typeof uiStore[key] !== 'function') {
            // Update UI store settings
            switch (key) {
              case 'showFooter':
                if (value !== showFooter) toggleFooter()
                break
              case 'allowMultiplePanels':
                setAllowMultiplePanels(value)
                break
              case 'primaryPanelToggleBehavior':
                setPrimaryPanelToggleBehavior(value)
                break
              case 'secondaryPanelToggleBehavior':
                setSecondaryPanelToggleBehavior(value)
                break
              default:
                break
            }
          }
        })
      }
      
      // Apply Editor settings
      if (settings.editor) {
        loadEditorSettingsFromAPI(settings.editor)
      }
      
      setLastSyncTime(new Date())
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [
    showFooter,
    toggleFooter,
    setAllowMultiplePanels,
    setPrimaryPanelToggleBehavior,
    setSecondaryPanelToggleBehavior,
    loadEditorSettingsFromAPI
  ])

  /**
   * Reset all settings to defaults
   */
  const resetAllSettings = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Reset local stores
      resetUISettings()
      resetEditorDefaults()
      
      // Save defaults to database
      await saveAllSettings()
      
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [resetUISettings, resetEditorDefaults, saveAllSettings])

  /**
   * Export settings for backup
   */
  const exportSettings = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const settings = await settingsService.exportSettings()
      
      // Create downloadable file
      const blob = new Blob([JSON.stringify(settings, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `codespace-settings-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Import settings from backup file
   */
  const importSettings = useCallback(async (file) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const text = await file.text()
      const settings = JSON.parse(text)
      
      await settingsService.importSettings(settings)
      await loadAllSettings()
      
      return true
    } catch (err) {
      setError(err.message || 'Failed to import settings')
      return false
    } finally {
      setIsLoading(false)
    }
  }, [loadAllSettings])

  /**
   * Auto-sync settings (debounced)
   */
  const autoSync = useCallback(async () => {
    try {
      await saveAllSettings()
    } catch (err) {
      console.warn('Auto-sync failed:', err.message)
    }
  }, [saveAllSettings])

  /**
   * Get settings summary for display
   */
  const getSettingsSummary = useCallback(() => {
    return {
      ui: {
        footerVisible: showFooter,
        panelsMode: allowMultiplePanels ? 'Multiple' : 'Single',
        primaryToggle: primaryPanelToggleBehavior,
        secondaryToggle: secondaryPanelToggleBehavior
      },
      editor: {
        fontSize: editorSettings.fontSize,
        fontFamily: editorSettings.fontFamily.split(',')[0].replace(/['"]/g, ''),
        theme: editorSettings.theme,
        tabSize: editorSettings.tabSize,
        wordWrap: editorSettings.wordWrap
      },
      lastSync: lastSyncTime
    }
  }, [
    showFooter,
    allowMultiplePanels,
    primaryPanelToggleBehavior,
    secondaryPanelToggleBehavior,
    editorSettings,
    lastSyncTime
  ])

  return {
    // State
    isLoading,
    error,
    lastSyncTime,
    
    // UI Settings
    uiSettings: {
      showFooter,
      allowMultiplePanels,
      primaryPanelToggleBehavior,
      secondaryPanelToggleBehavior,
      isPrimaryPanelCollapsed,
      isSecondaryPanelCollapsed
    },
    
    // Editor Settings
    editorSettings,
    
    // UI Actions
    toggleFooter,
    setAllowMultiplePanels,
    setPrimaryPanelToggleBehavior,
    setSecondaryPanelToggleBehavior,
    togglePrimaryPanel,
    toggleSecondaryPanel,
    resetUISettings,
    
    // Editor Actions
    updateEditorSetting,
    updateNestedEditorSetting,
    updateMultipleEditorSettings,
    resetEditorDefaults,
    resetEditorCategory,
    getMonacoOptions,
    
    // Unified Actions
    saveAllSettings,
    loadAllSettings,
    resetAllSettings,
    exportSettings,
    importSettings,
    autoSync,
    
    // Utilities
    getAllSettingsForAPI,
    getSettingsSummary,
    
    // Clear error
    clearError: () => setError(null)
  }
}

export default useSettingsManager
