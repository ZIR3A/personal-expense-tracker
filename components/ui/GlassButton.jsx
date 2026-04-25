'use client';

import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export function GlassButton({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  ...props 
}) {
  const variants = {
    primary: 'gradient-primary hover:shadow-lg hover:shadow-cyan-500/25 text-white',
    secondary: 'bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] hover:border-white/20 text-white',
    ghost: 'hover:bg-white/[0.05] text-white/80 hover:text-white',
    danger: 'bg-rose-500/20 border border-rose-500/30 hover:bg-rose-500/30 text-rose-400',
    success: 'bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-400'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:ring-offset-2 focus:ring-offset-background',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}