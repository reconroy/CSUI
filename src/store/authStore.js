import { create } from 'zustand';
import * as authService from '../services/authService';

/**
 * Auth store for managing authentication state
 */
const useAuthStore = create((set, get) => ({
  // State
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,
  registrationData: null,

  // Actions

  /**
   * Check if email exists
   * @param {string} email - User email
   */
  checkEmail: async (email) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.checkEmail(email);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  /**
   * Register a new user
   * @param {object} userData - User data (name, email, password)
   */
  register: async (userData) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.register(userData);
      set({
        isLoading: false,
        registrationData: {
          userId: response.userId,
          email: userData.email
        }
      });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  /**
   * Verify OTP
   * @param {string} userId - User ID
   * @param {string} otp - One-time password
   */
  verifyOTP: async (userId, otp) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.verifyOTP(userId, otp);

      // Update auth state
      set({
        isLoading: false,
        isAuthenticated: true,
        user: response.user,
        registrationData: null
      });

      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  /**
   * Resend OTP
   * @param {string} userId - User ID
   * @param {string} purpose - OTP purpose ('verification' or 'password-reset')
   */
  resendOTP: async (userId, purpose = 'verification') => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.resendOTP(userId, purpose);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} rememberMe - Whether to remember the user
   */
  login: async (email, password, rememberMe = false) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login(email, password, rememberMe);

      // Update auth state
      set({
        isLoading: false,
        isAuthenticated: true,
        user: response.user
      });

      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    authService.logout();
    set({
      isAuthenticated: false,
      user: null
    });
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.getProfile();

      // Update user data
      set({
        isLoading: false,
        user: response.user
      });

      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  /**
   * Forgot password
   * @param {string} email - User email
   */
  forgotPassword: async (email) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.forgotPassword(email);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  /**
   * Verify password reset OTP
   * @param {string} userId - User ID
   * @param {string} otp - One-time password
   */
  verifyResetOTP: async (userId, otp) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.verifyResetOTP(userId, otp);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  /**
   * Reset password
   * @param {string} userId - User ID
   * @param {string} otp - One-time password
   * @param {string} newPassword - New password
   */
  resetPassword: async (userId, otp, newPassword) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.resetPassword(userId, otp, newPassword);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  /**
   * Change password
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   */
  changePassword: async (currentPassword, newPassword) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.changePassword(currentPassword, newPassword);
      set({ isLoading: false });
      return response;
    } catch (error) {
      set({ isLoading: false, error: error.message });
      throw error;
    }
  },

  /**
   * Clear error
   */
  clearError: () => set({ error: null })
}));

export default useAuthStore;
