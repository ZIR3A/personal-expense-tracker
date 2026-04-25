'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { formatCurrency } from '../../lib/utils';

export function StatsOverview({ stats }) {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <GlassCard key={i} className="animate-pulse">
            <div className="h-24" />
          </GlassCard>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      label: 'Balance',
      value: stats.balance,
      icon: Wallet,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10'
    },
    {
      label: 'Monthly Income',
      value: stats.monthlyIncome,
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    },
    {
      label: 'Monthly Expenses',
      value: stats.monthlyExpenses,
      icon: TrendingDown,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10'
    },
    {
      label: 'Daily Average',
      value: stats.dailyAverage,
      icon: PiggyBank,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <GlassCard>
            <div className={`inline-flex p-2 rounded-xl ${item.bgColor} mb-3`}>
              <item.icon className={`w-5 h-5 ${item.color}`} />
            </div>
            <p className="text-sm text-white/60 mb-1">{item.label}</p>
            <p className={`text-xl font-semibold ${item.color}`}>
              {formatCurrency(item.value)}
            </p>
          </GlassCard>
        </motion.div>
      ))}
    </div>
  );
}