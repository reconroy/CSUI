import React, { useState } from 'react'

const ForgotPassword = ({ onLoginClick }) => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    // Simple validation
    if (!email) {
      setError('Please enter your email address')
      return
    }

    // For demo purposes, we'll just show a success message
    // In a real app, you would send a password reset email
    setIsSubmitted(true)
    setMessage('Password reset instructions have been sent to your email')
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Reset Your Password</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{message}</span>
        </div>
      )}

      {!isSubmitted ? (
        <>
          <p className="text-gray-600 mb-8">
            Enter your email address and we'll send you instructions to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send Reset Instructions
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="text-center bg-blue-50 p-6 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Check Your Email</h3>
          <p className="text-gray-600 mb-4">
            We've sent password reset instructions to your email. If you don't see it, check your spam folder.
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          <button
            onClick={onLoginClick}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Back to Sign in
          </button>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword