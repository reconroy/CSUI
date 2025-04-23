import React, { useState, useEffect, useRef } from 'react';
import useAuthStore from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const OTPVerification = ({ userId, email, onBackToRegister }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  
  // Auth store actions
  const { verifyOTP, resendOTP, isLoading } = useAuthStore();
  
  // Timer for OTP expiry
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle OTP input change
  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^[0-9]*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Clear error when user types
    if (error) setError('');
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  // Handle key press
  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted data is a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5].focus();
    }
  };
  
  // Handle OTP verification
  const handleVerify = async () => {
    try {
      // Check if OTP is complete
      if (otp.some(digit => !digit)) {
        setError('Please enter the complete 6-digit OTP');
        return;
      }
      
      const otpString = otp.join('');
      await verifyOTP(userId, otpString);
      
      // Redirect to dashboard on success
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setError(error.message || 'Failed to verify OTP. Please try again.');
    }
  };
  
  // Handle OTP resend
  const handleResend = async () => {
    try {
      setIsResending(true);
      setMessage('');
      setError('');
      
      await resendOTP(userId);
      
      // Reset timer and show success message
      setTimeLeft(600);
      setMessage('OTP has been resent to your email');
    } catch (error) {
      setError(error.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <div className="auth-form-container">
      <h2 className="text-3xl font-bold text-white mb-2">Verify Your Email</h2>
      <p className="text-gray-400 mb-6">
        We've sent a verification code to <span className="text-green-400">{email}</span>
      </p>
      
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
              onChange={(e) => handleChange(index, e.target.value)}
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
            onClick={handleResend}
            disabled={isResending || timeLeft > 0}
            className={`text-green-400 hover:text-green-300 ${(isResending || timeLeft > 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isResending ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>
      </div>
      
      <div className="flex flex-col space-y-4">
        <button
          type="button"
          onClick={handleVerify}
          disabled={isLoading || otp.some(digit => !digit)}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/0 via-green-500/30 to-green-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-shine"></span>
          <span className="relative">{isLoading ? 'Verifying...' : 'Verify OTP'}</span>
        </button>
        
        <button
          type="button"
          onClick={onBackToRegister}
          className="w-full flex justify-center py-3 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
        >
          Back to Registration
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
