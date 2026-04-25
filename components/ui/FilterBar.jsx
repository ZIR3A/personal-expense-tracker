'use client';

import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';
import { GlassInput, GlassSelect } from './GlassInput';
import { CATEGORIES } from '../../lib/utils';
import { useTransactionStore } from '../../lib/store-transaction';

export function FilterBar() {
  const { filters, setFilters, clearFilters } = useTransactionStore();
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApply = () => {
    setFilters(localFilters);
    setIsOpen(false);
  };

  const handleClear = () => {
    clearFilters();
    setLocalFilters({
      startDate: null,
      endDate: null,
      type: null,
      category: null,
      search: ''
    });
  };

  const hasActiveFilters = filters.type || filters.category || filters.startDate || filters.endDate;

  const categoryOptions = [
    ...CATEGORIES.income.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) })),
    ...CATEGORIES.expense.map((c) => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <GlassInput
            placeholder="Search transactions..."
            icon={Search}
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
          />
        </div>
        <GlassButton
          variant={hasActiveFilters ? 'primary' : 'secondary'}
          icon={Filter}
          onClick={() => setIsOpen(!isOpen)}
        >
          Filters
          {hasActiveFilters && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">
              Active
            </span>
          )}
        </GlassButton>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard noPadding className="space-y-4">
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassInput
                  type="date"
                  label="Start Date"
                  value={localFilters.startDate || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value || null })}
                />
                <GlassInput
                  type="date"
                  label="End Date"
                  value={localFilters.endDate || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value || null })}
                />
                <GlassSelect
                  label="Type"
                  value={localFilters.type || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, type: e.target.value || null })}
                  options={[
                    { value: 'income', label: 'Income' },
                    { value: 'expense', label: 'Expense' }
                  ]}
                />
                <GlassSelect
                  label="Category"
                  value={localFilters.category || ''}
                  onChange={(e) => setLocalFilters({ ...localFilters, category: e.target.value || null })}
                  options={categoryOptions}
                />
              </div>
              <div className="flex justify-end gap-3">
                <GlassButton variant="ghost" onClick={handleClear}>
                  Clear All
                </GlassButton>
                <GlassButton variant="primary" onClick={handleApply}>
                  Apply Filters
                </GlassButton>
              </div>
            </div>
          </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}