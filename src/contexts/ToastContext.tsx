import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer, ToastProps, ToastType } from '@/components/Toast';
import { v4 as uuidv4 } from 'uuid';

type ToastContextType = {
  showToast: (type: ToastType, message: string, duration?: number) => void;
  hideToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = useCallback((type: ToastType, message: string, duration = 5000) => {
    const id = uuidv4();
    setToasts((prevToasts) => [
      ...prevToasts,
      { id, type, message, duration, onClose: hideToast },
    ]);
    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </ToastContext.Provider>
  );
};

export default ToastContext;
