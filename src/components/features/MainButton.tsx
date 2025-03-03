import React from 'react';
import { MainButtonProps } from '@/types/ui';

const MainButton: React.FC<MainButtonProps> = ({
  notification = null,
  pulse = false,
  important = false,
  onClick,
}) => {
  return (
    <button
      id="archimind-extension-button"
      aria-label="Open Archimind"
      onClick={onClick}
      className="fixed bottom-5 right-5 w-16 h-16 bg-white rounded-full shadow-lg cursor-pointer z-50 flex items-center justify-center overflow-visible transition-all duration-300 hover:scale-110 active:scale-95"
      style={{
        backgroundImage: 'url("https://gjszbwfzgnwblvdehzcq.supabase.co/storage/v1/object/public/chrome_extension_assets/archimind_letter_logo.png")',
        backgroundSize: '65%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        boxShadow: '0 4px 20px rgba(28, 77, 235, 0.25)',
      }}
    >
      {pulse && (
        <span className="absolute inset-0 w-full h-full rounded-full bg-primary bg-opacity-10 animate-pulse-custom"></span>
      )}
      
      {notification && (
        <span className={`notification-badge ${important ? 'animate-pulse-custom' : ''}`}>
          {notification}
        </span>
      )}
    </button>
  );
};

export default MainButton;