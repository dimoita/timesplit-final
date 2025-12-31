
import React, { useEffect, useState } from 'react';
import { Cloud, CloudOff, CheckCircle2, AlertCircle, WifiOff } from 'lucide-react';

export type ToastType = 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastSystemProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

export const ToastSystem: React.FC<ToastSystemProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-24 right-0 left-0 flex flex-col items-center pointer-events-none z-[100] gap-3 px-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onRemove: () => void }> = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(onRemove, 300); // Wait for exit animation
    }, 4000);

    return () => clearTimeout(timer);
  }, [onRemove]);

  const config = {
    SUCCESS: {
      bg: 'bg-emerald-900/90',
      border: 'border-emerald-500/50',
      icon: <CheckCircle2 className="text-emerald-400" size={20} />,
      text: 'text-white'
    },
    ERROR: {
      bg: 'bg-slate-900/90',
      border: 'border-orange-500/50', // Friendly orange/red instead of blood red
      icon: <WifiOff className="text-orange-400" size={20} />,
      text: 'text-white'
    },
    WARNING: {
      bg: 'bg-amber-900/90',
      border: 'border-amber-500/50',
      icon: <AlertCircle className="text-amber-400" size={20} />,
      text: 'text-white'
    },
    INFO: {
      bg: 'bg-indigo-900/90',
      border: 'border-indigo-500/50',
      icon: <Cloud className="text-indigo-400" size={20} />,
      text: 'text-white'
    }
  }[toast.type];

  return (
    <div 
      className={`
        pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl border backdrop-blur-md shadow-2xl transition-all duration-300 transform
        ${config.bg} ${config.border} ${isExiting ? 'opacity-0 -translate-y-4 scale-95' : 'opacity-100 translate-y-0 scale-100'}
      `}
    >
      <div className="shrink-0">{config.icon}</div>
      <p className={`text-sm font-bold ${config.text}`}>{toast.message}</p>
    </div>
  );
};
