'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useUIStore } from '../../lib/store-ui';
import { cn } from '../../lib/utils';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle
};

const colors = {
  success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
  error: 'border-rose-500/50 bg-rose-500/10 text-rose-400',
  info: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
  warning: 'border-amber-500/50 bg-amber-500/10 text-amber-400'
};

const roleMap = {
  success: 'status',
  error: 'alert',
  info: 'status',
  warning: 'alert'
};

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  // Clean up stale toasts on unmount
  useEffect(() => {
    return () => {
      // Clear any pending timeouts when component unmounts
    };
  }, []);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => {
          const Icon = icons[toast.type || 'info'];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              role={roleMap[toast.type || 'info']}
              aria-live={toast.type === 'error' || toast.type === 'warning' ? 'assertive' : 'polite'}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-lg min-w-[300px]',
                colors[toast.type || 'info']
              )}
            >
              <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
              <p className="flex-1 text-sm text-white">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-white/10 rounded transition-colors text-white/60"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export function useToast() {
  const addToast = useUIStore((state) => state.addToast);

  return {
    success: (message) => addToast({ type: 'success', message }),
    error: (message) => addToast({ type: 'error', message }),
    info: (message) => addToast({ type: 'info', message }),
    warning: (message) => addToast({ type: 'warning', message })
  };
}