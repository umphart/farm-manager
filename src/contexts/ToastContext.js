// contexts/ToastContext.js
import React, { createContext, useContext } from 'react';
import toast from 'react-hot-toast';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const showSuccess = (message) => {
    toast.success(message);
  };

  const showError = (message) => {
    toast.error(message);
  };

  const showLoading = (message) => {
    return toast.loading(message);
  };

  const dismiss = (toastId) => {
    toast.dismiss(toastId);
  };

  const updateToast = (toastId, options) => {
    toast.dismiss(toastId);
    if (options.type === 'success') {
      toast.success(options.message, { id: toastId });
    } else if (options.type === 'error') {
      toast.error(options.message, { id: toastId });
    }
  };

  return (
    <ToastContext.Provider value={{ 
      showSuccess, 
      showError, 
      showLoading, 
      dismiss,
      updateToast 
    }}>
      {children}
    </ToastContext.Provider>
  );
};