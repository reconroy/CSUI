import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Navbar = ({
  onTogglePrimaryPanel,
  isPrimaryPanelCollapsed,
  onToggleSecondaryPanel,
  isSecondaryPanelCollapsed,
  showPrimaryToggle = true,
  showSecondaryToggle = false
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const profileDropdownRef = useRef(null)
  const notificationsRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Sample notifications data
  const [notifications] = useState([
    { id: 1, type: 'info', message: 'New collaborator joined your project', time: '2 min ago', read: false },
    { id: 2, type: 'success', message: 'Project successfully deployed', time: '1 hour ago', read: false },
    { id: 3, type: 'warning', message: 'Storage limit approaching', time: '3 hours ago', read: true },
    { id: 4, type: 'info', message: 'Weekly backup completed', time: '1 day ago', read: true },
  ])

  // Handle click outside of dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/', { replace: true })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Implement search functionality here
      console.log('Searching for:', searchQuery)
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        )
      case 'warning':
        return (
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
        )
      case 'error':
        return (
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
        )
      default:
        return (
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        )
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <nav className="bg-gray-800/90 backdrop-blur-sm border-b border-gray-700/50 px-4 py-3 relative z-50">
      <div className="flex items-center justify-between">
        {/* Left section - Sidebar toggle, Logo and breadcrumb */}
        <div className="flex items-center space-x-4">
          {/* Primary Panel toggle button */}
          {showPrimaryToggle && (
            <button
              onClick={onTogglePrimaryPanel}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              title={isPrimaryPanelCollapsed ? 'Show codespaces panel' : 'Hide codespaces panel'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          <Link to="/dashboard" className="flex items-center">
            <div className="bg-green-500 w-8 h-8 rounded-lg mr-3 flex items-center justify-center shadow-lg shadow-green-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-white">CodeSpace</h1>
          </Link>

          {/* Breadcrumb */}
          <div className="hidden md:flex items-center text-gray-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="capitalize">
              {location.pathname === '/dashboard' ? 'Dashboard' : location.pathname.slice(1)}
            </span>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search codespaces, files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </form>
        </div>

        {/* Right section - Actions and Profile */}
        <div className="flex items-center space-x-4">
          {/* Secondary Panel toggle button */}
          {showSecondaryToggle && (
            <button
              onClick={onToggleSecondaryPanel}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              title={isSecondaryPanelCollapsed ? 'Show secondary panel' : 'Hide secondary panel'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </button>
          )}

          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v2.25l2.25 2.25v2.25H2.25v-2.25L4.5 12V9.75a6 6 0 0 1 6-6z" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-2 z-dropdown">
                <div className="px-4 py-2 border-b border-gray-700">
                  <h3 className="text-white font-medium">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div key={notification.id} className={`px-4 py-3 hover:bg-gray-700/50 ${!notification.read ? 'bg-gray-700/20' : ''}`}>
                      <div className="flex items-start space-x-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-700">
                  <button className="text-green-400 hover:text-green-300 text-sm">
                    Mark all as read
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Help */}
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          {/* Profile dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700/50 transition-colors focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-gray-900 font-medium">
                U
              </div>
              <span className="hidden md:block text-white text-sm font-medium">User</span>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg py-1 z-dropdown">
                <Link to="/profile" className="block px-4 py-2 text-white hover:bg-gray-700 hover:text-green-400">
                  Profile
                </Link>
                <Link to="/settings" className="block px-4 py-2 text-white hover:bg-gray-700 hover:text-green-400">
                  Settings
                </Link>
                <Link to="/change-password" className="block px-4 py-2 text-white hover:bg-gray-700 hover:text-green-400">
                  Change Password
                </Link>
                <div className="border-t border-gray-700 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 hover:text-red-300"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden mt-3">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search codespaces, files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </form>
      </div>
    </nav>
  )
}

export default Navbar