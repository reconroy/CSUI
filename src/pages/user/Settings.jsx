import React, { useState } from 'react'
import useUISettingsStore from '../../stores/uiSettingsStore'

const Settings = () => {
  const [activeTab, setActiveTab] = useState('ui')
  const [message, setMessage] = useState('')

  // UI Settings from store
  const {
    showFooter,
    allowMultiplePanels,
    primaryPanelToggleBehavior,
    secondaryPanelToggleBehavior,
    toggleFooter,
    setAllowMultiplePanels,
    setPrimaryPanelToggleBehavior,
    setSecondaryPanelToggleBehavior,
    resetUISettings
  } = useUISettingsStore()

  // Other settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    theme: 'dark',
    language: 'en',
    codeEditor: {
      fontSize: '14px',
      tabSize: 2,
      autoSave: true,
      wordWrap: false
    }
  })

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked
      }
    }))
  }

  const handleEditorChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      codeEditor: {
        ...prev.codeEditor,
        [name]: type === 'checkbox' ? checked : value
      }
    }))
  }

  const handleSaveSettings = () => {
    setMessage('Settings saved successfully!')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleResetUI = () => {
    resetUISettings()
    setMessage('UI settings reset to defaults!')
    setTimeout(() => setMessage(''), 3000)
  }

  const tabs = [
    { id: 'ui', label: 'UI Layout', icon: '🎨' },
    { id: 'editor', label: 'Code Editor', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'general', label: 'General', icon: '🌐' },
  ]

  return (
    <div className="h-full bg-gray-900 text-white overflow-auto">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Customize your CodeSpace experience</p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-6 p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-400">{message}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-green-600/20 text-green-400 border border-green-500/30'
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 p-6">

              {/* UI Layout Settings */}
              {activeTab === 'ui' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">UI Layout Settings</h2>
                    <p className="text-gray-400 mb-6">Customize the appearance and behavior of your interface</p>
                  </div>

                  {/* Footer Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <span>📄</span>
                      <span>Footer</span>
                    </h3>
                    <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-white font-medium">Show Footer</label>
                          <p className="text-gray-400 text-sm">Display footer at the bottom of the page</p>
                        </div>
                        <button
                          onClick={toggleFooter}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            showFooter ? 'bg-green-600' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              showFooter ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Primary Panel Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <span>📋</span>
                      <span>Primary Panel (Left Sidebar)</span>
                    </h3>
                    <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                      <div>
                        <label className="text-white font-medium mb-2 block">Toggle Behavior</label>
                        <p className="text-gray-400 text-sm mb-4">Choose how the toggle button behaves when clicked</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            {
                              value: 'shrink',
                              label: 'Shrink/Expand',
                              desc: 'Panel shrinks to icon-only width but stays visible',
                              icon: '↔️',
                              detail: 'Best for quick access while maximizing editor space'
                            },
                            {
                              value: 'minimize',
                              label: 'Minimize/Restore',
                              desc: 'Panel collapses to a thin strip but remains present',
                              icon: '📐',
                              detail: 'Like minimizing a window - panel edge stays visible'
                            }
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setPrimaryPanelToggleBehavior(option.value)}
                              className={`p-4 rounded-lg border text-left transition-colors ${
                                primaryPanelToggleBehavior === option.value
                                  ? 'bg-green-600/20 border-green-500/50 text-green-400'
                                  : 'bg-gray-600/20 border-gray-600/50 text-gray-300 hover:bg-gray-600/30'
                              }`}
                            >
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-lg">{option.icon}</span>
                                <div className="font-medium">{option.label}</div>
                              </div>
                              <div className="text-sm opacity-75 mb-2">{option.desc}</div>
                              <div className="text-xs opacity-60">{option.detail}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Panel Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <span>📊</span>
                      <span>Secondary Panel (Right Sidebar)</span>
                    </h3>
                    <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                      <div>
                        <label className="text-white font-medium mb-2 block">Toggle Behavior</label>
                        <p className="text-gray-400 text-sm mb-4">Choose how the toggle button behaves when clicked</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            {
                              value: 'shrink',
                              label: 'Shrink/Expand',
                              desc: 'Panel shrinks to icon-only width but stays visible',
                              icon: '↔️',
                              detail: 'Best for quick access while maximizing editor space'
                            },
                            {
                              value: 'minimize',
                              label: 'Minimize/Restore',
                              desc: 'Panel collapses to a thin strip but remains present',
                              icon: '📐',
                              detail: 'Like minimizing a window - panel edge stays visible'
                            }
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => setSecondaryPanelToggleBehavior(option.value)}
                              className={`p-4 rounded-lg border text-left transition-colors ${
                                secondaryPanelToggleBehavior === option.value
                                  ? 'bg-green-600/20 border-green-500/50 text-green-400'
                                  : 'bg-gray-600/20 border-gray-600/50 text-gray-300 hover:bg-gray-600/30'
                              }`}
                            >
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-lg">{option.icon}</span>
                                <div className="font-medium">{option.label}</div>
                              </div>
                              <div className="text-sm opacity-75 mb-2">{option.desc}</div>
                              <div className="text-xs opacity-60">{option.detail}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Panel Behavior Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <span>⚙️</span>
                      <span>Panel Behavior</span>
                    </h3>
                    <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-white font-medium">Allow Multiple Panels</label>
                          <p className="text-gray-400 text-sm">Allow both panels to be open simultaneously</p>
                        </div>
                        <button
                          onClick={() => setAllowMultiplePanels(!allowMultiplePanels)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            allowMultiplePanels ? 'bg-green-600' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              allowMultiplePanels ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      {!allowMultiplePanels && (
                        <div className="mt-3 p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                          <p className="text-yellow-400 text-sm">
                            ⚠️ When disabled, opening one panel will automatically close the other
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-700/50">
                    <button
                      onClick={handleSaveSettings}
                      className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Save UI Settings</span>
                    </button>
                    <button
                      onClick={handleResetUI}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Reset to Defaults</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Other tabs placeholder */}
              {activeTab === 'editor' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Code Editor Settings</h2>
                    <p className="text-gray-400 mb-6">Configure your coding environment</p>
                  </div>
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-4">⚙️</div>
                    <p>Code editor settings coming soon...</p>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Notification Settings</h2>
                    <p className="text-gray-400 mb-6">Manage your notification preferences</p>
                  </div>
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-4">🔔</div>
                    <p>Notification settings coming soon...</p>
                  </div>
                </div>
              )}

              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">General Settings</h2>
                    <p className="text-gray-400 mb-6">General application preferences</p>
                  </div>
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-4">🌐</div>
                    <p>General settings coming soon...</p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings