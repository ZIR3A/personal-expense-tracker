'use client';

import { useState } from 'react';
import { Download, Calendar, FileSpreadsheet } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassModal } from './GlassModal';
import { GlassButton } from './GlassButton';
import { GlassInput } from './GlassInput';
import { statsAPI } from '../../lib/api';
import { useAuthStore } from '../../lib/store-auth';

export function ExportModal({ isOpen, onClose }) {
  const { accessToken } = useAuthStore();
  const [monthlyExport, setMonthlyExport] = useState({
    type: 'monthly',
    month: new Date().toISOString().slice(0, 7),
    year: new Date().getFullYear().toString()
  });

  const handleExport = (type) => {
    let url;
    if (type === 'daily') {
      url = `${statsAPI.exportDaily(monthlyExport.month)}`;
    } else {
      url = `${statsAPI.exportMonthly(monthlyExport.year)}`;
    }

    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}-export.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onClose();
  };

  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Export Data" size="md">
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
          <p className="text-sm text-white/60">
            Export your transactions as CSV files for use in spreadsheet applications like Excel or Google Sheets.
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Daily Export</h3>
                <p className="text-sm text-white/60">Export transactions by specific month</p>
              </div>
            </div>
            <GlassInput
              type="month"
              value={monthlyExport.month}
              onChange={(e) => setMonthlyExport({ ...monthlyExport, month: e.target.value })}
            />
            <GlassButton 
              variant="secondary" 
              icon={Download} 
              className="w-full"
              onClick={() => handleExport('daily')}
            >
              Download Daily CSV
            </GlassButton>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Monthly Summary</h3>
                <p className="text-sm text-white/60">Export monthly summaries for a year</p>
              </div>
            </div>
            <GlassInput
              type="number"
              min="2020"
              max="2030"
              value={monthlyExport.year}
              onChange={(e) => setMonthlyExport({ ...monthlyExport, year: e.target.value })}
            />
            <GlassButton 
              variant="secondary" 
              icon={Download} 
              className="w-full"
              onClick={() => handleExport('monthly')}
            >
              Download Monthly CSV
            </GlassButton>
          </div>
        </div>
      </div>
    </GlassModal>
  );
}