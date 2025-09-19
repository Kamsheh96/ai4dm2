export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  timestamp: Date;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  id?: string;
  duration?: number;
}

export interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, options?: ToastOptions) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export interface FileUploadProgress {
  fileId: string;
  progress: number;
  loaded: number;
  total: number;
}