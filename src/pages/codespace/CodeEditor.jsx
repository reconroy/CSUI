import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const CodeEditor = () => {
  const navigate = useNavigate();

  // Prevent back navigation to login/auth pages
  useEffect(() => {
    // Push current state to history to prevent going back to login
    window.history.pushState(null, '', window.location.pathname);

    // Add event listener for popstate (back/forward button)
    const preventBackNavigation = () => {
      window.history.pushState(null, '', window.location.pathname);
    };

    window.addEventListener('popstate', preventBackNavigation);

    // Cleanup function
    return () => {
      window.removeEventListener('popstate', preventBackNavigation);
    };
  }, []);
  return (
    <div className="h-full p-1">
      Here will be the monaco code editor.
    </div>
  )
}

export default CodeEditor