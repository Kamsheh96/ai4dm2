import React from 'react';
import type { Toast as ToastType } from '../types/index';

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const getToastStyles = (): string => {
    const baseStyles = 'px-4 py-3 rounded-lg shadow-lg text-white flex items-center justify-between min-w-[300px] animate-slide-up';

    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-500`;
      case 'error':
        return `${baseStyles} bg-red-500`;
      case 'warning':
        return `${baseStyles} bg-amber-500`;
      case 'info':
        return `${baseStyles} bg-blue-500`;
      default:
        return `${baseStyles} bg-gray-500`;
    }
  };

  const getIcon = (): string => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-center space-x-2">
        <span className="text-lg font-bold">{getIcon()}</span>
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-4 text-white hover:text-gray-200 transition-colors"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};