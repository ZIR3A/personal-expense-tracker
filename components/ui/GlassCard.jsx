'use client';

import { cn } from '../../lib/utils';

export function GlassCard({ 
  children, 
  className = '', 
  hover = true,
  glow = false,
  noPadding = false,
  ...props 
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl shadow-2xl shadow-black/50',
        hover && 'transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.15] hover:shadow-black/70',
        glow && 'relative overflow-hidden',
        !noPadding && 'p-4 sm:p-6',
        className
      )}
      {...props}
    >
      {glow && (
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl animate-pulse-glow pointer-events-none" />
      )}
      {children}
    </div>
  );
}

export function GlassCardHeader({ children, className = '' }) {
  return (
    <div className={cn('p-6 pb-0', className)}>
      {children}
    </div>
  );
}

export function GlassCardContent({ children, className = '' }) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  );
}

export function GlassCardFooter({ children, className = '' }) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  );
}