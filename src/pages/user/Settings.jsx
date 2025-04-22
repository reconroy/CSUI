import React, { useState } from 'react'

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    theme: 'light',
    language: 'en',
    codeEditor: {
      fontSize: '14px',
      tabSize: 2,
      autoSave: true,
      wordWrap: false
    }
  })

  const [message, setMessage] = useState('')

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

  const handleThemeChange = (e) => {
    setSettings(prev => ({
      ...prev,
      theme: e.target.value
    }))
  }

  const handleLanguageChange = (e) => {
    setSettings(prev => ({
      ...prev,
      language: e.target.value
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

  const handleSubmit = (e) => {
    e.preventDefault()
    // For demo purposes, we'll just show a success message
    // In a real app, you would save the settings to your API
    setMessage('Settings saved successfully')
    setTimeout(() => setMessage(''), 3000)
  }

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Settings</h2>

      {message && (
        <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-4" role="alert">
          <span className="block sm:inline">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Notifications</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="email"
                name="email"
                checked={settings.notifications.email}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-green-500 focus:ring-green-400 bg-gray-700 border-gray-600 rounded"
              />
              <label htmlFor="email" className="ml-2 block text-sm text-gray-300">
                Email notifications
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="push"
                name="push"
                checked={settings.notifications.push}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-green-500 focus:ring-green-400 bg-gray-700 border-gray-600 rounded"
              />
              <label htmlFor="push" className="ml-2 block text-sm text-gray-300">
                Push notifications
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="sms"
                name="sms"
                checked={settings.notifications.sms}
                onChange={handleNotificationChange}
                className="h-4 w-4 text-green-500 focus:ring-green-400 bg-gray-700 border-gray-600 rounded"
              />
              <label htmlFor="sms" className="ml-2 block text-sm text-gray-300">
                SMS notifications
              </label>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Appearance</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="theme" className="block text-sm font-medium text-gray-300 mb-1">Theme</label>
              <select
                id="theme"
                value={settings.theme}
                onChange={handleThemeChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System Default</option>
              </select>
            </div>

            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-1">Language</label>
              <select
                id="language"
                value={settings.language}
                onChange={handleLanguageChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-medium text-white mb-4">Code Editor</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fontSize" className="block text-sm font-medium text-gray-300 mb-1">Font Size</label>
              <select
                id="fontSize"
                name="fontSize"
                value={settings.codeEditor.fontSize}
                onChange={handleEditorChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
              </select>
            </div>

            <div>
              <label htmlFor="tabSize" className="block text-sm font-medium text-gray-300 mb-1">Tab Size</label>
              <select
                id="tabSize"
                name="tabSize"
                value={settings.codeEditor.tabSize}
                onChange={handleEditorChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={8}>8 spaces</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoSave"
                name="autoSave"
                checked={settings.codeEditor.autoSave}
                onChange={handleEditorChange}
                className="h-4 w-4 text-green-500 focus:ring-green-400 bg-gray-700 border-gray-600 rounded"
              />
              <label htmlFor="autoSave" className="ml-2 block text-sm text-gray-300">
                Auto Save
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="wordWrap"
                name="wordWrap"
                checked={settings.codeEditor.wordWrap}
                onChange={handleEditorChange}
                className="h-4 w-4 text-green-500 focus:ring-green-400 bg-gray-700 border-gray-600 rounded"
              />
              <label htmlFor="wordWrap" className="ml-2 block text-sm text-gray-300">
                Word Wrap
              </label>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/0 via-green-500/30 to-green-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-shine"></span>
            <span className="relative">Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default Settings