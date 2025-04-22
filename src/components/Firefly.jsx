import React, { useEffect, useState } from 'react'
import '../styles/firefly.css'

const Firefly = ({
  // CONTROLLING NUMBER OF FIREFLIES:
  // Increase or decrease this value to show more or fewer fireflies
  // Higher values may impact performance on slower devices
  // Recommended range: 10-100
  count = 100,

  // Appearance settings
  color = 'rgba(74, 222, 128, 0.8)', // Default green color
  glowColor = 'rgba(74, 222, 128, 0.5)', // Default glow color

  // CONTROLLING SIZE OF FIREFLIES:
  // Set the minimum and maximum size in pixels
  // Smaller values (0.5-2) create a more subtle effect
  // Larger values (3-5) create more prominent fireflies
  minSize = 1,  // Minimum size in pixels
  maxSize = 3,  // Maximum size in pixels

  // CONTROLLING SPEED OF FIREFLIES:
  // The duration controls how long each animation cycle takes
  // Shorter durations = faster movement
  // Longer durations = slower, more gentle movement
  // Recommended ranges:
  // - Fast: 5-10 seconds
  // - Medium: 10-20 seconds
  // - Slow: 20-40 seconds
  minDuration = 10, // Minimum animation duration in seconds
  maxDuration = 20, // Maximum animation duration in seconds

  // Position settings
  topOffset = 0, // Percentage from top to start appearing
  concentrateTop = true // Whether to concentrate more fireflies at the top
}) => {
  const [fireflies, setFireflies] = useState([])

  useEffect(() => {
    // Generate random fireflies
    const newFireflies = Array.from({ length: count }, (_, index) => {
      // If concentrateTop is true, make more fireflies appear at the top
      const topPosition = concentrateTop
        ? Math.pow(Math.random(), 2) * (100 - topOffset) + topOffset // More at the top
        : Math.random() * (100 - topOffset) + topOffset;

      return {
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${topPosition}%`,
        size: Math.random() * (maxSize - minSize) + minSize,
        animationDuration: `${Math.random() * (maxDuration - minDuration) + minDuration}s`,
        animationDelay: `${Math.random() * 10}s`,
        color,
        glowColor
      }
    })

    setFireflies(newFireflies)
  }, [count, color, glowColor, minSize, maxSize, minDuration, maxDuration, topOffset, concentrateTop])

  return (
    <div className="firefly-container">
      {fireflies.map((fly) => (
        <div
          key={fly.id}
          className="firefly"
          style={{
            left: fly.left,
            top: fly.top,
            width: `${fly.size}px`,
            height: `${fly.size}px`,
            backgroundColor: fly.color,
            boxShadow: `0 0 5px 1px ${fly.glowColor}`,
            animationDuration: fly.animationDuration,
            animationDelay: fly.animationDelay,
          }}
        />
      ))}
    </div>
  )
}

export default Firefly
