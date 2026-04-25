'use client';

import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const GlassInput = forwardRef(({ 
  className = '',
  label,
  error,
  icon: Icon,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/60">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-xl px-4 py-3 bg-white/[0.05] border border-white/10',
            'text-white placeholder:text-white/40',
            'focus:outline-none focus:border-white/20 focus:ring-2 focus:ring-cyan-500/50',
            'transition-all duration-300',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            Icon && 'pl-11',
            error && 'border-rose-500/50 focus:ring-rose-500/50',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-rose-400">{error}</p>
      )}
    </div>
  );
});

GlassInput.displayName = 'GlassInput';

export const GlassSelect = forwardRef(({ 
  className = '',
  label,
  error,
  options = [],
  placeholder = 'Select...',
  icon: Icon,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/60">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full rounded-xl px-4 py-3 bg-white/[0.05] border border-white/10',
            'text-white appearance-none cursor-pointer',
            'focus:outline-none focus:border-white/20 focus:ring-2 focus:ring-cyan-500/50',
            'transition-all duration-300',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            Icon && 'pl-11',
            error && 'border-rose-500/50 focus:ring-rose-500/50',
            className
          )}
          {...props}
        >
          <option value="" className="bg-background-secondary">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-background-secondary">
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="text-sm text-rose-400">{error}</p>
      )}
    </div>
  );
});

GlassSelect.displayName = 'GlassSelect';

export const GlassTextarea = forwardRef(({ 
  className = '',
  label,
  error,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-white/60">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-xl px-4 py-3 bg-white/[0.05] border border-white/10',
          'text-white placeholder:text-white/40',
          'focus:outline-none focus:border-white/20 focus:ring-2 focus:ring-cyan-500/50',
          'transition-all duration-300 resize-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-rose-500/50 focus:ring-rose-500/50',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-rose-400">{error}</p>
      )}
    </div>
  );
});

GlassTextarea.displayName = 'GlassTextarea';