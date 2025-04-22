import React, { useState } from 'react'

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Software developer with a passion for coding.',
    location: 'New York, USA',
    website: 'https://example.com',
    github: 'johndoe',
    twitter: 'johndoe'
  })

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState(profile)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setProfile(formData)
    setIsEditing(false)
  }

  return (
    <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 shadow-lg">
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

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">Bio</label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            ></textarea>
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
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="github" className="block text-sm font-medium text-gray-300 mb-1">GitHub</label>
              <input
                type="text"
                id="github"
                name="github"
                value={formData.github}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="flex-1">
              <label htmlFor="twitter" className="block text-sm font-medium text-gray-300 mb-1">Twitter</label>
              <input
                type="text"
                id="twitter"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
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

          <div>
            <h3 className="text-sm font-medium text-gray-400">Bio</h3>
            <p className="mt-1 text-gray-300">{profile.bio}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Location</h3>
              <p className="mt-1 text-gray-300">{profile.location}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400">Website</h3>
              <p className="mt-1 text-gray-300">
                <a href={profile.website} className="text-green-400 hover:text-green-300" target="_blank" rel="noopener noreferrer">
                  {profile.website}
                </a>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-400">GitHub</h3>
              <p className="mt-1 text-gray-300">
                <a href={`https://github.com/${profile.github}`} className="text-green-400 hover:text-green-300" target="_blank" rel="noopener noreferrer">
                  @{profile.github}
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400">Twitter</h3>
              <p className="mt-1 text-gray-300">
                <a href={`https://twitter.com/${profile.twitter}`} className="text-green-400 hover:text-green-300" target="_blank" rel="noopener noreferrer">
                  @{profile.twitter}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile