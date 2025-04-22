import React from 'react'
import { Outlet } from 'react-router-dom'

const OuterLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Diagonal shine light effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10%] bg-gradient-to-tr from-green-500/5 via-gree-300/10 to-transparent rotate-12 transform-gpu blur-3xl"></div>
        <div className="absolute -inset-[5%] top-[30%] bg-gradient-to-bl from-green-500/5 via-gree-400/5 to-transparent -rotate-12 transform-gpu blur-2xl"></div>
      </div>
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10%] bg-gradient-to-tr from-green-500/5 via-green-300/10 to-transparent rotate-12 transform-gpu blur-3xl"></div>
        <div className="absolute -inset-[5%] top-[30%] bg-gradient-to-bl from-green-500/5 via-green-400/5 to-transparent -rotate-12 transform-gpu blur-2xl"></div>
      </div> */}

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex justify-center">
        <Outlet />
      </div>
    </div>
  )
}

export default OuterLayout