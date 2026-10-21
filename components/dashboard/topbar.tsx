'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  ExternalLink,
  User,
  LogOut,
  ChevronDown,
  Shield,
  Bike,
  Store,
  UserCheck,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import { type DashboardRole, getTitleForPath } from '@/lib/dashboard/menu';

interface TopbarProps {
  role: DashboardRole;
  collapsed: boolean;
  onOpenMobile: () => void;
}

export function DashboardTopbar({
  role,
  collapsed,
  onOpenMobile,
}: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pageTitle = getTitleForPath(pathname);

  const roleMeta: Record<
    DashboardRole,
    { label: string; icon: React.ComponentType<{ size?: number; className?: string }>; profileHref: string }
  > = {
    merchant: {
      label: 'Merchant Partner',
      icon: Store,
      profileHref: '/merchant/profile',
    },
    rider: {
      label: 'Delivery Rider',
      icon: Bike,
      profileHref: '/rider/profile',
    },
    admin: {
      label: 'Super Admin',
      icon: Shield,
      profileHref: '/admin/profile',
    },
    customer: {
      label: 'Customer Account',
      icon: UserCheck,
      profileHref: '/account',
    },
  };

  const initial = role.charAt(0).toUpperCase();

  async function handleLogout() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      showToast('Logged out successfully', 'info');
      router.push('/login');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error logging out';
      showToast(msg, 'error');
    }
  }

  return (
    <header
      className={`fixed top-0 right-0 z-20 h-16 bg-ink/80 backdrop-blur-xl border-b border-white/10 text-white flex items-center justify-between px-4 sm:px-6 transition-[left] duration-200 left-0 ${
        collapsed ? 'lg:left-[72px]' : 'lg:left-[260px]'
      }`}
    >
      {/* Left side: Hamburger (mobile) + Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors lg:hidden"
          aria-label="Open mobile menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-tight">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right side: Back to site + User menu */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Back to site link */}
        <Link
          href="/"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white/80 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all no-underline"
          title="Back to consumer storefront"
        >
          <span>Back to site</span>
          <ExternalLink size={13} className="text-brand-500" />
        </Link>

        {/* User Menu Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-white/10 transition-colors"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
            aria-label="User account menu"
          >
            {/* Avatar circle with user initial */}
            <div className="w-8 h-8 rounded-full bg-brand-500 text-ink font-bold text-sm grid place-items-center shadow-md border border-white/20">
              {initial}
            </div>

            <span className="hidden md:inline-block text-xs font-semibold text-white/90">
              {roleMeta[role].label}
            </span>
            <ChevronDown
              size={14}
              className={`text-white/60 hidden sm:block ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-ink/95 backdrop-blur-2xl shadow-2xl p-2 z-50 text-white"
            >
              <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                <p className="text-xs font-bold text-white truncate">
                  {roleMeta[role].label}
                </p>
                <p className="text-[11px] text-white/50 capitalize">
                  {role} access active
                </p>
              </div>

              <Link
                href={roleMeta[role].profileHref}
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors no-underline"
              >
                <User size={15} className="text-brand-500" />
                <span>Profile</span>
              </Link>

              <Link
                href="/"
                onClick={() => setDropdownOpen(false)}
                className="sm:hidden flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors no-underline"
              >
                <ExternalLink size={15} className="text-brand-500" />
                <span>Back to site</span>
              </Link>

              <div className="border-t border-white/10 my-1" />

              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
              >
                <LogOut size={15} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
