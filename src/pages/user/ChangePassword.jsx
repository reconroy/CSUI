import React, { useState } from 'react'

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    // Simple validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match')
      return
    }

    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long')
      return
    }

    // For demo purposes, we'll just show a success message
    // In a real app, you would send the password change request to your API
    setMessage('Password changed successfully')
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">Change Password</h2>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {message && (
        <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-4" role="alert">
          <span className="block sm:inline">{message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            required
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/0 via-green-500/30 to-green-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-shine"></span>
            <span className="relative">Change Password</span>
          </button>
        </div>
      </form>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Password Requirements</h3>
        <ul className="list-disc pl-5 text-sm text-gray-400 space-y-1">
          <li>At least 8 characters long</li>
          <li>Include at least one uppercase letter</li>
          <li>Include at least one number</li>
          <li>Include at least one special character</li>
        </ul>
      </div>
    </div>
  )
}

export default ChangePassword