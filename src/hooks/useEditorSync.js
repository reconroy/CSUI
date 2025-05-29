import { useEffect, useRef } from 'react'
import useEditorSettingsStore from '../stores/editorSettingsStore'

/**
 * Hook to sync editor settings with Monaco Editor instances
 * Automatically updates all Monaco editors when settings change
 */
const useEditorSync = () => {
  const editorInstancesRef = useRef(new Set())
  const { settings, getMonacoOptions } = useEditorSettingsStore()
  
  // Register an editor instance
  const registerEditor = (editorInstance) => {
    if (editorInstance) {
      editorInstancesRef.current.add(editorInstance)
    }
  }
  
  // Unregister an editor instance
  const unregisterEditor = (editorInstance) => {
    if (editorInstance) {
      editorInstancesRef.current.delete(editorInstance)
    }
  }
  
  // Update all registered editors when settings change
  useEffect(() => {
    const updateAllEditors = () => {
      const monacoOptions = getMonacoOptions()
      
      editorInstancesRef.current.forEach((editor) => {
        try {
          if (editor && typeof editor.updateOptions === 'function') {
            editor.updateOptions(monacoOptions)
          }
        } catch (error) {
          console.warn('Failed to update editor options:', error)
          // Remove invalid editor instance
          editorInstancesRef.current.delete(editor)
        }
      })
    }
    
    // Debounce updates to avoid too frequent changes
    const timeoutId = setTimeout(updateAllEditors, 100)
    
    return () => clearTimeout(timeoutId)
  }, [settings, getMonacoOptions])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      editorInstancesRef.current.clear()
    }
  }, [])
  
  return {
    registerEditor,
    unregisterEditor,
    editorInstances: editorInstancesRef.current
  }
}

export default useEditorSync
