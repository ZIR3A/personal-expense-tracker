'use client';

import { format } from 'date-fns';
import { 
  TrendingUp, 
  TrendingDown,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '../../components/ui/GlassCard';
import { TransactionSkeleton } from '../../components/ui/Skeleton';
import { formatCurrency, formatCategory } from '../../lib/utils';
import { useTransactionStore } from '../../lib/store-transaction';
import { useUIStore } from '../../lib/store-ui';
import { useReducedMotion } from '../../components/ui/motion';

export function TransactionList() {
  const { transactions, isLoading } = useTransactionStore();
  const { openEditModal } = useUIStore();
  const prefersReducedMotion = useReducedMotion();

  if (isLoading && transactions.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <GlassCard key={i} noPadding>
            <TransactionSkeleton />
          </GlassCard>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <GlassCard className="py-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.05] flex items-center justify-center">
          <TrendingDown className="w-8 h-8 text-white/40" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No transactions yet</h3>
        <p className="text-white/60 text-sm">Add your first transaction to get started tracking your finances</p>
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
            initial={prefersReducedMotion 
              ? { opacity: 0 } 
              : { opacity: 0, y: 20 }
            }
            animate={prefersReducedMotion 
              ? { opacity: 1 } 
              : { opacity: 1, y: 0 }
            }
            exit={prefersReducedMotion 
              ? { opacity: 0 } 
              : { opacity: 0, x: -100 }
            }
            transition={prefersReducedMotion 
              ? { duration: 0 } 
              : { delay: index * 0.05, duration: 0.3, ease: 'easeOut' }
            }
          >
            <GlassCard 
              noPadding 
              className="group cursor-pointer" 
              onClick={() => openEditModal(transaction)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openEditModal(transaction);
                }
              }}
              aria-label={`${transaction.type === 'income' ? 'Income' : 'Expense'}: ${formatCurrency(transaction.amount)} for ${formatCategory(transaction.category)}${transaction.description ? ` - ${transaction.description}` : ''}`}
            >
              <div className="flex items-center gap-4 p-4">
                <div 
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    transaction.type === 'income' 
                      ? 'bg-emerald-500/20' 
                      : 'bg-rose-500/20'
                  }`}
                  aria-hidden="true"
                >
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
                      <RefreshCw 
                        className="w-3 h-3 text-white/40 flex-shrink-0" 
                        aria-label="Recurring transaction"
                      />
                    )}
                  </div>
                  <p className="text-sm text-white/60 truncate">
                    {transaction.description || 'No description'}
                  </p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p 
                    className={`font-semibold ${
                      transaction.type === 'income' 
                        ? 'text-emerald-400' 
                        : 'text-rose-400'
                    }`}
                  >
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