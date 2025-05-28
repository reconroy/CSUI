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
    <div className="h-full">
      <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 shadow-lg mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Code Editor</h1>
        <p className="text-gray-300">Welcome to your coding workspace!</p>
      </div>

      <div className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg border border-gray-700/50 shadow-lg">
        <div className="flex justify-between mb-6">
          <div>
            <select className="px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500">
              <option>JavaScript</option>
              <option>Python</option>
              <option>Java</option>
              <option>C++</option>
              <option>HTML</option>
              <option>CSS</option>
            </select>
          </div>
          <div>
            <button className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 relative overflow-hidden group">
              <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-500/0 via-green-500/30 to-green-500/0 opacity-0 group-hover:opacity-100 group-hover:animate-shine"></span>
              <span className="relative">Run Code</span>
            </button>
          </div>
        </div>

        <div className="border border-gray-600 rounded-md overflow-hidden">
          <div className="bg-gray-700 px-4 py-2 border-b border-gray-600 flex justify-between items-center">
            <span className="font-medium text-white">main.js</span>
            <div>
              <button className="text-green-400 hover:text-green-300 mr-3">
                <span className="sr-only">Save</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h1v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
              </button>
              <button className="text-green-400 hover:text-green-300">
                <span className="sr-only">Settings</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <textarea
            className="w-full h-64 p-4 font-mono text-sm bg-gray-800 text-gray-200 focus:outline-none focus:ring-1 focus:ring-green-500"
            placeholder="// Write your code here"
            defaultValue={`// Welcome to CodeSpace Editor

function greet(name) {
  return 'Hello, ' + name + '!';
}

console.log(greet('World'));
`}
          ></textarea>
        </div>

        <div className="mt-6">
          <h3 className="font-medium text-gray-300 mb-2">Output</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm h-32 overflow-y-auto border border-gray-700">
            <p>Hello, World!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeEditor