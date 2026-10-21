'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { ArrowRight, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useToast } from '@/components/ui/toast';
import {
  type UserRole,
  type UserMenuItem,
  getRoleMenuConfig,
} from './user-menu-config';
import {
  useRoleDashboardData,
  invalidateRoleDashboardData,
} from '@/lib/dashboard/use-role-dashboard-data';
import { WalletBalanceCard } from './wallet-balance-card';
import { MenuBadge } from './menu-badge';

export interface UserProfileData {
  id?: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  online?: boolean;
}

interface UserProfileMenuProps {
  /**
   * User profile data passed from live session or auth provider.
   */
  user: UserProfileData;
  onSignOut?: () => void;
  className?: string;
}

/**
 * Role-aware profile dropdown menu wired to live data.
 * - Avatar: User's real photo URL with initials fallback (first letter of first + last name, uppercase).
 * - Online indicator: Active green dot on trigger and dropdown header.
 * - User info header: Real name, email, and verified role badge.
 * - Live Wallet Balance: Live kobo balance queried from ledger via shared useRoleDashboardData hook.
 * - Zero layout shift: Sized skeleton shimmer with opacity-only keyframe animation.
 * - Badges: Live unread/pending order or active delivery counts on role menu items.
 * - Role guarded CTA: Direct 1-click access to verified role dashboard with mismatch protection.
 * - Freshness: Lazy background refetch on dropdown open.
 * - Destructive Sign Out: Calls real Supabase signOut, clears cached queries, and shows toast.
 */
