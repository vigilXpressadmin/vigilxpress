'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import dynamic from 'next/dynamic';
import { SITE } from '@/lib/site';
import { useToast } from '@/components/ui/toast';
import { createClient } from '@/lib/supabase/client';
import { LiquidWaveSpinner } from '@/components/ui/spinner-10';

const GoldenDustCanvas = dynamic(
  () => import('@/components/animations/golden-dust').then((m) => m.GoldenDustCanvas),
  { ssr: false }
);

export interface AuthSubmitData {
  email: string;
  password: string;
  fullName?: string;
  rememberMe?: boolean;
}

interface AuthCardProps {
  mode: 'login' | 'register';
  onSubmit: (data: AuthSubmitData) => Promise<void> | void;
  loading?: boolean;
  onGoogleSignIn?: () => Promise<void> | void;
  googleLoading?: boolean;
}

// Official Google "G" multicolor SVG icon
function GoogleIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AuthCard({
  mode,
  onSubmit,
  loading: externalLoading,
  onGoogleSignIn,
  googleLoading: externalGoogleLoading,
}: AuthCardProps) {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);
  const [internalGoogleLoading, setInternalGoogleLoading] = useState(false);

  const isSubmitting = externalLoading ?? internalLoading;
  const isGoogleLoading = externalGoogleLoading ?? internalGoogleLoading;

  // 3D Tilt calculation with Framer Motion springs
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 350, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 350, damping: 25 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-10deg', '10deg']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === 'register') {
      if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
      if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
      }
    }

    try {
      setInternalLoading(true);
      await onSubmit({ email, password, fullName, rememberMe });
    } finally {
      setInternalLoading(false);
    }
  };

  const handleGoogleClick = async () => {
    try {
      setInternalGoogleLoading(true);
      if (onGoogleSignIn) {
        await onGoogleSignIn();
      } else {
        const supabase = createClient();
        if (!supabase) {
          showToast('Authentication service is not configured.', 'error');
          setInternalGoogleLoading(false);
          return;
        }
        const origin = window.location.origin;
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${origin}/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });
        if (error) {
          console.error('Google Auth Error:', error.message);
          showToast(error.message, 'error');
          setInternalGoogleLoading(false);
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Google sign-in failed';
      showToast(errorMsg, 'error');
      setInternalGoogleLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <div className="relative min-h-[100svh] w-full flex items-center justify-center p-4 bg-ink overflow-hidden">
      {/* Background radial glows — orange #FF6B1A palette */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-brand-500/20 blur-[100px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-brand-600/20 blur-[100px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Moving Golden Dust particle / ember animation */}
      <GoldenDustCanvas />

      {/* 3D Tilt Wrapper */}
      <div
        style={{ perspective: 1200 }}
        className="w-full max-w-[440px] z-10 py-8"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative rounded-3xl p-[1.5px] overflow-hidden shadow-2xl shadow-black/80"
        >
          {/* Traveling light beam rotating around border */}
          <div
            className="absolute -inset-[100%] animate-[spin_6s_linear_infinite] opacity-75 pointer-events-none"
            style={{
              background:
                'conic-gradient(from 0deg, transparent 0 320deg, rgba(255,107,26,0.9) 350deg, rgba(255,255,255,0.9) 360deg)',
            }}
            aria-hidden="true"
          />

          {/* Inner Glass Card */}
          <div className="relative w-full rounded-[calc(1.5rem-1.5px)] bg-black/60 backdrop-blur-2xl border border-white/10 p-7 sm:p-9 text-white overflow-hidden">
            {/* Subtle noise texture */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none bg-repeat"
              style={{
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
              }}
              aria-hidden="true"
            />

            {/* Escape hatch: Back to home */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 hover:text-white transition-colors duration-200 no-underline"
              >
                <ArrowLeft size={14} />
                <span>Back to home</span>
              </Link>
            </div>

            {/* Header: Logo, Title & Subtitle */}
            <div className="text-center mb-7">
              <Link href="/" className="inline-block mb-3 transition-transform hover:scale-105 duration-200">
                <Image
                  src="/assets/logo.png"
                  alt={`${SITE.name} logo`}
                  width={38}
                  height={38}
                  priority
                  className="mx-auto drop-shadow-[0_8px_20px_rgba(255,107,26,0.4)]"
                />
              </Link>
              <h1 className="text-2xl sm:text-[26px] font-extrabold tracking-tight text-white mb-1.5">
                {isLogin ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="text-sm text-white/60">
                {isLogin ? `Log in to your ${SITE.name} account` : `Join ${SITE.name} for food & grocery delivery`}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name (register only) */}
              {!isLogin && (
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">Full name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Tayo Adebayo"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] pl-10 pr-4 py-3 text-sm text-white placeholder-white/35 outline-none focus:border-brand-500 focus:bg-white/[0.08] focus:ring-1 focus:ring-brand-500 transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] pl-10 pr-4 py-3 text-sm text-white placeholder-white/35 outline-none focus:border-brand-500 focus:bg-white/[0.08] focus:ring-1 focus:ring-brand-500 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete={isLogin ? 'current-password' : 'new-password'}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] pl-10 pr-11 py-3 text-sm text-white placeholder-white/35 outline-none focus:border-brand-500 focus:bg-white/[0.08] focus:ring-1 focus:ring-brand-500 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password (register only) */}
              {!isLogin && (
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1.5">Confirm password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-white/10 bg-white/[0.05] pl-10 pr-4 py-3 text-sm text-white placeholder-white/35 outline-none focus:border-brand-500 focus:bg-white/[0.08] focus:ring-1 focus:ring-brand-500 transition-all duration-200"
                    />
                  </div>
                </div>
              )}

              {/* Remember me (login only) */}
              {isLogin && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-white/10 text-brand-500 focus:ring-brand-500 focus:ring-offset-black accent-[#FF6B1A]"
                    />
                    <span className="text-xs text-white/70">Remember me</span>
                  </label>
                </div>
              )}

              {/* Primary White Button */}
              <button
                type="submit"
                disabled={isSubmitting || isGoogleLoading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-white text-ink font-bold text-sm py-3 px-4 shadow-lg hover:bg-white/90 active:scale-[0.98] disabled:opacity-50 transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <LiquidWaveSpinner size="sm" hideText />
                    <span>{isLogin ? 'Logging in...' : 'Creating account...'}</span>
                  </>
                ) : (
                  <span>{isLogin ? 'Log in' : 'Create account'}</span>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative bg-ink/90 px-3 text-xs uppercase tracking-wider text-white/40 font-semibold">
                or
              </span>
            </div>

            {/* Continue with Google Glass Button */}
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isSubmitting || isGoogleLoading}
              className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white font-medium text-sm py-3 px-4 backdrop-blur-md active:scale-[0.98] disabled:opacity-50 transition-all duration-200 shadow-sm"
            >
              {isGoogleLoading ? (
                <>
                  <LiquidWaveSpinner size="sm" hideText />
                  <span>Redirecting...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="w-4 h-4 flex-none" />
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {/* Footer switcher link */}
            <div className="mt-7 text-center text-xs text-white/60">
              {isLogin ? (
                <p>
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors ml-1">
                    Sign up
                  </Link>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold text-brand-400 hover:text-brand-300 transition-colors ml-1">
                    Log in
                  </Link>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
