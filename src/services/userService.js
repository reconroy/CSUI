import * as api from './api';

/**
 * Update user profile
 * @param {Object} profileData - User profile data
 * @returns {Promise} - Response data
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/users/profile', profileData, true);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to update profile');
  }
};

/**
 * Upload profile picture
 * @param {string} imageUrl - URL of the profile picture
 * @returns {Promise} - Response data
 */
export const uploadProfilePicture = async (imageUrl) => {
  try {
    // If imageUrl is empty, use the delete endpoint
    if (!imageUrl) {
      const response = await api.del('/users/profile-picture', true);
      return response;
    }
    const response = await api.post('/users/profile-picture', { imageUrl }, true);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to upload profile picture');
  }
};

/**
 * Delete profile picture
 * @returns {Promise} - Response data
 */
export const deleteProfilePicture = async () => {
  try {
    const response = await api.del('/users/profile-picture', true);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to delete profile picture');
  }
};

/**
 * Upload cover photo
 * @param {string} imageUrl - URL of the cover photo
 * @returns {Promise} - Response data
 */
export const uploadCoverPhoto = async (imageUrl) => {
  try {
    // If imageUrl is empty, use the delete endpoint
    if (!imageUrl) {
      const response = await api.del('/users/cover-photo', true);
      return response;
    }
    const response = await api.post('/users/cover-photo', { imageUrl }, true);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to upload cover photo');
  }
};

/**
 * Delete cover photo
 * @returns {Promise} - Response data
 */
export const deleteCoverPhoto = async () => {
  try {
    const response = await api.del('/users/cover-photo', true);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to delete cover photo');
  }
};

/**
 * Add education to profile
 * @param {Object} educationData - Education data
 * @returns {Promise} - Response data
 */
export const addEducation = async (educationData) => {
  try {
    const response = await api.post('/users/education', educationData, true);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to add education');
  }
};

/**
 * Delete education from profile
 * @param {string} educationId - Education ID
 * @returns {Promise} - Response data
 */
export const deleteEducation = async (educationId) => {
  try {
    const response = await api.del(`/users/education/${educationId}`, true);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to delete education');
  }
};

/**
 * Add experience to profile
 * @param {Object} experienceData - Experience data
 * @returns {Promise} - Response data
 */
export const addExperience = async (experienceData) => {
  try {
    const response = await api.post('/users/experience', experienceData, true);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to add experience');
  }
};

/**
 * Delete experience from profile
 * @param {string} experienceId - Experience ID
 * @returns {Promise} - Response data
 */
export const deleteExperience = async (experienceId) => {
  try {
    const response = await api.del(`/users/experience/${experienceId}`, true);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to delete experience');
  }
};

/**
 * Add project to profile
 * @param {Object} projectData - Project data
 * @returns {Promise} - Response data
 */
export const addProject = async (projectData) => {
  try {
    const response = await api.post('/users/projects', projectData, true);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to add project');
  }
};

/**
 * Delete project from profile
 * @param {string} projectId - Project ID
 * @returns {Promise} - Response data
 */
export const deleteProject = async (projectId) => {
  try {
    const response = await api.del(`/users/projects/${projectId}`, true);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to delete project');
  }
};
