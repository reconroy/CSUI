import React, { useState } from 'react'
import useUISettingsStore from '../../stores/uiSettingsStore'
import useEditorSettingsStore from '../../stores/editorSettingsStore'

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

  // Editor Settings from store
  const {
    settings: editorSettings,
    updateSetting,
    updateNestedSetting,
    resetToDefaults: resetEditorDefaults,
    resetCategory,
    getDefaults
  } = useEditorSettingsStore()

  // Other settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    theme: 'dark',
    language: 'en'
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

  const handleResetEditor = () => {
    resetEditorDefaults()
    setMessage('Editor settings reset to defaults!')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleResetEditorCategory = (category) => {
    resetCategory(category)
    setMessage(`${category} settings reset to defaults!`)
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

              {/* Code Editor Settings */}
              {activeTab === 'editor' && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Code Editor Settings</h2>
                    <p className="text-gray-400 mb-6">Customize your Monaco Editor experience with comprehensive options</p>
                  </div>

                  {/* Appearance Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <span>🎨</span>
                        <span>Appearance</span>
                      </h3>
                      <button
                        onClick={() => handleResetEditorCategory('appearance')}
                        className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                      >
                        Reset to defaults
                      </button>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Font Size */}
                        <div>
                          <label className="block text-white font-medium mb-2">Font Size</label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="range"
                              min="10"
                              max="24"
                              value={editorSettings.fontSize}
                              onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                              className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <span className="text-green-400 font-mono text-sm w-8">{editorSettings.fontSize}px</span>
                          </div>
                        </div>

                        {/* Font Family */}
                        <div>
                          <label className="block text-white font-medium mb-2">Font Family</label>
                          <select
                            value={editorSettings.fontFamily}
                            onChange={(e) => updateSetting('fontFamily', e.target.value)}
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-green-500 focus:outline-none"
                          >
                            <option value="'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'SF Mono', Monaco, Menlo, 'Ubuntu Mono', monospace">Fira Code (Default)</option>
                            <option value="'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'SF Mono', Monaco, Menlo, monospace">Cascadia Code</option>
                            <option value="'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'SF Mono', Monaco, Menlo, monospace">JetBrains Mono</option>
                            <option value="'SF Mono', 'Monaco', 'Menlo', 'Fira Code', 'Cascadia Code', monospace">SF Mono</option>
                            <option value="Monaco, 'SF Mono', Menlo, 'Fira Code', 'Cascadia Code', monospace">Monaco</option>
                            <option value="Menlo, Monaco, 'SF Mono', 'Fira Code', 'Cascadia Code', monospace">Menlo</option>
                            <option value="'Ubuntu Mono', 'Fira Code', 'Cascadia Code', monospace">Ubuntu Mono</option>
                            <option value="'Courier New', Courier, monospace">Courier New</option>
                          </select>
                        </div>

                        {/* Line Height */}
                        <div>
                          <label className="block text-white font-medium mb-2">Line Height</label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="range"
                              min="1"
                              max="2"
                              step="0.1"
                              value={editorSettings.lineHeight}
                              onChange={(e) => updateSetting('lineHeight', parseFloat(e.target.value))}
                              className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <span className="text-green-400 font-mono text-sm w-8">{editorSettings.lineHeight}</span>
                          </div>
                        </div>

                        {/* Theme */}
                        <div>
                          <label className="block text-white font-medium mb-2">Theme</label>
                          <select
                            value={editorSettings.theme}
                            onChange={(e) => updateSetting('theme', e.target.value)}
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-green-500 focus:outline-none"
                          >
                            <option value="vs-dark">Dark (Default)</option>
                            <option value="vs">Light</option>
                            <option value="hc-black">High Contrast Dark</option>
                            <option value="hc-light">High Contrast Light</option>
                          </select>
                        </div>

                        {/* Line Numbers */}
                        <div>
                          <label className="block text-white font-medium mb-2">Line Numbers</label>
                          <select
                            value={editorSettings.lineNumbers}
                            onChange={(e) => updateSetting('lineNumbers', e.target.value)}
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-green-500 focus:outline-none"
                          >
                            <option value="on">On</option>
                            <option value="off">Off</option>
                            <option value="relative">Relative</option>
                            <option value="interval">Interval</option>
                          </select>
                        </div>

                        {/* Render Whitespace */}
                        <div>
                          <label className="block text-white font-medium mb-2">Show Whitespace</label>
                          <select
                            value={editorSettings.renderWhitespace}
                            onChange={(e) => updateSetting('renderWhitespace', e.target.value)}
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-green-500 focus:outline-none"
                          >
                            <option value="none">None</option>
                            <option value="boundary">Boundary</option>
                            <option value="selection">Selection</option>
                            <option value="trailing">Trailing</option>
                            <option value="all">All</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Editor Behavior Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <span>⚙️</span>
                        <span>Editor Behavior</span>
                      </h3>
                      <button
                        onClick={() => handleResetEditorCategory('editor')}
                        className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                      >
                        Reset to defaults
                      </button>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* Tab Size */}
                        <div>
                          <label className="block text-white font-medium mb-2">Tab Size</label>
                          <div className="flex items-center space-x-3">
                            <input
                              type="range"
                              min="1"
                              max="8"
                              value={editorSettings.tabSize}
                              onChange={(e) => updateSetting('tabSize', parseInt(e.target.value))}
                              className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <span className="text-green-400 font-mono text-sm w-8">{editorSettings.tabSize}</span>
                          </div>
                        </div>

                        {/* Word Wrap */}
                        <div>
                          <label className="block text-white font-medium mb-2">Word Wrap</label>
                          <select
                            value={editorSettings.wordWrap}
                            onChange={(e) => updateSetting('wordWrap', e.target.value)}
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-green-500 focus:outline-none"
                          >
                            <option value="off">Off</option>
                            <option value="on">On</option>
                            <option value="wordWrapColumn">Word Wrap Column</option>
                            <option value="bounded">Bounded</option>
                          </select>
                        </div>

                        {/* Cursor Style */}
                        <div>
                          <label className="block text-white font-medium mb-2">Cursor Style</label>
                          <select
                            value={editorSettings.cursorStyle}
                            onChange={(e) => updateSetting('cursorStyle', e.target.value)}
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-green-500 focus:outline-none"
                          >
                            <option value="line">Line</option>
                            <option value="block">Block</option>
                            <option value="underline">Underline</option>
                            <option value="line-thin">Line Thin</option>
                            <option value="block-outline">Block Outline</option>
                            <option value="underline-thin">Underline Thin</option>
                          </select>
                        </div>

                        {/* Cursor Blinking */}
                        <div>
                          <label className="block text-white font-medium mb-2">Cursor Blinking</label>
                          <select
                            value={editorSettings.cursorBlinking}
                            onChange={(e) => updateSetting('cursorBlinking', e.target.value)}
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-green-500 focus:outline-none"
                          >
                            <option value="blink">Blink</option>
                            <option value="smooth">Smooth</option>
                            <option value="phase">Phase</option>
                            <option value="expand">Expand</option>
                            <option value="solid">Solid</option>
                          </select>
                        </div>

                        {/* Auto Indent */}
                        <div>
                          <label className="block text-white font-medium mb-2">Auto Indent</label>
                          <select
                            value={editorSettings.autoIndent}
                            onChange={(e) => updateSetting('autoIndent', e.target.value)}
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-green-500 focus:outline-none"
                          >
                            <option value="none">None</option>
                            <option value="keep">Keep</option>
                            <option value="brackets">Brackets</option>
                            <option value="advanced">Advanced</option>
                            <option value="full">Full</option>
                          </select>
                        </div>

                        {/* Match Brackets */}
                        <div>
                          <label className="block text-white font-medium mb-2">Match Brackets</label>
                          <select
                            value={editorSettings.matchBrackets}
                            onChange={(e) => updateSetting('matchBrackets', e.target.value)}
                            className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-green-500 focus:outline-none"
                          >
                            <option value="never">Never</option>
                            <option value="near">Near</option>
                            <option value="always">Always</option>
                          </select>
                        </div>
                      </div>

                      {/* Toggle Options */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                          { key: 'insertSpaces', label: 'Insert Spaces', desc: 'Use spaces instead of tabs' },
                          { key: 'detectIndentation', label: 'Detect Indentation', desc: 'Auto-detect indentation from content' },
                          { key: 'formatOnType', label: 'Format On Type', desc: 'Format code as you type' },
                          { key: 'formatOnPaste', label: 'Format On Paste', desc: 'Format code when pasting' },
                          { key: 'trimAutoWhitespace', label: 'Trim Auto Whitespace', desc: 'Remove trailing whitespace' },
                          { key: 'selectOnLineNumbers', label: 'Select On Line Numbers', desc: 'Select line when clicking line number' }
                        ].map((option) => (
                          <div key={option.key} className="flex items-center justify-between p-3 bg-gray-600/30 rounded-lg">
                            <div>
                              <label className="text-white font-medium text-sm">{option.label}</label>
                              <p className="text-gray-400 text-xs">{option.desc}</p>
                            </div>
                            <button
                              onClick={() => updateSetting(option.key, !editorSettings[option.key])}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                editorSettings[option.key] ? 'bg-green-600' : 'bg-gray-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  editorSettings[option.key] ? 'translate-x-5' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Advanced Features Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                        <span>🚀</span>
                        <span>Advanced Features</span>
                      </h3>
                      <button
                        onClick={() => handleResetEditorCategory('features')}
                        className="text-sm text-gray-400 hover:text-green-400 transition-colors"
                      >
                        Reset to defaults
                      </button>
                    </div>
                    <div className="bg-gray-700/30 rounded-lg p-6 border border-gray-600/30">

                      {/* Minimap Settings */}
                      <div className="mb-6">
                        <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
                          <span>🗺️</span>
                          <span>Minimap</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="flex items-center justify-between p-3 bg-gray-600/30 rounded-lg">
                            <div>
                              <label className="text-white font-medium text-sm">Enable Minimap</label>
                              <p className="text-gray-400 text-xs">Show code overview</p>
                            </div>
                            <button
                              onClick={() => updateSetting('minimapEnabled', !editorSettings.minimapEnabled)}
                              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                editorSettings.minimapEnabled ? 'bg-green-600' : 'bg-gray-600'
                              }`}
                            >
                              <span
                                className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                  editorSettings.minimapEnabled ? 'translate-x-5' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          {editorSettings.minimapEnabled && (
                            <>
                              <div>
                                <label className="block text-white font-medium mb-2 text-sm">Minimap Side</label>
                                <select
                                  value={editorSettings.minimapSide}
                                  onChange={(e) => updateSetting('minimapSide', e.target.value)}
                                  className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-green-500 focus:outline-none text-sm"
                                >
                                  <option value="right">Right</option>
                                  <option value="left">Left</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-white font-medium mb-2 text-sm">Minimap Size</label>
                                <select
                                  value={editorSettings.minimapSize}
                                  onChange={(e) => updateSetting('minimapSize', e.target.value)}
                                  className="w-full bg-gray-600 text-white px-3 py-2 rounded-lg border border-gray-500 focus:border-green-500 focus:outline-none text-sm"
                                >
                                  <option value="proportional">Proportional</option>
                                  <option value="fill">Fill</option>
                                  <option value="fit">Fit</option>
                                </select>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* IntelliSense & Suggestions */}
                      <div className="mb-6">
                        <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
                          <span>🧠</span>
                          <span>IntelliSense & Suggestions</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[
                            { key: 'quickSuggestions', label: 'Quick Suggestions', desc: 'Show suggestions as you type' },
                            { key: 'suggestOnTriggerCharacters', label: 'Trigger Character Suggestions', desc: 'Suggest on trigger characters' },
                            { key: 'wordBasedSuggestions', label: 'Word Based Suggestions', desc: 'Suggest words from document' },
                            { key: 'parameterHints.enabled', label: 'Parameter Hints', desc: 'Show function parameter hints', nested: true },
                            { key: 'hover.enabled', label: 'Hover Information', desc: 'Show hover information', nested: true },
                            { key: 'codeLens', label: 'Code Lens', desc: 'Show code lens information' }
                          ].map((option) => (
                            <div key={option.key} className="flex items-center justify-between p-3 bg-gray-600/30 rounded-lg">
                              <div>
                                <label className="text-white font-medium text-sm">{option.label}</label>
                                <p className="text-gray-400 text-xs">{option.desc}</p>
                              </div>
                              <button
                                onClick={() => {
                                  if (option.nested) {
                                    const [parent, child] = option.key.split('.')
                                    updateNestedSetting(parent, child, !editorSettings[parent][child])
                                  } else {
                                    updateSetting(option.key, !editorSettings[option.key])
                                  }
                                }}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                  (option.nested
                                    ? editorSettings[option.key.split('.')[0]][option.key.split('.')[1]]
                                    : editorSettings[option.key]
                                  ) ? 'bg-green-600' : 'bg-gray-600'
                                }`}
                              >
                                <span
                                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                    (option.nested
                                      ? editorSettings[option.key.split('.')[0]][option.key.split('.')[1]]
                                      : editorSettings[option.key]
                                    ) ? 'translate-x-5' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Code Folding & Guides */}
                      <div>
                        <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
                          <span>📁</span>
                          <span>Code Folding & Guides</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[
                            { key: 'folding', label: 'Code Folding', desc: 'Enable code folding' },
                            { key: 'foldingHighlight', label: 'Folding Highlight', desc: 'Highlight folded regions' },
                            { key: 'bracketPairColorization', label: 'Bracket Colorization', desc: 'Colorize matching brackets' },
                            { key: 'guides.bracketPairs', label: 'Bracket Guides', desc: 'Show bracket pair guides', nested: true },
                            { key: 'guides.indentation', label: 'Indentation Guides', desc: 'Show indentation guides', nested: true },
                            { key: 'renderIndentGuides', label: 'Render Indent Guides', desc: 'Render indentation guides' }
                          ].map((option) => (
                            <div key={option.key} className="flex items-center justify-between p-3 bg-gray-600/30 rounded-lg">
                              <div>
                                <label className="text-white font-medium text-sm">{option.label}</label>
                                <p className="text-gray-400 text-xs">{option.desc}</p>
                              </div>
                              <button
                                onClick={() => {
                                  if (option.nested) {
                                    const [parent, child] = option.key.split('.')
                                    updateNestedSetting(parent, child, !editorSettings[parent][child])
                                  } else {
                                    updateSetting(option.key, !editorSettings[option.key])
                                  }
                                }}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                                  (option.nested
                                    ? editorSettings[option.key.split('.')[0]][option.key.split('.')[1]]
                                    : editorSettings[option.key]
                                  ) ? 'bg-green-600' : 'bg-gray-600'
                                }`}
                              >
                                <span
                                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                    (option.nested
                                      ? editorSettings[option.key.split('.')[0]][option.key.split('.')[1]]
                                      : editorSettings[option.key]
                                    ) ? 'translate-x-5' : 'translate-x-1'
                                  }`}
                                />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
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
                      <span>Save Editor Settings</span>
                    </button>
                    <button
                      onClick={handleResetEditor}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Reset All to Defaults</span>
                    </button>
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