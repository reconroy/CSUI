import * as api from './api';

/**
 * Authentication service for handling user authentication
 */

/**
 * Check if email exists
 * @param {string} email - User email
 * @returns {Promise} - Response data
 */
export const checkEmail = async (email) => {
  return await api.post('/auth/check-email', { email });
};

/**
 * Register a new user
 * @param {object} userData - User data (name, email, password)
 * @returns {Promise} - Response data
 */
export const register = async (userData) => {
  return await api.post('/auth/register', userData);
};

/**
 * Verify OTP
 * @param {string} userId - User ID
 * @param {string} otp - One-time password
 * @returns {Promise} - Response data
 */
export const verifyOTP = async (userId, otp) => {
  const response = await api.post('/auth/verify-otp', { userId, otp });

  // Store token and user data in localStorage (same as login)
  if (response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('isAuthenticated', 'true');
  }

  return response;
};

/**
 * Resend OTP
 * @param {string} userId - User ID
 * @param {string} purpose - OTP purpose ('verification' or 'password-reset')
 * @returns {Promise} - Response data
 */
export const resendOTP = async (userId, purpose = 'verification') => {
  return await api.post('/auth/resend-otp', { userId, purpose });
};

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {boolean} rememberMe - Whether to remember the user
 * @returns {Promise} - Response data
 */
export const login = async (email, password, rememberMe = false) => {
  const response = await api.post('/auth/login', { email, password, rememberMe });

  // Store token and user data in localStorage
  if (response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('isAuthenticated', 'true');
  }

  return response;
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
};

/**
 * Get current user
 * @returns {object|null} - User data or null if not logged in
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Check if user is authenticated
 * @returns {boolean} - Whether the user is authenticated
 */
export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

/**
 * Get user profile
 * @returns {Promise} - Response data
 */
export const getProfile = async () => {
  return await api.get('/auth/me', true);
};

/**
 * Forgot password
 * @param {string} email - User email
 * @returns {Promise} - Response data
 */
export const forgotPassword = async (email) => {
  return await api.post('/auth/forgot-password', { email });
};

/**
 * Verify password reset OTP
 * @param {string} userId - User ID
 * @param {string} otp - One-time password
 * @returns {Promise} - Response data
 */
export const verifyResetOTP = async (userId, otp) => {
  return await api.post('/auth/verify-reset-otp', { userId, otp });
};

/**
 * Reset password
 * @param {string} userId - User ID
 * @param {string} otp - One-time password
 * @param {string} newPassword - New password
 * @returns {Promise} - Response data
 */
export const resetPassword = async (userId, otp, newPassword) => {
  return await api.post('/auth/reset-password', { userId, otp, newPassword });
};

/**
 * Change password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise} - Response data
 */
export const changePassword = async (currentPassword, newPassword) => {
  return await api.put('/auth/change-password', { currentPassword, newPassword }, true);
};

/**
 * Get Google OAuth URL
 * @returns {string} - Google OAuth URL
 */
export const getGoogleAuthUrl = () => {
  const apiUrl = api.getApiUrl();
  return `${apiUrl}/auth/google`;
};

/**
 * Initiate Google OAuth login
 * Opens a new window for Google authentication
 */
export const initiateGoogleAuth = () => {
  const googleAuthUrl = getGoogleAuthUrl();
  window.location.href = googleAuthUrl;
};

/**
 * Get GitHub OAuth URL
 * @returns {string} - GitHub OAuth URL
 */
export const getGitHubAuthUrl = () => {
  const apiUrl = api.getApiUrl();
  return `${apiUrl}/auth/github`;
};

/**
 * Initiate GitHub OAuth login
 * Opens a new window for GitHub authentication
 */
export const initiateGitHubAuth = () => {
  const gitHubAuthUrl = getGitHubAuthUrl();
  window.location.href = gitHubAuthUrl;
};
