'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserProfileMenu, type UserProfileData } from './user-profile-menu';
import { getRoleMenuConfig } from './user-menu-config';
import { ArrowRight } from 'lucide-react';
import { useUserSession } from '@/lib/auth/use-user-session';

interface NavbarAuthSlotProps {
  /**
   * Optional user prop for SSR hydration, testing, or external auth providers.
   * If provided, this overrides the internal client-side Supabase lookup.
   */
  user?: UserProfileData | null;
  /**
   * Optional custom logout handler callback.
   */
  onSignOut?: () => void;
  /**
   * Callback invoked when a navigation link is clicked (useful for closing mobile drawers).
   */
  onNavigate?: () => void;
  /**
   * Display mode: 'navbar' (desktop header / compact mobile trigger) or 'mobile' (inside mobile drawer).
   */
  mode?: 'navbar' | 'mobile';
  className?: string;
}

/**
 * NavbarAuthSlot — Dynamically renders auth state on the right side of FloatingNavbar
 * or inside MobileMenu.
 *
 * - Signed-out state: Renders "Sign In" (ghost) + "Get Started" (solid primary CTA).
 * - Signed-in state: Renders the role-aware <UserProfileMenu /> avatar dropdown.
 * - Live auth: Connected directly to app's Supabase session with real-time synchronization.
 * - Performance: In-memory session cache eliminates layout shifts and duplicate network fetches.
 */
export function NavbarAuthSlot({
  user: initialUser,
  onSignOut,
  onNavigate,
  mode = 'navbar',
  className = '',
}: NavbarAuthSlotProps) {
  const { user: liveUser, loading: sessionLoading, signOut: sessionSignOut } = useUserSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use initialUser override if passed via props, otherwise live session user
  const currentUser = initialUser !== undefined ? initialUser : liveUser;
  const activeSignOut = onSignOut || sessionSignOut;

  // ── Mobile Drawer Layout Mode ─────────────────────────────────────────────
  if (mode === 'mobile') {
    if (!mounted || (!currentUser && !sessionLoading)) {
      return (
        <div className={`grid grid-cols-2 gap-2 pt-1 pb-1 w-full ${className}`}>
          {/* Sign In — wired to existing /login route */}
          <Link
            href="/login"
            onClick={onNavigate}
            className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 min-h-[44px] text-[14px] font-bold text-ink dark:text-white border-2 border-line dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 hover:ring-1 hover:ring-black/10 dark:hover:ring-white/20 transition-all no-underline nav-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Sign In
          </Link>

          {/* Get Started — solid CTA, wired to existing /register route */}
          <Link
            href="/register"
            onClick={onNavigate}
            className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 min-h-[44px] text-[14px] font-bold bg-brand-500 text-ink hover:bg-brand-400 hover:ring-1 hover:ring-brand-600/30 transition-all no-underline active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            Get Started
          </Link>
        </div>
      );
    }

    if (currentUser) {
      const menuConfig = getRoleMenuConfig(currentUser.role);

      return (
        <div className={`flex flex-col gap-2 pt-1 pb-1 w-full ${className}`}>
          <div className="flex items-center justify-between p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
            <div className="flex items-center gap-3 min-w-0">
              <UserProfileMenu user={currentUser} onSignOut={activeSignOut} />
              <div className="text-left min-w-0">
                <p className="text-sm font-bold text-ink dark:text-white leading-tight truncate">
                  {currentUser.name}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                  {menuConfig.badgeLabel}
                </p>
              </div>
            </div>
            <Link
              href={menuConfig.dashboardCta.href}
              onClick={onNavigate}
              className="flex items-center gap-1 px-3 py-2 rounded-lg bg-brand-500/15 text-brand-600 dark:text-brand-400 hover:bg-brand-500/25 text-xs font-bold transition-colors no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 shrink-0"
            >
              <span>Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      );
    }

    // Shimmer fallback placeholder for zero layout shift during brief initial load
    return (
      <div className={`grid grid-cols-2 gap-2 pt-1 pb-1 w-full ${className}`}>
        <div className="h-[44px] rounded-xl bg-black/5 dark:bg-white/10 nav-skeleton" />
        <div className="h-[44px] rounded-xl bg-brand-500/20 nav-skeleton" />
      </div>
    );
  }

  // ── Navbar Header Mode (Desktop) ──────────────────────────────────────────
  // Before client hydration or when signed out, show the static buttons on desktop
  if (!mounted || (!currentUser && !sessionLoading)) {
    return (
      <div className={`hidden md:flex items-center gap-2 ${className}`}>
        {/* Sign In — ghost button, wired to existing /login route */}
        <Link
          href="/login"
          className="flex items-center gap-1 px-4 py-2 min-h-[40px] rounded-xl text-[14px] font-bold text-ink dark:text-white/90 border border-line dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/10 hover:ring-1 hover:ring-black/10 dark:hover:ring-white/20 transition-all no-underline nav-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          Sign In
        </Link>

        {/* Get Started — solid CTA, wired to existing /register route */}
        <Link
          href="/register"
          className="flex items-center gap-1 px-4 py-2 min-h-[40px] rounded-xl text-[14px] font-bold bg-brand-500 text-ink hover:bg-brand-400 hover:shadow-[0_10px_30px_-8px_rgba(255,107,26,.6)] hover:ring-1 hover:ring-brand-600/30 transition-all no-underline active:scale-[.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
        >
          Get Started
        </Link>
      </div>
    );
  }

  if (currentUser) {
    // Signed in: show live role-aware user profile dropdown menu
    return (
      <div className={`flex items-center ${className}`}>
        <UserProfileMenu user={currentUser} onSignOut={activeSignOut} />
      </div>
    );
  }

  // Shimmer placeholder for desktop header during brief first-load (exact dimensions: 40px height)
  return (
    <div className={`hidden md:flex items-center gap-2 ${className}`}>
      <div className="w-20 h-10 rounded-xl bg-black/5 dark:bg-white/10 nav-skeleton" />
      <div className="w-28 h-10 rounded-xl bg-brand-500/20 nav-skeleton" />
    </div>
  );
}
