import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUISettingsStore = create(
  persist(
    (set, get) => ({
      // UI Layout Settings
      showFooter: false, // Footer is hidden by default
      allowMultiplePanels: true, // Allow both panels to be open simultaneously

      // Panel Toggle Behavior - How toggle buttons behave
      primaryPanelToggleBehavior: 'shrink', // 'shrink' or 'minimize'
      secondaryPanelToggleBehavior: 'shrink', // 'shrink' or 'minimize'

      // Panel States - Whether panels are collapsed/minimized
      isPrimaryPanelCollapsed: false,
      isSecondaryPanelCollapsed: false,

      // Actions
      toggleFooter: () => set((state) => ({ showFooter: !state.showFooter })),

      setPrimaryPanelToggleBehavior: (behavior) => set({ primaryPanelToggleBehavior: behavior }),
      setSecondaryPanelToggleBehavior: (behavior) => set({ secondaryPanelToggleBehavior: behavior }),

      togglePrimaryPanel: () => set((state) => {
        const currentState = get();
        const newCollapsed = !state.isPrimaryPanelCollapsed;

        // If only one panel allowed and we're expanding primary, collapse secondary
        if (!currentState.allowMultiplePanels && !newCollapsed) {
          return {
            isPrimaryPanelCollapsed: newCollapsed,
            isSecondaryPanelCollapsed: true
          };
        }

        return { isPrimaryPanelCollapsed: newCollapsed };
      }),

      toggleSecondaryPanel: () => set((state) => {
        const currentState = get();
        const newCollapsed = !state.isSecondaryPanelCollapsed;

        // If only one panel allowed and we're expanding secondary, collapse primary
        if (!currentState.allowMultiplePanels && !newCollapsed) {
          return {
            isSecondaryPanelCollapsed: newCollapsed,
            isPrimaryPanelCollapsed: true
          };
        }

        return { isSecondaryPanelCollapsed: newCollapsed };
      }),

      setAllowMultiplePanels: (allow) => set({ allowMultiplePanels: allow }),

      // Reset to defaults
      resetUISettings: () => set({
        showFooter: false,
        allowMultiplePanels: true,
        primaryPanelToggleBehavior: 'shrink',
        secondaryPanelToggleBehavior: 'shrink',
        isPrimaryPanelCollapsed: false,
        isSecondaryPanelCollapsed: false,
      }),
    }),
    {
      name: 'ui-settings-storage',
      partialize: (state) => ({
        showFooter: state.showFooter,
        allowMultiplePanels: state.allowMultiplePanels,
        primaryPanelToggleBehavior: state.primaryPanelToggleBehavior,
        secondaryPanelToggleBehavior: state.secondaryPanelToggleBehavior,
        isPrimaryPanelCollapsed: state.isPrimaryPanelCollapsed,
        isSecondaryPanelCollapsed: state.isSecondaryPanelCollapsed,
      }),
    }
  )
)

export default useUISettingsStore
