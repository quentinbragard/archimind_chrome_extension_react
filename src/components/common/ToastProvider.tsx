import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastNotification } from '@/types/common';
import Toast from './Toast';

interface ToastContextProps {
  showToast: (notification: ToastNotification) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: React.ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<{ id: string; notification: ToastNotification }[]>([]);
  
  const showToast = useCallback((notification: ToastNotification) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, notification }]);
  }, []);
  
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);
  
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map(({ id, notification }) => (
        <Toast 
          key={id} 
          notification={notification} 
          onClose={() => removeToast(id)} 
        />
      ))}
    </ToastContext.Provider>
  );
};

export default ToastProvider;