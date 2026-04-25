'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useReducedMotion } from './motion';

export function GlassModal({ 
  isOpen, 
  onClose, 
  title,
  children, 
  size = 'md',
  showClose = true,
  ariaLabel = 'Dialog'
}) {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  const animationVariants = prefersReducedMotion
    ? {
        overlay: { opacity: 0 },
        modal: { opacity: 0 }
      }
    : {
        overlay: { opacity: 1 },
        modal: { opacity: 1, scale: 1, y: 0 }
      };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? 'modal-title' : undefined}
          aria-label={!title ? ariaLabel : undefined}
        >
          <motion.div
            ref={modalRef}
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: prefersReducedMotion ? 0 : 0.2, 
              ease: 'easeOut' 
            }}
            className={cn(
              'w-full rounded-2xl bg-white/[0.05] backdrop-blur-2xl border border-white/10 shadow-2xl',
              'max-h-[90vh] overflow-hidden flex flex-col',
              sizes[size]
            )}
            tabIndex={-1}
          >
            {title && (
              <div className="flex items-center justify-between p-6 pb-0">
                <h2 id="modal-title" className="text-lg font-semibold text-white">{title}</h2>
                {showClose && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white
                      focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                    aria-label="Close dialog"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
            <div className="p-6 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
}