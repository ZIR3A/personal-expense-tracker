'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2 } from 'lucide-react';
import { GlassCard, GlassCardContent } from '../../components/ui/GlassCard';
import { GlassButton } from '../../components/ui/GlassButton';
import { GlassInput } from '../../components/ui/GlassInput';
import { Scene } from '../../components/scene';
import { useAuthStore } from '../../lib/store-auth';
import { useReducedMotion, getPageTransition } from '../../components/ui/motion';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  const [showError, setShowError] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const pageTransition = getPageTransition(prefersReducedMotion);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const onSubmit = async (data) => {
    const result = await registerUser(data.email, data.password, data.name);
    if (result.success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Scene />
      
      <motion.div
        {...pageTransition}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-3 mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded-lg p-1"
          >
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-white font-bold text-xl">NS</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/60">Start tracking your finances today</p>
        </div>

        <GlassCard glow>
          <GlassCardContent>
            <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="space-y-6"
              aria-label="Create account form"
            >
              <GlassInput
                label="Name"
                type="text"
                placeholder="John Doe"
                icon={User}
                error={errors.name?.message}
                autoComplete="name"
                required
                {...register('name')}
              />

              <GlassInput
                label="Email"
                type="email"
                placeholder="you@example.com"
                icon={Mail}
                error={errors.email?.message}
                autoComplete="email"
                required
                {...register('email')}
              />

              <GlassInput
                label="Password"
                type="password"
                placeholder="Min 8 characters"
                icon={Lock}
                error={errors.password?.message}
                autoComplete="new-password"
                required
                helperText="Must be at least 8 characters"
                {...register('password')}
              />

              <GlassInput
                label="Confirm Password"
                type="password"
                placeholder="Repeat your password"
                icon={Lock}
                error={errors.confirmPassword?.message}
                autoComplete="new-password"
                required
                {...register('confirmPassword')}
              />

              {showError && error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-start gap-2"
                  role="alert"
                >
                  <span className="inline-block w-1 h-1 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </motion.div>
              )}

              <GlassButton 
                type="submit" 
                variant="primary" 
                isLoading={isLoading}
                className="w-full"
                ariaLabel={isLoading ? 'Creating account...' : 'Create account'}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </GlassButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-white/60 text-sm">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-cyan-400 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </GlassCardContent>
        </GlassCard>
      </motion.div>
    </div>
  );
}