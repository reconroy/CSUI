import React, { useEffect, useState, useRef } from 'react'
import '../styles/firefly.css'

/**
 * Firefly Component
 *
 * Creates an animated firefly effect with mouse interaction.
 * Fireflies will move away from the mouse cursor when it gets close to them.
 *
 * Features:
 * - Customizable number, size, color, and speed of fireflies
 * - Mouse repulsion effect (fireflies move away from cursor)
 * - Automatic return to original positions when mouse moves away
 * - Multiple animation patterns for natural movement
 * - Optimized for performance with minimal impact
 */
const Firefly = ({
  // CONTROLLING NUMBER OF FIREFLIES:
  // Increase or decrease this value to show more or fewer fireflies
  // Higher values may impact performance on slower devices
  // Recommended range: 10-100
  count = 50,

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
  minDuration = 5, // Minimum animation duration in seconds
  maxDuration = 10, // Maximum animation duration in seconds

  // Position settings
  topOffset = 0, // Percentage from top to start appearing
  concentrateTop = true, // Whether to concentrate more fireflies at the top

  // Mouse interaction settings
  mouseRepelRadius = 100, // How far from the mouse cursor fireflies will react (in pixels)
  mouseRepelStrength = 0.5 // How strongly fireflies move away (0-1, higher = stronger)
}) => {
  const [fireflies, setFireflies] = useState([])
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 }) // Start off-screen
  const containerRef = useRef(null)

  // Track mouse position for repulsion effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    // Add mouse move listener
    window.addEventListener('mousemove', handleMouseMove);

    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Generate fireflies
  useEffect(() => {
    // Generate random fireflies
    const generateFireflies = () => {
      console.log(`Generating ${count} fireflies`); // Debug log
      // Create an array with the specified count
      return Array.from({ length: count }, (_, index) => {
        // Distribute fireflies more evenly across the screen
        // If concentrateTop is true, make more fireflies appear at the top
        const topPosition = concentrateTop
          ? Math.pow(Math.random(), 2) * (100 - topOffset) + topOffset // More at the top
          : Math.random() * (100 - topOffset) + topOffset;

        // Ensure fireflies are spread across the width of the screen
        // Use a more distributed approach for left position
        const leftPosition = Math.random() * 100;

        // Vary the size more dramatically for visual interest
        const size = Math.random() * (maxSize - minSize) + minSize;

        // Vary the animation duration and delay for more natural movement
        const duration = Math.random() * (maxDuration - minDuration) + minDuration;
        const delay = Math.random() * 15; // Increased delay range for more variety

        return {
          id: index,
          // Store both percentage and pixel values for calculations
          leftPercent: leftPosition,
          topPercent: topPosition,
          // Initial positions in pixels (will be calculated properly after render)
          leftPx: 0,
          topPx: 0,
          // Original positions (for returning after mouse moves away)
          originalLeftPx: 0,
          originalTopPx: 0,
          // Visual properties
          size: size,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          color,
          glowColor,
          // For mouse repulsion
          repelling: false
        }
      });
    };

    // Set the fireflies
    setFireflies(generateFireflies());

    // Clean up function not needed as we're just updating state
  }, [count, color, glowColor, minSize, maxSize, minDuration, maxDuration, topOffset, concentrateTop])

  // Calculate pixel positions after container is mounted
  useEffect(() => {
    if (containerRef.current && fireflies.length > 0) {
      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;

      // Update fireflies with pixel positions
      const updatedFireflies = fireflies.map(fly => {
        const leftPx = (fly.leftPercent / 100) * containerWidth;
        const topPx = (fly.topPercent / 100) * containerHeight;

        return {
          ...fly,
          leftPx,
          topPx,
          originalLeftPx: leftPx,
          originalTopPx: topPx
        };
      });

      setFireflies(updatedFireflies);
    }
  }, [fireflies.length, containerRef.current]);

  // Handle mouse repulsion effect
  useEffect(() => {
    if (!containerRef.current || fireflies.length === 0) return;

    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    // Calculate new positions based on mouse proximity
    const updatedFireflies = fireflies.map(fly => {
      // Skip if we don't have pixel positions yet
      if (fly.leftPx === undefined) return fly;

      // Calculate distance from mouse to firefly
      const dx = fly.leftPx - mousePosition.x;
      const dy = fly.topPx - mousePosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // If mouse is close enough, repel the firefly
      if (distance < mouseRepelRadius) {
        // Calculate repulsion force (stronger when closer)
        const force = (1 - distance / mouseRepelRadius) * mouseRepelStrength;

        // Calculate new position
        let newLeftPx = fly.leftPx + (dx / distance) * force * 50;
        let newTopPx = fly.topPx + (dy / distance) * force * 50;

        // Keep fireflies within container bounds
        newLeftPx = Math.max(0, Math.min(containerWidth, newLeftPx));
        newTopPx = Math.max(0, Math.min(containerHeight, newTopPx));

        // Convert back to percentages for CSS
        const newLeftPercent = (newLeftPx / containerWidth) * 100;
        const newTopPercent = (newTopPx / containerHeight) * 100;

        return {
          ...fly,
          leftPx: newLeftPx,
          topPx: newTopPx,
          leftPercent: newLeftPercent,
          topPercent: newTopPercent,
          repelling: true
        };
      } else if (fly.repelling) {
        // If mouse is far enough and firefly was repelling, gradually return to original position
        const returnSpeed = 0.1; // How quickly fireflies return (0-1)

        // Move back toward original position
        const newLeftPx = fly.leftPx + (fly.originalLeftPx - fly.leftPx) * returnSpeed;
        const newTopPx = fly.topPx + (fly.originalTopPx - fly.topPx) * returnSpeed;

        // Convert back to percentages
        const newLeftPercent = (newLeftPx / containerWidth) * 100;
        const newTopPercent = (newTopPx / containerHeight) * 100;

        // If close enough to original position, stop repelling
        const returnedToOriginal =
          Math.abs(newLeftPx - fly.originalLeftPx) < 1 &&
          Math.abs(newTopPx - fly.originalTopPx) < 1;

        return {
          ...fly,
          leftPx: newLeftPx,
          topPx: newTopPx,
          leftPercent: newLeftPercent,
          topPercent: newTopPercent,
          repelling: !returnedToOriginal
        };
      }

      return fly;
    });

    setFireflies(updatedFireflies);
  }, [mousePosition, mouseRepelRadius, mouseRepelStrength]);

  return (
    <div className="firefly-container" ref={containerRef}>
      {fireflies.map((fly) => (
        <div
          key={fly.id}
          className={`firefly ${fly.repelling ? 'repelling' : ''}`}
          style={{
            left: `${fly.leftPercent}%`,
            top: `${fly.topPercent}%`,
            width: `${fly.size}px`,
            height: `${fly.size}px`,
            backgroundColor: fly.color,
            boxShadow: `0 0 5px 1px ${fly.glowColor}`,
            // Only use animation when not being repelled by mouse
            animationName: fly.repelling ? 'none' : undefined,
            animationDuration: fly.animationDuration,
            animationDelay: fly.animationDelay,
            // Add transition for smooth movement when repelled
            transition: fly.repelling ? 'left 0.1s ease-out, top 0.1s ease-out' : 'none',
          }}
        />
      ))}
    </div>
  )
}

export default Firefly
