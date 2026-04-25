'use client';

import { forwardRef, useId } from 'react';
import { cn } from '../../lib/utils';

export const GlassInput = forwardRef(({
  className = '',
  label,
  error,
  icon: Icon,
  helperText,
  required = false,
  disabled = false,
  ...props
}, ref) => {
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-white/80"
        >
          {label}
          {required && (
            <span className="text-rose-400 ml-1" aria-hidden="true">*</span>
          )}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
        )}
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          aria-required={required}
          className={cn(
            'w-full rounded-xl px-4 py-3 bg-white/[0.05] border border-white/10',
            'text-white placeholder:text-white/40',
            'focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/30',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            Icon && 'pl-11',
            error && 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/30',
            className
          )}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && (
        <p id={errorId} className="text-sm text-rose-400 flex items-center gap-1" role="alert">
          <span className="inline-block w-1 h-1 rounded-full bg-rose-400" aria-hidden="true" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="text-sm text-white/50">{helperText}</p>
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
  required = false,
  disabled = false,
  ...props
}, ref) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-white/80"
        >
          {label}
          {required && (
            <span className="text-rose-400 ml-1" aria-hidden="true">*</span>
          )}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
            <Icon className="w-5 h-5" aria-hidden="true" />
          </div>
        )}
        <select
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          aria-required={required}
          className={cn(
            'w-full rounded-xl px-4 py-3 bg-white/[0.05] border border-white/10',
            'text-white appearance-none cursor-pointer',
            'focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/30',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            Icon && 'pl-11',
            error && 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/30',
            className
          )}
          disabled={disabled}
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
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p id={errorId} className="text-sm text-rose-400 flex items-center gap-1" role="alert">
          <span className="inline-block w-1 h-1 rounded-full bg-rose-400" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
});

GlassSelect.displayName = 'GlassSelect';

export const GlassTextarea = forwardRef(({
  className = '',
  label,
  error,
  required = false,
  disabled = false,
  helperText,
  ...props
}, ref) => {
  const id = useId();
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-white/80"
        >
          {label}
          {required && (
            <span className="text-rose-400 ml-1" aria-hidden="true">*</span>
          )}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : helperText ? helperId : undefined}
        aria-required={required}
        className={cn(
          'w-full rounded-xl px-4 py-3 bg-white/[0.05] border border-white/10',
          'text-white placeholder:text-white/40',
          'focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/30',
          'transition-all duration-200 resize-none',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/30',
          className
        )}
        disabled={disabled}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-rose-400 flex items-center gap-1" role="alert">
          <span className="inline-block w-1 h-1 rounded-full bg-rose-400" aria-hidden="true" />
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="text-sm text-white/50">{helperText}</p>
      )}
    </div>
  );
});

GlassTextarea.displayName = 'GlassTextarea';

export const GlassCheckbox = forwardRef(({
  className = '',
  label,
  error,
  disabled = false,
  id,
  ...props
}, ref) => {
  const checkboxId = id || useId();

  return (
    <div className="flex items-center gap-3">
      <input
        ref={ref}
        type="checkbox"
        id={checkboxId}
        aria-invalid={!!error}
        className={cn(
          'w-5 h-5 rounded border-white/20 bg-white/5',
          'text-cyan-500',
          'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-background',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'cursor-pointer',
          error && 'border-rose-500/50',
          className
        )}
        disabled={disabled}
        {...props}
      />
      {label && (
        <label htmlFor={checkboxId} className={cn(
          'text-sm text-white/60 cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed'
        )}>
          {label}
        </label>
      )}
    </div>
  );
});

GlassCheckbox.displayName = 'GlassCheckbox';