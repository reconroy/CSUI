import React, { useState } from 'react'

const Menu = ({ onLoginClick, onRegisterClick }) => {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const handleUrlChange = (e) => {
    setUrl(e.target.value)
    if (error) setError('')
  }

  const handleAccessCodespace = (e) => {
    e.preventDefault()

    // Basic URL validation
    if (!url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    // Here you would handle the logic to access a public codespace
    // For now, we'll just show a placeholder message
    console.log(`Accessing codespace at: ${url}`)
    // Later you can implement the actual navigation or API call
  }

  return (
    <div className="auth-form-container">
      <h2 className="text-3xl font-bold text-white mb-2">Welcome to CodeSpace</h2>
      <p className="text-gray-400 mb-6">Your collaborative coding platform</p>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleAccessCodespace} className="space-y-5 mb-6">
        <div>
          <label htmlFor="codespace-url" className="block text-sm font-medium text-gray-300 mb-1">Access a Public Codespace</label>
          <div className="flex">
            <input
              type="text"
              id="codespace-url"
              name="codespace-url"
              value={url}
              onChange={handleUrlChange}
              placeholder="Enter codespace URL"
              className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-l-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/0 via-green-500/30 to-green-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-shine"></span>
              <span className="relative">Access</span>
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-400">Enter a URL to access a public codespace as a guest</p>
        </div>
      </form>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-800 text-gray-400">Or</span>
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onLoginClick}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 relative overflow-hidden group"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/0 via-green-500/30 to-green-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-shine"></span>
          <span className="relative">Sign in to your account</span>
        </button>

        <button
          onClick={onRegisterClick}
          className="w-full flex justify-center py-3 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
        >
          Create a new account
        </button>
      </div>
    </div>
  )
}

export default Menu