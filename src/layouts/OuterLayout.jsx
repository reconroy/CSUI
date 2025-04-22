import React from 'react'
import { Outlet } from 'react-router-dom'

const OuterLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Outlet />
    </div>
  )
}

export default OuterLayout