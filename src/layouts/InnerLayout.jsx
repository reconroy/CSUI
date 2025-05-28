import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import PrimaryPanel from '../components/PrimaryPanel';

const InnerLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-900 flex relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[10%] bg-gradient-to-tr from-green-500/5 via-green-300/10 to-transparent rotate-12 transform-gpu blur-3xl"></div>
        <div className="absolute -inset-[5%] top-[30%] bg-gradient-to-bl from-green-500/5 via-green-400/5 to-transparent -rotate-12 transform-gpu blur-2xl"></div>
      </div>

      {/* Sidebar */}
      <PrimaryPanel handleLogout={handleLogout} />

      {/* Main content */}
      <main className="flex-grow p-8 bg-gray-900/80 backdrop-blur-sm text-white relative z-10">
        <Outlet />
      </main>
    </div>
  )
}

export default InnerLayout