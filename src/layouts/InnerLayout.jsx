import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PrimaryPanel from '../components/PrimaryPanel'
import SecondaryPanel from '../components/SecondaryPanel'
import useUISettingsStore from '../store/uiSettingsStore'

const InnerLayout = () => {
  const {
    showFooter,
    primaryPanelToggleBehavior,
    secondaryPanelToggleBehavior,
    isPrimaryPanelCollapsed,
    isSecondaryPanelCollapsed,
    togglePrimaryPanel,
    toggleSecondaryPanel
  } = useUISettingsStore()

  return (
    <div className="h-screen bg-gray-900 flex flex-col relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[10%] bg-gradient-to-tr from-green-500/8 via-green-300/15 to-emerald-400/5 rotate-12 transform-gpu blur-3xl"></div>
        <div className="absolute -inset-[5%] top-[30%] bg-gradient-to-bl from-green-600/6 via-green-400/12 to-emerald-500/4 -rotate-12 transform-gpu blur-2xl"></div>
        <div className="absolute -inset-[6%] top-[60%] left-[20%] bg-gradient-to-r from-green-400/6 via-emerald-500/8 to-green-600/4 rotate-45 transform-gpu blur-xl"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/2 to-transparent"></div>
      </div>

      {/* Top Navbar */}
      <Navbar
        onTogglePrimaryPanel={togglePrimaryPanel}
        isPrimaryPanelCollapsed={isPrimaryPanelCollapsed}
        onToggleSecondaryPanel={toggleSecondaryPanel}
        isSecondaryPanelCollapsed={isSecondaryPanelCollapsed}
        showPrimaryToggle={true}
        showSecondaryToggle={true}
      />

      {/* Main Layout */}
      <div className="flex flex-1 min-h-0 relative z-10">
        {/* Primary Panel (Left Sidebar) - Always visible */}
        <PrimaryPanel
          isCollapsed={isPrimaryPanelCollapsed}
          onToggleCollapse={togglePrimaryPanel}
          toggleBehavior={primaryPanelToggleBehavior}
        />

        {/* Main Content Area */}
        <main className="flex-1 bg-gray-900/80 backdrop-blur-sm text-white overflow-hidden min-w-0 h-full">
          <Outlet />
        </main>

        {/* Secondary Panel (Right Sidebar) - Always visible */}
        <SecondaryPanel
          isCollapsed={isSecondaryPanelCollapsed}
          onToggleCollapse={toggleSecondaryPanel}
          toggleBehavior={secondaryPanelToggleBehavior}
        />
      </div>

      {/* Footer */}
      {showFooter && <Footer />}
    </div>
  )
}

export default InnerLayout