import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'

const InnerLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">CodeSpace</h1>
        </div>

        <nav className="space-y-2">
          <Link to="/dashboard" className="block py-2 px-4 rounded hover:bg-gray-700">
            Dashboard
          </Link>
          <Link to="/profile" className="block py-2 px-4 rounded hover:bg-gray-700">
            Profile
          </Link>
          <Link to="/settings" className="block py-2 px-4 rounded hover:bg-gray-700">
            Settings
          </Link>
          <Link to="/change-password" className="block py-2 px-4 rounded hover:bg-gray-700">
            Change Password
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left py-2 px-4 rounded hover:bg-gray-700 text-red-400"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-grow p-8">
        <Outlet />
      </main>
    </div>
  )
}

export default InnerLayout