import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const PrimaryPanel = ({ isCollapsed, onToggleCollapse }) => {
  const [activeTab, setActiveTab] = useState('my-codespaces')

  // Sample codespace data
  const [myCodespaces] = useState([
    {
      id: 1,
      name: 'React Portfolio',
      language: 'javascript',
      lastModified: '2 hours ago',
      isPublic: false,
      collaborators: 1
    },
    {
      id: 2,
      name: 'Python API',
      language: 'python',
      lastModified: '1 day ago',
      isPublic: true,
      collaborators: 3
    },
    {
      id: 3,
      name: 'Vue Dashboard',
      language: 'javascript',
      lastModified: '3 days ago',
      isPublic: false,
      collaborators: 0
    },
  ])

  const [sharedCodespaces] = useState([
    {
      id: 4,
      name: 'Team Project',
      language: 'typescript',
      lastModified: '5 hours ago',
      owner: 'John Doe',
      role: 'Editor'
    },
    {
      id: 5,
      name: 'Open Source Lib',
      language: 'javascript',
      lastModified: '2 days ago',
      owner: 'Jane Smith',
      role: 'Contributor'
    },
  ])

  const getLanguageIcon = (language) => {
    switch (language) {
      case 'javascript':
        return '🟨'
      case 'typescript':
        return '🔷'
      case 'python':
        return '🐍'
      case 'html':
        return '🌐'
      case 'css':
        return '🎨'
      default:
        return '📄'
    }
  }

  const getLanguageColor = (language) => {
    switch (language) {
      case 'javascript':
        return 'text-yellow-400'
      case 'typescript':
        return 'text-blue-400'
      case 'python':
        return 'text-green-400'
      case 'html':
        return 'text-orange-400'
      case 'css':
        return 'text-purple-400'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <aside className={`bg-gray-800/80 backdrop-blur-sm border-r border-gray-700/50 text-white transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-80'
      } flex flex-col relative z-10`}>

      {/* Header */}
      {/* <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="bg-green-500 w-8 h-8 rounded-lg mr-3 flex items-center justify-center shadow-lg shadow-green-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h1 className="text-lg font-bold">Codespaces</h1>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div> */}

      {/* Content */}
      {!isCollapsed && (
        <>
          {/* Quick Actions */}
          <div className="p-4 border-b border-gray-700/50">
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Codespace
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-700/50">
            <div className="flex">
              <button
                onClick={() => setActiveTab('my-codespaces')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'my-codespaces'
                    ? 'text-green-400 border-b-2 border-green-400 bg-gray-700/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/20'
                  }`}
              >
                My Codespaces
              </button>
              <button
                onClick={() => setActiveTab('shared')}
                className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${activeTab === 'shared'
                    ? 'text-green-400 border-b-2 border-green-400 bg-gray-700/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/20'
                  }`}
              >
                Shared
              </button>
            </div>
          </div>

          {/* Codespace Lists */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'my-codespaces' && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-300">My Codespaces ({myCodespaces.length})</h3>
                  <button className="text-gray-400 hover:text-green-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2">
                  {myCodespaces.map((codespace) => (
                    <Link
                      key={codespace.id}
                      to={`/codespace/${codespace.id}`}
                      className="block p-3 rounded-lg hover:bg-gray-700/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <span className="text-2xl">{getLanguageIcon(codespace.language)}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white truncate group-hover:text-green-400">
                              {codespace.name}
                            </h4>
                            <p className={`text-xs ${getLanguageColor(codespace.language)} capitalize`}>
                              {codespace.language}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {codespace.lastModified}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <div className="flex items-center space-x-1">
                            {codespace.isPublic ? (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            )}
                            {codespace.collaborators > 0 && (
                              <span className="text-xs text-gray-400">+{codespace.collaborators}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shared' && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-gray-300">Shared with me ({sharedCodespaces.length})</h3>
                </div>

                <div className="space-y-2">
                  {sharedCodespaces.map((codespace) => (
                    <Link
                      key={codespace.id}
                      to={`/codespace/${codespace.id}`}
                      className="block p-3 rounded-lg hover:bg-gray-700/50 transition-colors group"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{getLanguageIcon(codespace.language)}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white truncate group-hover:text-green-400">
                            {codespace.name}
                          </h4>
                          <p className="text-xs text-gray-400">
                            by {codespace.owner} • {codespace.role}
                          </p>
                          <p className={`text-xs ${getLanguageColor(codespace.language)} capitalize`}>
                            {codespace.language} • {codespace.lastModified}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Collapsed state */}
      {isCollapsed && (
        <div className="flex-1 p-2">
          <div className="space-y-2">
            <button
              className="w-full p-3 rounded-lg hover:bg-gray-700/50 transition-colors flex items-center justify-center"
              title="New Codespace"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>

            {myCodespaces.slice(0, 3).map((codespace) => (
              <Link
                key={codespace.id}
                to={`/codespace/${codespace.id}`}
                className="block p-2 rounded-lg hover:bg-gray-700/50 transition-colors text-center"
                title={codespace.name}
              >
                <span className="text-lg">{getLanguageIcon(codespace.language)}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}

export default PrimaryPanel