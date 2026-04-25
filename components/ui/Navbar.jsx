'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  Receipt, 
  PlusCircle, 
  Download, 
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../lib/store-auth';
import { useUIStore } from '../../lib/store-ui';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/transactions', icon: Receipt, label: 'Transactions' },
  { href: '/export', icon: Download, label: 'Export' },
  { href: '/settings', icon: Settings, label: 'Settings' }
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { openAddModal, openExportModal } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 rounded-2xl glass">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NS</span>
                </div>
                <span className="hidden sm:block font-semibold text-white">NS Finance Tracker</span>
              </Link>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    pathname === item.href
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={openAddModal}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white text-sm font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                Add
              </button>

              <button
                onClick={() => logout()}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white"
              >
                <LogOut className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-white/60"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-30 md:hidden pt-20"
        >
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute top-0 left-0 right-0 p-4">
            <div className="rounded-2xl glass p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    pathname === item.href
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  openAddModal();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium gradient-primary text-white"
              >
                <PlusCircle className="w-5 h-5" />
                Add Transaction
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 pb-4">
        <div className="flex items-center justify-around h-16 rounded-2xl glass">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all',
                pathname === item.href
                  ? 'text-white'
                  : 'text-white/40'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}