import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import * as api from '../../services/api';

const SocialAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Get auth store actions
  const { setAuthState } = useAuthStore();

  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const handleSocialCallback = async () => {
      try {
        // Get parameters from URL
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');
        const error = searchParams.get('error');
        const errorMessage = searchParams.get('message');
        const accountLinked = searchParams.get('accountLinked') === 'true';

        // Handle error cases
        if (error) {
          setError(`${errorMessage || `Authentication failed: ${error}`}`);
          setLoading(false);
          return;
        }

        if (!token || !userId) {
          setError('Invalid authentication response');
          setLoading(false);
          return;
        }

        // Store token and user data in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('isAuthenticated', 'true');

        // Fetch user data using the API service
        console.log('Fetching user data using API service');

        // Use the API service to make the request
        const data = await api.get('/auth/me', true);
        console.log('User data fetched successfully:', data);

        if (!data.success) {
          throw new Error(data.message || 'Failed to fetch user data');
        }

        // Store user data
        localStorage.setItem('user', JSON.stringify(data.user));

        // Update auth state
        setAuthState({
          isAuthenticated: true,
          user: data.user
        });

        // Check if this was an account linking
        if (accountLinked) {
          setSuccessMessage(`Your Google account has been successfully linked to your existing account (${data.user.email}).`);
          setShowSuccess(true);
          setLoading(false);

          // Redirect to dashboard after a delay
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 3000);
        } else {
          // Redirect to dashboard immediately
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Social callback error:', error);
        setError(error.message || 'Authentication failed');
        setLoading(false);
      }
    };

    handleSocialCallback();
  }, [searchParams, navigate, setAuthState]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Completing Login</h2>
            <p className="mt-2 text-gray-400">Please wait while we complete your authentication...</p>
          </div>
          <div className="flex justify-center mt-6">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Success!</h2>
            <div className="mt-4 flex justify-center">
              <svg className="h-16 w-16 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="mt-4 text-green-400">{successMessage}</p>
            <p className="mt-2 text-gray-400">Redirecting to dashboard...</p>
          </div>
          <div className="flex justify-center mt-6">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Authentication Failed</h2>
            <p className="mt-2 text-red-400">{error}</p>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate('/', { replace: true })}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SocialAuthCallback;
