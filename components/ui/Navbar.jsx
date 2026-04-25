'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Receipt, 
  Download, 
  Settings,
  LogOut,
  Menu,
  X,
  PlusCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuthStore } from '../../lib/store-auth';
import { useUIStore } from '../../lib/store-ui';
import { useReducedMotion } from './motion';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/transactions', icon: Receipt, label: 'Transactions' },
  { href: '/export', icon: Download, label: 'Export' },
  { href: '/settings', icon: Settings, label: 'Settings' }
];

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { openAddModal } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <nav 
        className="fixed top-0 left-0 right-0 z-40 px-4 py-3"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between h-16 px-4 rounded-2xl glass">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded-lg p-1"
              aria-label="NS Finance Tracker Home"
            >
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">NS</span>
              </div>
              <span className="hidden sm:block font-semibold text-white">NS Finance Tracker</span>
            </Link>

            <div className="hidden md:flex items-center gap-2" role="menubar">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  aria-current={pathname === item.href ? 'page' : undefined}
                  className={cn(
                    'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
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
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl gradient-primary text-white text-sm font-medium 
                  hover:shadow-lg hover:shadow-cyan-500/25 transition-all
                  focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                aria-label="Add new transaction"
              >
                <PlusCircle className="w-4 h-4" aria-hidden="true" />
                Add
              </button>

              <button
                onClick={() => logout()}
                className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white
                  focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                aria-label="Sign out"
              >
                <LogOut className="w-5 h-5" aria-hidden="true" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors text-white/60
                  focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
            className="fixed inset-0 z-30 md:hidden pt-20"
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0 }}
              className="absolute inset-0 bg-black/60"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0, y: -20 } : { opacity: 0, y: -20 }}
              animate={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0, y: -20 } : { opacity: 0, y: -20 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              className="absolute top-0 left-0 right-0 p-4"
            >
              <div className="rounded-2xl glass p-4 space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                      'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
                      pathname === item.href
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <item.icon className="w-5 h-5" aria-hidden="true" />
                    {item.label}
                  </Link>
                ))}
                <button
                  onClick={() => {
                    openAddModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium gradient-primary text-white
                    focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  <PlusCircle className="w-5 h-5" aria-hidden="true" />
                  Add Transaction
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <nav 
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden px-4 pb-4"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-16 rounded-2xl glass">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              aria-label={item.label}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all min-w-[64px] min-h-[64px] justify-center',
                'focus:outline-none focus:ring-2 focus:ring-cyan-500/50',
                pathname === item.href
                  ? 'text-white bg-white/10'
                  : 'text-white/40'
              )}
            >
              <item.icon className="w-5 h-5" aria-hidden="true" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}