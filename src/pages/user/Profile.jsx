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
    <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 shadow-lg">
      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 mb-2 cursor-pointer group"
          onClick={handleProfilePictureClick}
        >
          {profilePicture ? (
            <img
              src={profilePicture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <FaUser className="text-gray-400 text-4xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
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
        <p className="text-sm text-gray-400">Click to change profile picture</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Profile</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/0 via-green-500/30 to-green-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-shine"></span>
            <span className="relative">Edit Profile</span>
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-4" role="alert">
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
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Full Name</h3>
              <p className="mt-1 text-lg text-white">{profile.name}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400">Email</h3>
              <p className="mt-1 text-lg text-white">{profile.email}</p>
            </div>
          </div>

          {/* Professional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Professional Title</h3>
              <p className="mt-1 text-gray-300">{profile.title || 'Not specified'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400">Location</h3>
              <p className="mt-1 text-gray-300">{profile.location || 'Not specified'}</p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h3 className="text-sm font-medium text-gray-400">Bio</h3>
            <p className="mt-1 text-gray-300">{profile.bio || 'No bio provided'}</p>
          </div>

          {/* Date of Birth & Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Date of Birth</h3>
              <p className="mt-1 text-gray-300">
                {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not specified'}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400">Website</h3>
              <p className="mt-1 text-gray-300">
                {profile.website ? (
                  <a href={profile.website} className="text-green-400 hover:text-green-300" target="_blank" rel="noopener noreferrer">
                    {profile.website}
                  </a>
                ) : 'Not specified'}
              </p>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-sm font-medium text-gray-400">Skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {profile.skills && profile.skills.length > 0 ? (
                profile.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-700 text-green-400 rounded-full text-sm">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-300">No skills listed</p>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-medium text-white mb-3">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400">GitHub</h3>
                <p className="mt-1 text-gray-300">
                  {profile.socialLinks?.github ? (
                    <a href={`https://github.com/${profile.socialLinks.github}`} className="text-green-400 hover:text-green-300" target="_blank" rel="noopener noreferrer">
                      @{profile.socialLinks.github}
                    </a>
                  ) : 'Not specified'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400">LinkedIn</h3>
                <p className="mt-1 text-gray-300">
                  {profile.socialLinks?.linkedin ? (
                    <a href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`} className="text-green-400 hover:text-green-300" target="_blank" rel="noopener noreferrer">
                      @{profile.socialLinks.linkedin}
                    </a>
                  ) : 'Not specified'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400">Twitter</h3>
                <p className="mt-1 text-gray-300">
                  {profile.socialLinks?.twitter ? (
                    <a href={`https://twitter.com/${profile.socialLinks.twitter}`} className="text-green-400 hover:text-green-300" target="_blank" rel="noopener noreferrer">
                      @{profile.socialLinks.twitter}
                    </a>
                  ) : 'Not specified'}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400">Instagram</h3>
                <p className="mt-1 text-gray-300">
                  {profile.socialLinks?.instagram ? (
                    <a href={`https://instagram.com/${profile.socialLinks.instagram}`} className="text-green-400 hover:text-green-300" target="_blank" rel="noopener noreferrer">
                      @{profile.socialLinks.instagram}
                    </a>
                  ) : 'Not specified'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile