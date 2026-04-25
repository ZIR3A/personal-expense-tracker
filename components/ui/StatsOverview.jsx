'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { StatsSkeleton } from './Skeleton';
import { formatCurrency } from '../../lib/utils';
import { useReducedMotion } from './motion';

export function StatsOverview({ stats, isLoading }) {
  const prefersReducedMotion = useReducedMotion();

  if (isLoading || !stats) {
    return <StatsSkeleton />;
  }

  const statItems = [
    {
      label: 'Balance',
      value: stats.balance,
      icon: Wallet,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      description: 'Current account balance'
    },
    {
      label: 'Monthly Income',
      value: stats.monthlyIncome,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      description: 'Total income this month'
    },
    {
      label: 'Monthly Expenses',
      value: stats.monthlyExpenses,
      icon: TrendingDown,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      description: 'Total expenses this month'
    },
    {
      label: 'Daily Average',
      value: stats.dailyAverage,
      icon: PiggyBank,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      description: 'Average daily spending'
    }
  ];

  return (
    <div 
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      role="region"
      aria-label="Financial overview"
    >
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={prefersReducedMotion 
            ? { duration: 0 } 
            : { delay: index * 0.1, duration: 0.4, ease: 'easeOut' }
          }
        >
          <GlassCard>
            <div 
              className={`inline-flex p-2 rounded-xl ${item.bgColor}`}
              aria-hidden="true"
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-sm text-white/60 mb-1" id={`stat-${index}-label`}>
              {item.label}
            </p>
            <p 
              className={`text-xl font-semibold ${item.color}`}
              aria-labelledby={`stat-${index}-label`}
            >
              {formatCurrency(item.value)}
            </p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}