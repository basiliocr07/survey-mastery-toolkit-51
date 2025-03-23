
import { useState, useEffect } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function toast(message: string, options: ToastOptions = {}) {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      message,
      type: options.type || 'info',
    };
    
    setToasts((prevToasts) => [...prevToasts, newToast]);
    
    if (options.duration !== Infinity) {
      setTimeout(() => {
        removeToast(id);
      }, options.duration || 3000);
    }
  }

  function removeToast(id: string) {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }

  return {
    toasts,
    toast,
    removeToast,
  };
}

// Export a singleton version for global usage
const toastState = {
  toasts: [] as Toast[],
  listeners: new Set<(toasts: Toast[]) => void>(),
};

function updateToasts(toasts: Toast[]) {
  toastState.toasts = toasts;
  toastState.listeners.forEach((listener) => listener(toasts));
}

export const toast = (message: string, options: ToastOptions = {}) => {
  const id = Math.random().toString(36).substr(2, 9);
  const newToast: Toast = {
    id,
    message,
    type: options.type || 'info',
  };
  
  updateToasts([...toastState.toasts, newToast]);
  
  if (options.duration !== Infinity) {
    setTimeout(() => {
      updateToasts(toastState.toasts.filter((toast) => toast.id !== id));
    }, options.duration || 3000);
  }
  
  return id;
};
