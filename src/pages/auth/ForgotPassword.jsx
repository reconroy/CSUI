import React, { useState, useEffect, useRef } from 'react'
import useAuthStore from '../../store/authStore'

const ForgotPassword = ({ onLoginClick }) => {
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [userId, setUserId] = useState(null)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef([])

  // Get auth store state and actions
  const { forgotPassword, resetPassword, verifyResetOTP, resendOTP, isLoading, error: authError } = useAuthStore()

  // Set error from auth store
  useEffect(() => {
    if (authError) {
      setError(authError)
    }
  }, [authError])

  // Timer for OTP expiry
  useEffect(() => {
    if (timeLeft <= 0 || step !== 2) return

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [timeLeft, step])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Handle OTP input change
  const handleOTPChange = (index, value) => {
    // Only allow numbers
    if (!/^[0-9]*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Clear error when user types
    if (error) setError('')

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus()
    }
  }

  // Handle key press
  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')

    // Check if pasted data is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      inputRefs.current[5].focus()
    }
  }

  // Handle OTP resend
  const handleResendOTP = async () => {
    try {
      setIsResending(true)
      setMessage('')
      setError('')

      await resendOTP(userId, 'password-reset')

      // Reset timer and show success message
      setTimeLeft(600)
      setMessage('OTP has been resent to your email')
    } catch (error) {
      setError(error.message || 'Failed to resend OTP. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  // Handle email submission
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    // Simple validation
    if (!email) {
      setError('Please enter your email address')
      return
    }

    try {
      const response = await forgotPassword(email)
      setUserId(response.userId)
      setMessage('OTP has been sent to your email')
      setTimeLeft(600) // Reset timer
      setStep(2)
    } catch (error) {
      setError(error.message || 'Failed to send OTP. Please try again.')
    }
  }

  // Handle OTP verification
  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    // Check if OTP is complete
    if (otp.some(digit => !digit)) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    try {
      const otpString = otp.join('')

      // First verify the OTP with the backend
      await verifyResetOTP(userId, otpString)

      // Show success message
      setMessage('OTP verified successfully')

      // Move to password reset step after a short delay
      setTimeout(() => {
        setStep(3)
      }, 1000)
    } catch (error) {
      setError(error.message || 'Invalid OTP. Please try again.')
    }
  }

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (!newPassword || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      const otpString = otp.join('')
      await resetPassword(userId, otpString, newPassword)
      setMessage('Password has been reset successfully')
      setStep(4) // Success step
    } catch (error) {
      setError(error.message || 'Failed to reset password. Please try again.')
    }
  }

  return (
    <div className="auth-form-container">
      <h2 className="text-3xl font-bold text-white mb-2 text-center">Reset Your Password</h2>
      <p className="text-gray-400 mb-6 text-center">
        {step === 1 && "Enter your email to receive a verification code"}
        {step === 2 && "Enter the verification code sent to your email"}
        {step === 3 && "Create a new password for your account"}
        {step === 4 && "Your password has been reset successfully"}
      </p>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {message && (
        <div className="text-center bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-4" role="alert">
          <span className="block sm:inline">{message}</span>
        </div>
      )}

      {/* Step 1: Email Input */}
      {step === 1 && (
        <form onSubmit={handleEmailSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/0 via-green-500/30 to-green-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-shine"></span>
              <span className="relative">{isLoading ? 'Sending...' : 'Send Verification Code'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Step 2: OTP Input */}
      {step === 2 && (
        <form onSubmit={handleOTPSubmit} className="space-y-5">
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Enter 6-digit OTP</label>
            <div className="flex gap-2 justify-between">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : null}
                  className="w-12 h-12 text-center text-xl bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white"
                />
              ))}
            </div>
            <div className="mt-2 text-gray-400 text-sm flex justify-between">
              <span>Time remaining: {formatTime(timeLeft)}</span>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResending || timeLeft > 0}
                className={`text-green-400 hover:text-green-300 ${(isResending || timeLeft > 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </button>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={isLoading || otp.some(digit => !digit)}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/0 via-green-500/30 to-green-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-shine"></span>
              <span className="relative">{isLoading ? 'Verifying...' : 'Verify OTP'}</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full flex justify-center py-3 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              Back to Email
            </button>
          </div>
        </form>
      )}

      {/* Step 3: New Password */}
      {step === 3 && (
        <form onSubmit={handlePasswordReset} className="space-y-5">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>

          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/0 via-green-500/30 to-green-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-shine"></span>
              <span className="relative">{isLoading ? 'Resetting...' : 'Reset Password'}</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full flex justify-center py-3 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              Back to Verification
            </button>
          </div>
        </form>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="text-center bg-gray-700/50 p-6 rounded-lg border border-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-xl font-semibold text-white mb-2">Password Reset Successful</h3>
          <p className="text-gray-300 mb-4">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <button
            onClick={onLoginClick}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/0 via-green-500/30 to-green-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-shine"></span>
            <span className="relative">Go to Login</span>
          </button>
        </div>
      )}

      {step !== 4 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            <button
              onClick={onLoginClick}
              className="font-medium text-green-400 hover:text-green-300"
            >
              Back to Sign in
            </button>
          </p>
        </div>
      )}
    </div>
  )
}

export default ForgotPassword