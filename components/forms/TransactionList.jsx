'use client';

import { format } from 'date-fns';
import { 
  TrendingUp, 
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { formatCurrency, formatCategory } from '../../lib/utils';
import { useTransactionStore } from '../../lib/store-transaction';
import { useUIStore } from '../../lib/store-ui';

export function TransactionList() {
  const { transactions, isLoading } = useTransactionStore();
  const { openEditModal } = useUIStore();

  if (isLoading && transactions.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <GlassCard key={i} className="animate-pulse">
            <div className="h-20" />
          </GlassCard>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <GlassCard className="py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.05] flex items-center justify-center">
          <TrendingDown className="w-8 h-8 text-white/40" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No transactions yet</h3>
        <p className="text-white/60 text-sm">Add your first transaction to get started</p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-3 relative">
      <AnimatePresence mode="popLayout">
        {transactions.map((transaction, index) => (
          <motion.div
            key={transaction.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard noPadding className="group cursor-pointer" onClick={() => openEditModal(transaction)}>
              <div className="flex items-center gap-4 p-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  transaction.type === 'income' 
                    ? 'bg-emerald-500/20' 
                    : 'bg-rose-500/20'
                }`}>
                  {transaction.type === 'income' ? (
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-rose-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white truncate">
                      {formatCategory(transaction.category)}
                    </p>
                    {transaction.recurring && (
                      <RefreshCw className="w-3 h-3 text-white/40" />
                    )}
                  </div>
                  <p className="text-sm text-white/60 truncate">
                    {transaction.description || 'No description'}
                  </p>
                </div>

                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'income' 
                      ? 'text-emerald-400' 
                      : 'text-rose-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                  <p className="text-xs text-white/40">
                    {format(new Date(transaction.date), 'MMM d, yyyy')}
                  </p>
                </div>

                
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}