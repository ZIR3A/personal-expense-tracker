'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { GlassCard, GlassCardContent } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { ExportModal } from '../../components/ui/ExportModal';
import { Scene } from '../../components/scene';
import { Navbar } from '../../components/ui/Navbar';
import { useAuthStore } from '../../lib/store-auth';

export default function ExportPage() {
  const router = useRouter();
  const { isAuthenticated, refreshUser } = useAuthStore();
  const [exportModalOpen, setExportModalOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    refreshUser();
  }, [isAuthenticated, router, refreshUser]);

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
            <h1 className="text-2xl font-bold text-white">Export Data</h1>
            <p className="text-white/60 text-sm mt-1">Download your financial data</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <GlassCard className="group">
              <GlassCardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                    <Download className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Daily Export</h3>
                    <p className="text-sm text-white/60">By specific month</p>
                  </div>
                </div>
                <p className="text-sm text-white/60 mb-4">
                  Export all transactions for a specific month with running balance calculations.
                </p>
                <GlassButton variant="secondary" className="w-full" onClick={() => setExportModalOpen(true)}>
                  Export Daily
                </GlassButton>
              </GlassCardContent>
            </GlassCard>

            <GlassCard className="group">
              <GlassCardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Download className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Monthly Summary</h3>
                    <p className="text-sm text-white/60">Full year overview</p>
                  </div>
                </div>
                <p className="text-sm text-white/60 mb-4">
                  Export monthly summaries including income, expenses, and category breakdowns.
                </p>
                <GlassButton variant="secondary" className="w-full" onClick={() => setExportModalOpen(true)}>
                  Export Monthly
                </GlassButton>
              </GlassCardContent>
            </GlassCard>
          </div>

          <GlassCard className="mt-6">
            <GlassCardContent>
              <h3 className="font-semibold text-white mb-4">Export Format</h3>
              <div className="space-y-2 text-sm text-white/60">
                <p>Exports are provided in CSV format, compatible with:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Microsoft Excel</li>
                  <li>Google Sheets</li>
                  <li>Apple Numbers</li>
                  <li>Any spreadsheet application</li>
                </ul>
              </div>
            </GlassCardContent>
          </GlassCard>
        </motion.div>
      </main>

      <ExportModal isOpen={exportModalOpen} onClose={() => setExportModalOpen(false)} />
    </div>
  );
}