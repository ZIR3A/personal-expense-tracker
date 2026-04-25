'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Palette, DollarSign, Shield } from 'lucide-react';
import { GlassCard, GlassCardContent } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { GlassInput } from '../../components/ui/GlassInput';
import { Scene } from '../../components/scene';
import { Navbar } from '../../components/ui/Navbar';
import { useAuthStore } from '../../lib/store-auth';
import { useTransactionStore } from '../../lib/store-transaction';
import { useUIStore } from '../../lib/store-ui';

export default function SettingsPage() {
  const router = useRouter();
  const { isAuthenticated, refreshUser, user } = useAuthStore();
  const { budgets, fetchBudgets, updateBudgets } = useTransactionStore();
  const { addToast } = useUIStore();
  const [isSaving, setIsSaving] = useState(false);
  const [localBudgets, setLocalBudgets] = useState({});

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchBudgets();
  }, [isAuthenticated, router, fetchBudgets]);

  useEffect(() => {
    setLocalBudgets(budgets);
  }, [budgets]);

  const handleBudgetSave = async () => {
    setIsSaving(true);
    const result = await updateBudgets(localBudgets);
    setIsSaving(false);
    
    if (result.success) {
      addToast({ type: 'success', message: 'Budgets saved successfully' });
    } else {
      addToast({ type: 'error', message: 'Failed to save budgets' });
    }
  };

  const handleBudgetChange = (category, value) => {
    setLocalBudgets({
      ...localBudgets,
      [category]: parseFloat(value) || 0
    });
  };

  const categories = [
    'groceries', 'dining', 'entertainment', 'subscriptions',
    'transport', 'bills', 'utilities', 'health', 'shopping'
  ];

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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-white/60 text-sm mt-1">Manage your preferences</p>
          </div>

          <div className="space-y-6">
            <GlassCard>
              <GlassCardContent>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <User className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Profile</h3>
                    <p className="text-sm text-white/60">Your account information</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03]">
                    <div>
                      <p className="text-sm text-white/60">Name</p>
                      <p className="text-white font-medium">{user?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03]">
                    <div>
                      <p className="text-sm text-white/60">Email</p>
                      <p className="text-white font-medium">{user?.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>

            <GlassCard>
              <GlassCardContent>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Budget Limits</h3>
                    <p className="text-sm text-white/60">Set spending limits per category</p>
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {categories.map((category) => (
                    <GlassInput
                      key={category}
                      label={category.charAt(0).toUpperCase() + category.slice(1)}
                      type="number"
                      min="0"
                      step="1"
                      value={localBudgets[category] || ''}
                      onChange={(e) => handleBudgetChange(category, e.target.value)}
                      placeholder="0"
                    />
                  ))}
                </div>

                <GlassButton variant="primary" isLoading={isSaving} onClick={handleBudgetSave} className="w-full">
                  Save Budgets
                </GlassButton>
              </GlassCardContent>
            </GlassCard>

            <GlassCard>
              <GlassCardContent>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Security</h3>
                    <p className="text-sm text-white/60">Account security settings</p>
                  </div>
                </div>
                
                <div className="p-4 rounded-xl bg-white/[0.03]">
                  <p className="text-sm text-white/60 mb-4">
                    Your account is secured with JWT tokens and bcrypt password hashing.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                      JWT Auth
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                      bcrypt
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                      RS256
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-400">
                      HTTP Only
                    </span>
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </div>
        </motion.div>
      </main>
    </div>
  );
}