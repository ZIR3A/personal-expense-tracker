'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { FilterBar } from '../../components/ui/FilterBar';
import { TransactionList } from '../../components/forms/TransactionList';
import { ExportModal } from '../../components/ui/ExportModal';
import { TransactionForm } from '../../components/forms/TransactionForm';
import { GlassModal } from '../../components/ui/GlassModal';
import { GlassButton } from '../../components/ui/GlassButton';
import { Scene } from '../../components/scene';
import { Navbar } from '../../components/ui/Navbar';
import { useAuthStore } from '../../lib/store-auth';
import { useTransactionStore } from '../../lib/store-transaction';
import { useUIStore } from '../../lib/store-ui';

export default function TransactionsPage() {
  const router = useRouter();
  const { isAuthenticated, refreshUser } = useAuthStore();
  const { fetchTransactions, deleteTransaction, isLoading: isDeleting } = useTransactionStore();
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
    fetchTransactions();
  }, [isAuthenticated, router, fetchTransactions]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <Scene />
      <Navbar />

      <main className="container max-w-4xl mx-auto px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Transactions</h1>
              <p className="text-white/60 text-sm mt-1">Manage your transactions</p>
            </div>
            <GlassButton variant="primary" icon={PlusCircle} onClick={openAddModal}>
              Add
            </GlassButton>
          </div>

          <div className="space-y-6">
            <FilterBar />
            <TransactionList />
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