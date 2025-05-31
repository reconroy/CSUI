import React, { useState, useRef, useEffect } from 'react'

const Terminal = ({ 
  output = '', 
  error = '', 
  isRunning = false, 
  executionTime = null, 
  memoryUsage = null,
  onClear,
  onClose,
  language = 'javascript'
}) => {
  const [input, setInput] = useState('')
  const terminalRef = useRef(null)

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output, error])

  const handleInputSubmit = (e) => {
    e.preventDefault()
    // This could be used for interactive input in the future
    console.log('Terminal input:', input)
    setInput('')
  }

  const getLanguageIcon = (lang) => {
    const icons = {
      javascript: '🟨',
      python: '🐍',
      java: '☕',
      cpp: '⚡',
      c: '🔧',
      csharp: '🔷',
      php: '🐘',
      ruby: '💎',
      go: '🐹',
      rust: '🦀',
      kotlin: '🎯',
      swift: '🍎',
      typescript: '🔷',
      sql: '🗄️',
      bash: '💻',
      r: '📊',
      scala: '⚖️',
      perl: '🐪',
      lua: '🌙',
      dart: '🎯'
    }
    return icons[lang] || '📄'
  }

  const formatOutput = () => {
    if (isRunning) {
      return (
        <div className="flex items-center space-x-2 text-yellow-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
          <span>Executing code...</span>
        </div>
      )
    }

    if (!output && !error) {
      return (
        <div className="text-gray-400 italic">
          Ready to run {language} code... Click "Run Code" to execute.
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {/* Execution Info */}
        {(executionTime || memoryUsage) && (
          <div className="text-xs text-gray-400 border-b border-gray-700 pb-2 mb-2">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <span>⏱️</span>
                <span>Time: {executionTime || 'N/A'}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>💾</span>
                <span>Memory: {memoryUsage || 'N/A'}</span>
              </span>
            </div>
          </div>
        )}

        {/* Output */}
        {output && (
          <div>
            <div className="text-green-400 text-xs font-semibold mb-1 flex items-center space-x-1">
              <span>✅</span>
              <span>OUTPUT:</span>
            </div>
            <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap bg-gray-800/50 p-2 rounded border-l-2 border-green-500">
              {output}
            </pre>
          </div>
        )}

        {/* Error */}
        {error && (
          <div>
            <div className="text-red-400 text-xs font-semibold mb-1 flex items-center space-x-1">
              <span>❌</span>
              <span>ERROR:</span>
            </div>
            <pre className="text-red-400 font-mono text-sm whitespace-pre-wrap bg-gray-800/50 p-2 rounded border-l-2 border-red-500">
              {error}
            </pre>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm border-t border-gray-700/50 flex flex-col h-full">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 border-b border-gray-700/50">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{getLanguageIcon(language)}</span>
          <span className="text-white font-medium text-sm">Terminal</span>
          <span className="text-gray-400 text-xs">({language})</span>
        </div>
        <div className="flex items-center space-x-2">
          {onClear && (
            <button
              onClick={onClear}
              className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-gray-700/50 transition-colors"
              title="Clear terminal"
            >
              Clear
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded hover:bg-gray-700/50 transition-colors"
              title="Close terminal"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-auto min-h-0 custom-scrollbar bg-gray-900/50"
      >
        {formatOutput()}
      </div>

      {/* Terminal Input (for future interactive features) */}
      <div className="px-4 py-2 bg-gray-800/30 border-t border-gray-700/50">
        <form onSubmit={handleInputSubmit} className="flex items-center space-x-2">
          <span className="text-green-400 font-mono text-sm">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Terminal input (coming soon...)"
            className="flex-1 bg-transparent text-white font-mono text-sm focus:outline-none placeholder-gray-500"
            disabled // Disabled for now, can be enabled for interactive features
          />
        </form>
      </div>
    </div>
  )
}

export default Terminal
