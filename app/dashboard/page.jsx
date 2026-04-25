'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PlusCircle, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { GlassCard, GlassCardContent } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { StatsOverview } from '../../components/ui/StatsOverview';
import { FilterBar } from '../../components/ui/FilterBar';
import { TransactionList } from '../../components/forms/TransactionList';
import { ExportModal } from '../../components/ui/ExportModal';
import { TransactionForm } from '../../components/forms/TransactionForm';
import { GlassModal } from '../../components/ui/GlassModal';
import { Scene } from '../../components/scene';
import { Navbar } from '../../components/ui/Navbar';
import { useAuthStore } from '../../lib/store-auth';
import { useTransactionStore } from '../../lib/store-transaction';
import { useUIStore } from '../../lib/store-ui';
import { formatCurrency } from '../../lib/utils';
import { config } from '../../lib/config';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, refreshUser } = useAuthStore();
  const { stats, fetchStats, transactions, fetchTransactions, deleteTransaction, isLoading: isDeleting } = useTransactionStore();
  const { isAddModalOpen, isExportModalOpen, openAddModal, closeAddModal, openExportModal, closeExportModal, editingTransaction, closeEditModal, addToast } = useUIStore();

  const handleDeleteFromForm = async () => {
    if (!editingTransaction) return;
    const result = await deleteTransaction(editingTransaction.id);
    if (result.success) {
      closeEditModal();
      addToast({ type: 'success', message: 'Transaction deleted' });
    } else {
      addToast({ type: 'error', message: result.error || 'Failed to delete' });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    refreshUser();
    fetchStats();
    fetchTransactions();
  }, [isAuthenticated, router, refreshUser, fetchStats, fetchTransactions]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <Scene />
      <Navbar />

      <main className="container max-w-7xl mx-auto pt-24 px-4 xl:px-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-white/60 text-sm mt-1">Track your finances</p>
            </div>
            <div className="flex gap-3">
              <GlassButton variant="secondary" icon={Download} onClick={openExportModal}>
                Export
              </GlassButton>
              <GlassButton variant="primary" icon={PlusCircle} onClick={openAddModal}>
                Add Transaction
              </GlassButton>
            </div>
          </div>

          <div className="mb-8">
            <StatsOverview stats={stats} />
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <FilterBar />
              <TransactionList />
            </div>

            <div className="space-y-6">
              <GlassCard noPadding>
                <div className="p-4 sm:p-6">
                  <h3 className="font-semibold text-white mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">This Month</span>
                      <span className="text-emerald-400 font-medium">
                        {formatCurrency(stats?.monthlyIncome || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">This Month</span>
                      <span className="text-rose-400 font-medium">
                        {formatCurrency(stats?.monthlyExpenses || 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Transactions</span>
                      <span className="text-white font-medium">
                        {stats?.transactionsThisMonth || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Top Category</span>
                      <span className="text-cyan-400 font-medium capitalize">
                        {stats?.topCategory?.replace('_', ' ') || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {stats?.byCategory?.length > 0 && (
                <GlassCard noPadding>
                  <div className="p-4 sm:p-6">
                    <h3 className="font-semibold text-white mb-4">Spending by Category</h3>
                    <div className="space-y-3">
                      {stats.byCategory.slice(0, 5).map((item) => (
                        <div key={item.category}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-white/80 capitalize">
                              {item.category.replace('_', ' ')}
                            </span>
                            <span className="text-sm text-rose-400">
                              {formatCurrency(item.total)}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-rose-400"
                              style={{
                                width: `${Math.min((item.total / (stats?.monthlyExpenses || 1)) * 100, 100)}%`
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      <GlassModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
        size="md"
      >
        <TransactionForm onDelete={handleDeleteFromForm} />
      </GlassModal>

      <ExportModal isOpen={isExportModalOpen} onClose={closeExportModal} />
    </div>
  );
}