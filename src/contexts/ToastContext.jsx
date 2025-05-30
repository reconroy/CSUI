import React, { createContext, useContext, useState, useCallback } from 'react'
import Toast from '../components/Toast'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', options = {}) => {
    const id = Date.now() + Math.random()
    const toast = {
      id,
      message,
      type,
      duration: options.duration || 4000,
      position: options.position || 'top-right'
    }

    setToasts(prev => [...prev, toast])

    // Auto-remove toast after duration
    setTimeout(() => {
      removeToast(id)
    }, toast.duration + 300) // Add 300ms for exit animation

    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showSuccess = useCallback((message, options) => {
    return addToast(message, 'success', options)
  }, [addToast])

  const showError = useCallback((message, options) => {
    return addToast(message, 'error', options)
  }, [addToast])

  const showWarning = useCallback((message, options) => {
    return addToast(message, 'warning', options)
  }, [addToast])

  const showInfo = useCallback((message, options) => {
    return addToast(message, 'info', options)
  }, [addToast])

  const clearAll = useCallback(() => {
    setToasts([])
  }, [])

  const value = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll,
    addToast,
    removeToast
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Render toasts */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          position={toast.position}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  )
}

export default ToastContext
