import React from 'react'
import { Outlet } from 'react-router-dom'

const OuterLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Outlet />
    </div>
  )
}

export default OuterLayout