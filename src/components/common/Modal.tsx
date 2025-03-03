import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ModalProps } from '@/types/ui';

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  className = '',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      // Restore body scroll
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);
  
  // Handle escape key
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  // Portal content to body
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
      <div 
        ref={modalRef}
        className={`bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full max-h-[90vh] flex flex-col ${className}`}
      >
        {title && (
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-primary to-primary-dark text-white">
            <h3 className="text-lg font-medium">{title}</h3>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full w-8 h-8 flex items-center justify-center focus:outline-none"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        <div className="p-4 overflow-y-auto flex-grow">
          {children}
        </div>
        
        {footer && (
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;