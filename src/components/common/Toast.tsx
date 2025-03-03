import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ToastProps } from '@/types/ui';

const Toast: React.FC<ToastProps> = ({
  notification,
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Handle toast timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration]);
  
  // Handle animation end
  const handleAnimationEnd = () => {
    if (!isVisible && onClose) {
      onClose();
    }
  };
  
  // Get color based on notification type
  const getTypeColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
      default:
        return 'bg-primary';
    }
  };
  
  // Get icon based on notification type
  const getTypeIcon = () => {
    switch (notification.type) {
      case 'success':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };
  
  return createPortal(
    <div
      className={`fixed bottom-4 right-4 flex items-center p-4 rounded-md shadow-lg border-l-4 border-${notification.type === 'info' ? 'primary' : notification.type} bg-white max-w-md transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className={`flex-shrink-0 p-2 rounded-full text-white ${getTypeColor()}`}>
        {getTypeIcon()}
      </div>
      
      <div className="ml-3 flex-1">
        <p className="font-medium text-gray-900">{notification.title}</p>
        <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
      </div>
      
      <button
        onClick={() => setIsVisible(false)}
        className="ml-4 text-gray-400 hover:text-gray-500 focus:outline-none"
        aria-label="Close"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>,
    document.body
  );
};

export default Toast;