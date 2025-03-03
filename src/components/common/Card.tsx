import React from 'react';
import { BaseProps } from '@/types/ui';

interface CardProps extends BaseProps {
  title?: string;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  footer,
  className = '',
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      
      <div className="p-4">
        {children}
      </div>
      
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;