export function UserProfileMenu({
  user,
  onSignOut,
  className,
}: UserProfileMenuProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { showToast } = useToast();

  const role = user.role || 'customer';
  const menuConfig = getRoleMenuConfig(role);

  // Live wallet and menu badge data from the shared role dashboard hook
  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
    refetch,
  } = useRoleDashboardData(user);

  // Compute initials fallback: first letter of first + last name, uppercase
  const initials = React.useMemo(() => {
    if (!user.name || !user.name.trim()) return role.charAt(0).toUpperCase();
    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      const first = parts[0].charAt(0);
      const last = parts[parts.length - 1].charAt(0);
      return `${first}${last}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }, [user.name, role]);

  const handleSignOut = async () => {
    try {
      if (onSignOut) {
        onSignOut();
        return;
      }
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        showToast(error.message, 'error');
        return;
      }
      invalidateRoleDashboardData(user.id);
      showToast('Signed out successfully', 'info');
      router.push('/login');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error signing out';
      showToast(msg, 'error');
    }
  };

  const handleDashboardNavigation = (e: React.MouseEvent<HTMLAnchorElement>, targetHref: string) => {
    // Guard against role mismatch: ensure destination corresponds to authentic session role
    const expectedPrefix = role === 'merchant' ? '/merchant' : role === 'rider' ? '/rider' : '/account';
    if (!targetHref.startsWith(expectedPrefix)) {
      e.preventDefault();
      showToast(`Redirecting to your authorized ${role} dashboard`, 'info');
      router.push(expectedPrefix);
    }
  };

  const isRouteActive = (href?: string) => {
    if (!href) return false;
    if (pathname === href) return true;
    if (href !== '/' && href !== '/account' && href !== '/merchant' && href !== '/rider') {
      return pathname.startsWith(`${href}/`);
    }
    return false;
  };

  return (
    <DropdownMenuPrimitive.Root
      onOpenChange={(open) => {
        if (open) {
          // Refetch wallet and badge data when dropdown opens for immediate freshness
          refetch();
        }
      }}
    >
      <div className="flex items-center gap-2">
        {/* ── NOTIFICATIONS BELL (OPTIONAL / PLACEHOLDER) ──────────────────────────
            Per task requirements: Checked codebase for existing notification APIs/hooks.
            Only backend delivery outbox (notification_outbox) exists for SMS/WhatsApp/Push;
            no consumer notification inbox or hook is currently implemented in the frontend.
            Skipped per non-scaffolding instructions.
            TODO: When notification inbox API is ready, plug NotificationMenu trigger here next to Avatar.
        ──────────────────────────────────────────────────────────────────────────── */}

        <DropdownMenuPrimitive.Trigger asChild>
          <button
            type="button"
            aria-label="Open user menu"
            className={cn(
              'group relative flex items-center justify-center min-w-[44px] min-h-[44px] p-1 rounded-full',
              'transition-transform duration-150 active:scale-95',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
              'ring-1 ring-black/15 dark:ring-white/20 hover:ring-2 hover:ring-brand-500',
              className
            )}
          >
            {/* Avatar Container (size-9 on mobile, size-10 on desktop) */}
            <AvatarPrimitive.Root className="relative flex h-9 w-9 md:h-10 md:w-10 shrink-0 overflow-hidden rounded-full border border-white/60 dark:border-white/20 shadow-sm bg-brand-500/20">
              {user.avatarUrl && (
                <AvatarPrimitive.Image
                  src={user.avatarUrl}
                  alt={user.name}
                  className="aspect-square h-full w-full object-cover"
                />
              )}
              <AvatarPrimitive.Fallback
                delayMs={100}
                className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-amber-500 text-ink text-xs font-black tracking-tight"
              >
                {initials}
              </AvatarPrimitive.Fallback>
            </AvatarPrimitive.Root>

            {/* Green Online Status Dot with ring */}
            <span
              aria-label="Online status"
              className={cn(
                'absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-white dark:ring-slate-900',
                user.online !== false ? 'bg-emerald-500' : 'bg-neutral-400'
              )}
            />
          </button>
        </DropdownMenuPrimitive.Trigger>
      </div>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align="end"
          sideOffset={8}
          className={cn(
            'w-72 rounded-2xl p-2 z-50 select-none outline-none',
            // Glassmorphism tokens consistent with navbar
            'bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl backdrop-saturate-150',
            'border border-white/40 dark:border-white/10 shadow-xl shadow-black/15'
          )}
        >
          {/* ── 1. User Info Header ─────────────────────────────────────── */}
          <div className="px-2.5 py-2 flex items-center gap-3">
            <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/10 bg-brand-500/20">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="aspect-square h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-500 to-amber-500 text-ink text-xs font-black">
                  {initials}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-sm font-bold text-ink dark:text-white leading-tight">
                  {user.name}
                </p>
              </div>
              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                {user.email}
              </p>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={cn(
                    'inline-block h-1.5 w-1.5 rounded-full',
                    user.online !== false ? 'bg-emerald-500' : 'bg-neutral-400'
                  )}
                />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                  {menuConfig.badgeLabel}
                </span>
              </div>
            </div>
          </div>

          {/* ── 2. Live Wallet Balance Card (KEY FEATURE) ───────────────── */}
          <WalletBalanceCard
            formattedBalance={dashboardData?.formattedBalance}
            loading={dashboardLoading}
            error={dashboardError}
            walletHref={menuConfig.walletHref}
          />

          {/* ── Separator ──────────────────────────────────────────────── */}
          <DropdownMenuPrimitive.Separator className="h-px bg-black/10 dark:bg-white/10 my-1.5" />

          {/* ── 3. Prominent Dashboard CTA Button (Guarded) ────────────── */}
          <div className="p-1">
            <DropdownMenuPrimitive.Item asChild>
              <Link
                href={menuConfig.dashboardCta.href}
                onClick={(e) => handleDashboardNavigation(e, menuConfig.dashboardCta.href)}
                className={cn(
                  'group relative flex w-full items-center justify-between px-3 py-2.5 rounded-xl no-underline',
                  'bg-brand-500 text-ink font-bold text-xs shadow-sm',
                  'ring-1 ring-brand-600/30 hover:ring-2 hover:ring-brand-400',
                  'hover:bg-brand-400 hover:shadow-[0_4px_16px_-4px_rgba(255,107,26,.5)]',
                  'active:scale-[0.98] transition-all duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
                )}
              >
                <div className="flex flex-col text-left">
                  <span className="font-extrabold tracking-tight">
                    {menuConfig.dashboardCta.label}
                  </span>
                  <span className="text-[10px] text-ink/75 font-medium leading-none mt-0.5">
                    {menuConfig.dashboardCta.description}
                  </span>
                </div>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-ink ml-2 transition-transform duration-150 group-hover:translate-x-1"
                />
              </Link>
            </DropdownMenuPrimitive.Item>
          </div>

          {/* ── Separator ──────────────────────────────────────────────── */}
          <DropdownMenuPrimitive.Separator className="h-px bg-black/10 dark:bg-white/10 my-1.5" />

          {/* ── 4. Role-specific Menu Items with Live Badges ────────────── */}
          <div className="space-y-0.5">
            {menuConfig.menuItems.map((item: UserMenuItem) => {
              const Icon: LucideIcon = item.icon;
              const active = isRouteActive(item.href);
              const badgeCount = item.badgeKey ? dashboardData?.badgeCount : undefined;

              return (
                <DropdownMenuPrimitive.Item key={item.label} asChild>
                  <Link
                    href={item.href || '#'}
                    className={cn(
                      'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium no-underline cursor-pointer',
                      'ring-1 ring-transparent hover:ring-1 hover:ring-black/10 dark:hover:ring-white/15',
                      'transition-colors duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                      active
                        ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400 font-semibold'
                        : 'text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 hover:text-ink dark:hover:text-white'
                    )}
                  >
                    <Icon
                      size={18}
                      className={cn(
                        'shrink-0',
                        active
                          ? 'text-brand-600 dark:text-brand-400'
                          : 'text-neutral-500 dark:text-neutral-400 group-hover:text-ink dark:group-hover:text-white'
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                    {/* Live Memoized Menu Badge */}
                    <MenuBadge count={badgeCount} />
                  </Link>
                </DropdownMenuPrimitive.Item>
              );
            })}
          </div>

          {/* ── Separator ──────────────────────────────────────────────── */}
          <DropdownMenuPrimitive.Separator className="h-px bg-black/10 dark:bg-white/10 my-1.5" />

          {/* ── 5. Shared Bottom Section (Settings + Sign Out) ──────────── */}
          <div className="space-y-0.5">
            {/* Account Settings */}
            <DropdownMenuPrimitive.Item asChild>
              <Link
                href={menuConfig.settingsItem.href || '#'}
                className={cn(
                  'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium no-underline cursor-pointer',
                  'ring-1 ring-transparent hover:ring-1 hover:ring-black/10 dark:hover:ring-white/15',
                  'text-neutral-700 dark:text-neutral-200 hover:bg-black/5 dark:hover:bg-white/10 hover:text-ink dark:hover:text-white',
                  'transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500'
                )}
              >
                <menuConfig.settingsItem.icon
                  size={18}
                  className="shrink-0 text-neutral-500 dark:text-neutral-400"
                />
                <span>{menuConfig.settingsItem.label}</span>
              </Link>
            </DropdownMenuPrimitive.Item>

            {/* Sign Out (Destructive item) */}
            <DropdownMenuPrimitive.Item
              onSelect={(e) => {
                e.preventDefault();
                handleSignOut();
              }}
              className={cn(
                'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium cursor-pointer',
                'ring-1 ring-transparent hover:ring-1 hover:ring-red-500/30',
                'text-red-600 dark:text-red-400 hover:bg-red-500/10 hover:text-red-700 dark:hover:text-red-300',
                'transition-colors duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500'
              )}
            >
              <menuConfig.signOutItem.icon size={18} className="shrink-0" />
              <span>{menuConfig.signOutItem.label}</span>
            </DropdownMenuPrimitive.Item>
          </div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}
