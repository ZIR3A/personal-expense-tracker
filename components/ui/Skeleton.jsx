'use client';

import { cn } from '../../lib/utils';

export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-white/[0.05]',
        className
      )}
      {...props}
    />
  );
}

export function TransactionSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="w-10 h-10 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="space-y-2 text-right">
        <Skeleton className="h-4 w-20 ml-auto" />
        <Skeleton className="h-3 w-16 ml-auto" />
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-6 rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <Skeleton className="h-3 w-20 mb-3" />
          <Skeleton className="h-8 w-28 mb-2" />
          <Skeleton className="h-3 w-16" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-end gap-3 h-32">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${20 + Math.random() * 80}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} className="h-2 w-6" />
        ))}
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-4 rounded-2xl border border-white/[0.08] bg-white/[0.03]">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}