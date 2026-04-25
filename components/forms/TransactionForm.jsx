'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { DollarSign, Calendar, Tag, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard, GlassCardContent } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { GlassInput, GlassSelect, GlassTextarea, GlassCheckbox } from '../../components/ui/GlassInput';
import { CATEGORIES, formatCurrency, formatDate } from '../../lib/utils';
import { config } from '../../lib/config';
import { useTransactionStore } from '../../lib/store-transaction';
import { useUIStore } from '../../lib/store-ui';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.string().min(1, 'Amount is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().max(500).optional(),
  date: z.string().min(1, 'Date is required'),
  recurring: z.boolean().optional(),
  tags: z.array(z.string()).optional()
});

export function TransactionForm({ onDelete }) {
  const { editingTransaction, closeAddModal, openEditModal } = useUIStore();
  const { addTransaction, updateTransaction, isLoading } = useTransactionStore();
  const isEditing = !!editingTransaction;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: '',
      category: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      recurring: false,
      tags: []
    }
  });

  const type = watch('type');

  useEffect(() => {
    if (editingTransaction) {
      reset({
        type: editingTransaction.type,
        amount: editingTransaction.amount.toString(),
        category: editingTransaction.category,
        description: editingTransaction.description || '',
        date: editingTransaction.date,
        recurring: editingTransaction.recurring || false,
        tags: editingTransaction.tags || []
      });
    } else {
      reset({
        type: 'expense',
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        recurring: false,
        tags: []
      });
    }
  }, [editingTransaction, reset]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      amount: parseFloat(data.amount)
    };

    let result;
    if (isEditing) {
      result = await updateTransaction(editingTransaction.id, payload);
    } else {
      result = await addTransaction(payload);
    }

    if (result.success) {
      closeAddModal();
      reset();
    }
  };

  const categoryOptions = CATEGORIES[type].map((cat) => ({
    value: cat,
    label: cat.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => {
            setValue('type', 'income');
            setValue('category', '');
          }}
          className={`p-4 rounded-xl border transition-all ${
            type === 'income'
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400'
              : 'bg-white/[0.05] border-white/10 text-white/60 hover:border-white/20'
          }`}
        >
          <span className="text-sm font-medium">Income</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setValue('type', 'expense');
            setValue('category', '');
          }}
          className={`p-4 rounded-xl border transition-all ${
            type === 'expense'
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
              : 'bg-white/[0.05] border-white/10 text-white/60 hover:border-white/20'
          }`}
        >
          <span className="text-sm font-medium">Expense</span>
        </button>
      </div>

      <input type="hidden" {...register('type')} />

      <div className="grid grid-cols-2 gap-4">
        <GlassInput
          label="Amount"
          type="number"
          step="0.01"
          placeholder={`0.00 ${config.currency.symbol}`}
          icon={DollarSign}
          error={errors.amount?.message}
          {...register('amount')}
        />
        <GlassInput
          type="date"
          label="Date"
          icon={Calendar}
          error={errors.date?.message}
          {...register('date')}
        />
      </div>

      <GlassSelect
        label="Category"
        options={categoryOptions}
        placeholder="Select category"
        icon={Tag}
        error={errors.category?.message}
        {...register('category')}
      />

      <GlassTextarea
        label="Description"
        placeholder="Add a note..."
        rows={3}
        error={errors.description?.message}
        {...register('description')}
      />

      <GlassCheckbox
        id="recurring"
        label="Recurring transaction"
        {...register('recurring')}
      />

      <div className="flex gap-3 pt-2">
        {isEditing && (
          <GlassButton type="button" variant="danger" onClick={onDelete} className="flex-1">
            Delete
          </GlassButton>
        )}
        <GlassButton type="button" variant="secondary" onClick={closeAddModal} className="flex-1">
          Cancel
        </GlassButton>
        <GlassButton type="submit" variant="primary" isLoading={isLoading} className="flex-1">
          {isEditing ? 'Update' : 'Add'}
        </GlassButton>
      </div>
    </form>
  );
}