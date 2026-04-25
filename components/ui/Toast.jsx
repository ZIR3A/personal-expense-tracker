'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useUIStore } from '../../lib/store-ui';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle
};

const colors = {
  success: 'border-emerald-500/50 bg-emerald-500/10',
  error: 'border-rose-500/50 bg-rose-500/10',
  info: 'border-blue-500/50 bg-blue-500/10',
  warning: 'border-amber-500/50 bg-amber-500/10'
};

const iconColors = {
  success: 'text-emerald-400',
  error: 'text-rose-400',
  info: 'text-blue-400',
  warning: 'text-amber-400'
};

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = icons[toast.type || 'info'];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${colors[toast.type || 'info']} backdrop-blur-xl shadow-lg min-w-[300px]`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${iconColors[toast.type || 'info']}`} />
              <p className="flex-1 text-sm text-white">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-white/10 rounded transition-colors text-white/60"
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