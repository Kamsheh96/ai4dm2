import React, { createContext, useCallback, useState } from 'react';
import type { ReactNode } from 'react';
import type { Toast, ToastType, ToastOptions, ToastContextValue } from '../types/index';

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType, options?: ToastOptions): void => {
    const id = options?.id ?? `toast-${Date.now()}-${Math.random()}`;
    const duration = options?.duration ?? 5000;

    setToasts((prevToasts) => {
      const existingToastIndex = prevToasts.findIndex((t) => t.id === id);

      if (existingToastIndex !== -1) {
        const updatedToasts = [...prevToasts];
        updatedToasts[existingToastIndex] = {
          ...updatedToasts[existingToastIndex]!,
          message,
          type,
          timestamp: new Date()
        };
        return updatedToasts;
      }

      const newToast: Toast = {
        id,
        message,
        type,
        duration,
        timestamp: new Date()
      };

      return [...prevToasts, newToast];
    });

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string): void => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const clearToasts = useCallback((): void => {
    setToasts([]);
  }, []);

  const value: ToastContextValue = {
    toasts,
    addToast,
    removeToast,
    clearToasts
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export default ToastContext;