import React, { useState, useEffect, useRef } from 'react'
import useAuthStore from '../../store/authStore'
import { updateProfile, uploadProfilePicture } from '../../services/userService'
import { FaCamera, FaUser } from 'react-icons/fa'

// Helper function to compress image
const compressImage = (imageDataUrl, maxWidth = 800, maxHeight = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = imageDataUrl
    img.onload = () => {
      // Create canvas
      const canvas = document.createElement('canvas')
      let width = img.width
      let height = img.height

      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height)
          height = maxHeight
        }
      }

      // Resize image
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      // Get compressed data URL
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedDataUrl)
    }
  })
}

const Profile = () => {
  // Get user data from auth store
  const { user, getProfile, isLoading } = useAuthStore()

  // Local state for profile data
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    title: '',
    location: '',
    website: '',
    dateOfBirth: '',
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      instagram: '',
      youtube: ''
    },
    skills: []
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const fileInputRef = useRef(null)

  // Load user profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        await getProfile()
      } catch (error) {
        console.error('Failed to load profile:', error)
        setError('Failed to load profile data')
      }
    }

    loadProfile()
  }, [])

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setProfilePicture(user.profilePicture || '')
      setProfile({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        title: user.title || '',
        location: user.location || '',
        website: user.website || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        socialLinks: {
          github: user.socialLinks?.github || '',
          linkedin: user.socialLinks?.linkedin || '',
          twitter: user.socialLinks?.twitter || '',
          instagram: user.socialLinks?.instagram || '',
          youtube: user.socialLinks?.youtube || ''
        },
        skills: user.skills || []
      })
      setFormData({
        name: user.name || '',
        email: user.email || '',
        bio: user.bio || '',
        title: user.title || '',
        location: user.location || '',
        website: user.website || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        socialLinks: {
          github: user.socialLinks?.github || '',
          linkedin: user.socialLinks?.linkedin || '',
          twitter: user.socialLinks?.twitter || '',
          instagram: user.socialLinks?.instagram || '',
          youtube: user.socialLinks?.youtube || ''
        },
        skills: user.skills || []
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target

    // Handle nested social links
    if (name.startsWith('social_')) {
      const socialNetwork = name.split('_')[1]
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialNetwork]: value
        }
      }))
    } else if (name === 'skills') {
      // Handle skills array (comma-separated values)
      const skillsArray = value.split(',').map(skill => skill.trim()).filter(Boolean)
      setFormData(prev => ({
        ...prev,
        skills: skillsArray
      }))
    } else {
      // Handle regular fields
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  // Handle profile picture upload
  const handleProfilePictureClick = () => {
    fileInputRef.current.click()
  }

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image is too large. Please select an image under 5MB.')
      return
    }

    // Check file type
    if (!file.type.match('image.*')) {
      setError('Please select an image file.')
      return
    }

    // In a real implementation, you would upload the file to a server
    // For now, we'll use a FileReader to get a data URL
    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        // Get original image data URL
        const originalImageUrl = event.target.result

        // Compress the image
        const compressedImageUrl = await compressImage(originalImageUrl, 800, 800, 0.7)

        // Update UI with compressed image
        setProfilePicture(compressedImageUrl)

        // Call API to update profile picture with compressed image
        const response = await uploadProfilePicture(compressedImageUrl)
        console.log('Profile picture update response:', response)
        setSuccess('Profile picture updated successfully')

        // Refresh profile data
        await getProfile()
      } catch (error) {
        console.error('Failed to upload profile picture:', error)
        setError(error.message || 'Failed to upload profile picture')
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      // Call API to update profile
      const response = await updateProfile(formData)
      console.log('Profile update response:', response)

      // Update local state
      setProfile(formData)
      setIsEditing(false)
      setSuccess('Profile updated successfully')

      // Refresh profile data
      await getProfile()
    } catch (error) {
      console.error('Failed to update profile:', error)
      setError(error.message || 'Failed to update profile')
    }
  }

  return (
    <div className="bg-gray-800/80 backdrop-blur-sm p-8 rounded-xl border border-gray-700/50 shadow-xl">
      {/* Header with Profile Picture */}
      <div className="relative mb-16">
        {/* Cover Photo Area - Gradient Background */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-gray-900 via-green-900/30 to-gray-900 rounded-t-xl"></div>

        {/* Profile Picture */}
        <div className="relative z-10 flex flex-col items-center">
          <div
            className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-gray-800 shadow-xl cursor-pointer group transform -translate-y-12 hover:scale-105 transition-all duration-300"
            onClick={handleProfilePictureClick}
          >
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                <FaUser className="text-gray-400 text-4xl" />
              </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
              <FaCamera className="text-white text-2xl" />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
          <p className="text-sm text-gray-400 -mt-8 mb-4">Click to change profile picture</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-green-400">My Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-lg shadow-green-900/30 relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/0 via-green-500/30 to-green-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-shine"></span>
            <span className="relative flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Profile
            </span>
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-5 py-4 rounded-lg mb-6 shadow-lg" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-900/50 border border-green-500 text-green-200 px-5 py-4 rounded-lg mb-6 shadow-lg" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Professional Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g. Full Stack Developer"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="e.g. New York, USA"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Tell us about yourself"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-1">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">Website</label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-300 mb-1">Skills (comma separated)</label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills.join(', ')}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="e.g. JavaScript, React, Node.js"
            />
          </div>

          <div className="border-t border-gray-700 pt-4 mt-4">
            <h3 className="text-lg font-medium text-white mb-3">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="social_github" className="block text-sm font-medium text-gray-300 mb-1">GitHub</label>
                <input
                  type="text"
                  id="social_github"
                  name="social_github"
                  value={formData.socialLinks.github}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="username"
                />
              </div>

              <div>
                <label htmlFor="social_linkedin" className="block text-sm font-medium text-gray-300 mb-1">LinkedIn</label>
                <input
                  type="text"
                  id="social_linkedin"
                  name="social_linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="username"
                />
              </div>

              <div>
                <label htmlFor="social_twitter" className="block text-sm font-medium text-gray-300 mb-1">Twitter</label>
                <input
                  type="text"
                  id="social_twitter"
                  name="social_twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="username"
                />
              </div>

              <div>
                <label htmlFor="social_instagram" className="block text-sm font-medium text-gray-300 mb-1">Instagram</label>
                <input
                  type="text"
                  id="social_instagram"
                  name="social_instagram"
                  value={formData.socialLinks.instagram}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="username"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setFormData(profile)
                setIsEditing(false)
              }}
              className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 relative overflow-hidden group"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/0 via-green-500/30 to-green-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-shine"></span>
              <span className="relative">Save Changes</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-700/50">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Full Name</h3>
              <p className="mt-2 text-xl font-semibold text-white">{profile.name}</p>
            </div>

            <div className="bg-gray-900/50 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-700/50">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Email</h3>
              <p className="mt-2 text-xl font-semibold text-white">{profile.email}</p>
            </div>
          </div>

          {/* Professional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-700/50">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Professional Title</h3>
              <p className="mt-2 text-lg text-white">{profile.title ||
                <span className="text-gray-500 italic">Not specified</span>}
              </p>
            </div>

            <div className="bg-gray-900/50 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-700/50">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Location</h3>
              <p className="mt-2 text-lg text-white flex items-center">
                {profile.location ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    {profile.location}
                  </>
                ) : (
                  <span className="text-gray-500 italic">Not specified</span>
                )}
              </p>
            </div>
          </div>

          {/* Bio */}
          <div className="bg-gray-900/50 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-700/50">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Bio</h3>
            <p className="mt-2 text-gray-300 leading-relaxed">
              {profile.bio || <span className="text-gray-500 italic">No bio provided</span>}
            </p>
          </div>

          {/* Date of Birth & Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-900/50 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-700/50">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Date of Birth</h3>
              <p className="mt-2 text-lg text-white">
                {profile.dateOfBirth ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500 inline" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {new Date(profile.dateOfBirth).toLocaleDateString()}
                  </>
                ) : (
                  <span className="text-gray-500 italic">Not specified</span>
                )}
              </p>
            </div>

            <div className="bg-gray-900/50 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-700/50">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Website</h3>
              <p className="mt-2 text-lg">
                {profile.website ? (
                  <a
                    href={profile.website}
                    className="text-green-400 hover:text-green-300 flex items-center group"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                    <span className="group-hover:underline truncate">{profile.website}</span>
                  </a>
                ) : (
                  <span className="text-gray-500 italic">Not specified</span>
                )}
              </p>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-gray-900/50 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-700/50">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-700 text-green-400 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 border border-gray-700"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">No skills listed</p>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-gray-900/50 p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center">
                <div className="bg-gray-800 p-3 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">GitHub</h4>
                  {profile.socialLinks?.github ? (
                    <a
                      href={`https://github.com/${profile.socialLinks.github}`}
                      className="text-green-400 hover:text-green-300 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{profile.socialLinks.github}
                    </a>
                  ) : (
                    <span className="text-gray-500 italic">Not specified</span>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-gray-800 p-3 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">LinkedIn</h4>
                  {profile.socialLinks?.linkedin ? (
                    <a
                      href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`}
                      className="text-green-400 hover:text-green-300 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{profile.socialLinks.linkedin}
                    </a>
                  ) : (
                    <span className="text-gray-500 italic">Not specified</span>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-gray-800 p-3 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Twitter</h4>
                  {profile.socialLinks?.twitter ? (
                    <a
                      href={`https://twitter.com/${profile.socialLinks.twitter}`}
                      className="text-green-400 hover:text-green-300 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{profile.socialLinks.twitter}
                    </a>
                  ) : (
                    <span className="text-gray-500 italic">Not specified</span>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-gray-800 p-3 rounded-lg mr-3">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-400">Instagram</h4>
                  {profile.socialLinks?.instagram ? (
                    <a
                      href={`https://instagram.com/${profile.socialLinks.instagram}`}
                      className="text-green-400 hover:text-green-300 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      @{profile.socialLinks.instagram}
                    </a>
                  ) : (
                    <span className="text-gray-500 italic">Not specified</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile