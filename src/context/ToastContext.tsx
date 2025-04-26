import React, { createContext, useContext } from 'react';
import { toast } from 'react-toastify';
import { ToastContextType, defaultOptions } from './toastTypes';

// Create the context with a default value
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Custom hook to use the toast context
export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Toast provider component
export function ToastProvider({ children }: { children: React.ReactNode }) {
  // Toast functions
  const showSuccess = (message: string, options = {}) => {
    toast.success(message, { ...defaultOptions, ...options });
  };

  const showError = (message: string, options = {}) => {
    toast.error(message, { ...defaultOptions, ...options });
  };

  const showInfo = (message: string, options = {}) => {
    toast.info(message, { ...defaultOptions, ...options });
  };

  const showWarning = (message: string, options = {}) => {
    toast.warning(message, { ...defaultOptions, ...options });
  };

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo, showWarning }}>
      {children}
    </ToastContext.Provider>
  );
}
