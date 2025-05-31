import React, { useState } from 'react'

const SecondaryPanel = ({ isCollapsed = false, onToggleCollapse, toggleBehavior = 'shrink' }) => {
  const [activeTab, setActiveTab] = useState('activity')

  // Sample data for each tab
  const [activities] = useState([
    { id: 1, type: 'edit', file: 'main.js', time: '2 min ago', user: 'You' },
    { id: 2, type: 'create', file: 'styles.css', time: '5 min ago', user: 'You' },
    { id: 3, type: 'share', file: 'Project', time: '1 hour ago', user: 'You' },
    { id: 4, type: 'delete', file: 'old-file.txt', time: '2 hours ago', user: 'You' },
  ])

  const [collaborators] = useState([
    { id: 1, name: 'John Doe', avatar: 'JD', status: 'online', role: 'Editor' },
    { id: 2, name: 'Jane Smith', avatar: 'JS', status: 'away', role: 'Viewer' },
    { id: 3, name: 'Mike Johnson', avatar: 'MJ', status: 'offline', role: 'Editor' },
    { id: 4, name: 'Sarah Wilson', avatar: 'SW', status: 'online', role: 'Admin' },
  ])

  const [tools] = useState([
    { id: 1, name: 'Terminal', icon: 'terminal', description: 'Command line interface' },
    { id: 2, name: 'File Explorer', icon: 'folder', description: 'Browse project files' },
    { id: 3, name: 'Git', icon: 'git', description: 'Version control' },
    { id: 4, name: 'Extensions', icon: 'puzzle', description: 'Manage extensions' },
    { id: 5, name: 'Debugger', icon: 'bug', description: 'Debug your code' },
    { id: 6, name: 'Live Preview', icon: 'eye', description: 'Preview your app' },
  ])

  const tabs = [
    {
      id: 'activity',
      label: 'Activity',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'collaborators',
      label: 'People',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
    },
    {
      id: 'tools',
      label: 'Tools',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'edit':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        )
      case 'create':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        )
      case 'share':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
        )
      case 'delete':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-500'
      case 'away':
        return 'bg-yellow-500'
      case 'offline':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getToolIcon = (icon) => {
    switch (icon) {
      case 'terminal':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'folder':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case 'git':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h3a2 2 0 012 2v1M13 13l-2-2" />
          </svg>
        )
      case 'puzzle':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        )
      case 'bug':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        )
      case 'eye':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
    }
  }

  // Handle collapsed state based on toggle behavior
  if (isCollapsed) {
    if (toggleBehavior === 'shrink') {
      // Shrink mode - show icons only
      return (
        <aside className="w-12 bg-gray-800/80 backdrop-blur-sm border-l border-gray-700/50 text-white relative z-10 flex flex-col">
          {/* Collapsed Tab Icons */}
          <div className="flex flex-col">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  onToggleCollapse && onToggleCollapse()
                }}
                className={`flex items-center justify-center py-3 px-2 text-xs font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'text-green-400 bg-gray-700/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/20'
                }`}
                title={tab.label}
              >
                {tab.icon}
              </button>
            ))}
          </div>
        </aside>
      )
    } else if (toggleBehavior === 'minimize') {
      // Minimize mode - show thin strip
      return (
        <aside className="w-2 bg-gray-800/80 backdrop-blur-sm border-l border-gray-700/50 text-white relative z-10 flex flex-col group hover:w-8 transition-all duration-200">
          {/* Minimized strip with expand hint */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <button
              onClick={onToggleCollapse}
              className="w-full h-full flex items-center justify-center text-gray-400 hover:text-green-400 transition-colors"
              title="Restore secondary panel"
            >
              <div className="w-1 h-8 bg-gray-600 group-hover:bg-green-500 rounded-full transition-colors"></div>
            </button>
          </div>
        </aside>
      )
    }
  }

  return (
    <aside className="w-80 bg-gray-800/80 backdrop-blur-sm border-l border-gray-700/50 text-white relative z-10 flex flex-col">
      {/* Tab Navigation */}
      <div className="border-b border-gray-700/50">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center py-3 px-2 text-xs font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-green-400 border-b-2 border-green-400 bg-gray-700/30'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700/20'
              }`}
            >
              {tab.icon}
              <span className="ml-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto thin-scrollbar">
        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-700/30 transition-colors">
                  {getActivityIcon(activity.type)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">
                      <span className="font-medium">{activity.user}</span> {activity.type}d{' '}
                      <span className="text-green-400">{activity.file}</span>
                    </p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collaborators Tab */}
        {activeTab === 'collaborators' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-300">Collaborators</h3>
              <button className="text-green-400 hover:text-green-300 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              {collaborators.map((collaborator) => (
                <div key={collaborator.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700/30 transition-colors">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-gray-900 font-medium text-sm">
                      {collaborator.avatar}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(collaborator.status)}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{collaborator.name}</p>
                    <p className="text-xs text-gray-400">{collaborator.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Development Tools</h3>
            <div className="space-y-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  className="w-full flex items-center py-2 px-3 rounded-lg hover:bg-gray-700/50 hover:text-green-400 transition-colors duration-200 text-left"
                >
                  {getToolIcon(tool.icon)}
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium">{tool.name}</p>
                    <p className="text-xs text-gray-400">{tool.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default SecondaryPanel