import React from 'react'

const Terminal = (
    {setOutput,setShowTerminal,output}
) => {
  return (
    <div className="h-64 bg-gray-900 border-t border-gray-700/50 flex flex-col flex-shrink-0">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 border-b border-gray-700/50 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-400 ml-2">Terminal</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setOutput('')}
                  className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-gray-700/50 transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => setShowTerminal(false)}
                  className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-gray-700/50 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-auto min-h-0 custom-scrollbar">
              <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                {output || 'Ready to run code...'}
              </pre>
            </div>
          </div>
  )
}

export default Terminal