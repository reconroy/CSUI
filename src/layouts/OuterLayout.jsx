import React from 'react'
import { Outlet } from 'react-router-dom'
import Firefly from '../components/Firefly'

const OuterLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Diagonal shine light effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[10%] bg-gradient-to-tr from-green-500/5 via-gree-300/10 to-transparent rotate-12 transform-gpu blur-3xl"></div>
        <div className="absolute -inset-[5%] top-[30%] bg-gradient-to-bl from-green-500/5 via-gree-400/5 to-transparent -rotate-12 transform-gpu blur-2xl"></div>
      </div>

      {/* Firefly animation */}
      <Firefly
        // NUMBER: 40 fireflies - Moderate amount for visual effect without performance impact
        count={40}

        // COLORS: Green to match the application theme
        color="rgba(74, 222, 128, 0.8)"  // Main firefly color (green)
        glowColor="rgba(74, 222, 128, 0.5)"  // Glow effect color (softer green)

        // SIZE: Medium-sized fireflies (1.5px to 3.5px)
        // - Increase these values for larger, more prominent fireflies
        // - Decrease for smaller, more subtle effect
        minSize={1.5}  // Minimum size in pixels
        maxSize={3.5}  // Maximum size in pixels

        // SPEED: Medium-slow movement (15-30 seconds per animation cycle)
        // - Lower numbers = faster movement
        // - Higher numbers = slower, more gentle floating
        minDuration={15}  // Fastest firefly completes cycle in 15 seconds
        maxDuration={30}  // Slowest firefly completes cycle in 30 seconds

        // POSITION: Slightly offset from the top (5%) with concentration at the top
        topOffset={5}  // Start 5% from the top of the screen
        concentrateTop={true}  // More fireflies appear near the top than bottom
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex justify-center">
        <Outlet />
      </div>
    </div>
  )
}

export default OuterLayout