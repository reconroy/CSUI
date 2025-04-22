import React from 'react'

const CodeEditor = () => {
  return (
    <div className="h-full">
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Code Editor</h1>
        <p className="text-gray-600">Welcome to your coding workspace!</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between mb-4">
          <div>
            <select className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option>JavaScript</option>
              <option>Python</option>
              <option>Java</option>
              <option>C++</option>
              <option>HTML</option>
              <option>CSS</option>
            </select>
          </div>
          <div>
            <button className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Run Code
            </button>
          </div>
        </div>

        <div className="border border-gray-300 rounded-md overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex justify-between items-center">
            <span className="font-medium">main.js</span>
            <div>
              <button className="text-gray-600 hover:text-gray-800 mr-2">
                <span className="sr-only">Save</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h1v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <span className="sr-only">Settings</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <textarea
            className="w-full h-64 p-4 font-mono text-sm focus:outline-none"
            placeholder="// Write your code here"
            defaultValue={`// Welcome to CodeSpace Editor

function greet(name) {
  return 'Hello, ' + name + '!';
}

console.log(greet('World'));
`}
          ></textarea>
        </div>

        <div className="mt-4">
          <h3 className="font-medium text-gray-700 mb-2">Output</h3>
          <div className="bg-gray-800 text-white p-4 rounded-md font-mono text-sm h-32 overflow-y-auto">
            <p>Hello, World!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CodeEditor