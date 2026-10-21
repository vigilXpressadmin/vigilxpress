import type { LucideIcon } from 'lucide-react';
import {
  CircleUserRound,
  Package,
  Wallet,
  Store,
  Bike,
  Settings,
  LogOut,
} from 'lucide-react';

export type UserRole = 'customer' | 'merchant' | 'rider';

export interface UserMenuItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  destructive?: boolean;
  badgeKey?: 'orders' | 'store' | 'deliveries';
}

export interface RoleMenuConfig {
  role: UserRole;
  roleDisplayName: string;
  badgeLabel: string;
  walletHref: string;
  /**
   * Prominent full-width button rendered right beneath the header
   * Target routes point directly to actual dashboard files verified in the codebase
   */
  dashboardCta: {
    label: string;
    href: string;
    description: string;
  };
  menuItems: UserMenuItem[];
  settingsItem: UserMenuItem;
  signOutItem: UserMenuItem;
}

/**
 * Single source of truth for per-role menu configurations.
 * Every role gets:
 * 1. User info header (avatar, name, email, online dot)
 * 2. Prominent top Dashboard CTA button (1-click access to verified dashboard route)
 * 3. Role-specific profile items with Lucide icons (size 20)
 * 4. Shared bottom section: Account Settings + Destructive Sign Out
 */
export const USER_ROLE_MENUS: Record<UserRole, RoleMenuConfig> = {
  // ── CUSTOMER ROLE CONFIG ──────────────────────────────────────────────────
  customer: {
    role: 'customer',
    roleDisplayName: 'Customer',
    badgeLabel: 'Customer Account',
    walletHref: '/account',
    dashboardCta: {
      label: 'Go to Customer Dashboard',
      // Points to: app/(customer)/account/page.tsx & app/(customer)/account/layout.tsx
      href: '/account',
      description: 'Manage orders, deliveries & addresses',
    },
    menuItems: [
      {
        label: 'My Profile',
        icon: CircleUserRound,
        // Points to: app/(customer)/account/page.tsx
        href: '/account',
      },
      {
        label: 'My Orders',
        icon: Package,
        // Points to: app/(customer)/orders/page.tsx
        href: '/orders',
        badgeKey: 'orders',
      },
      {
        label: 'My Wallet',
        icon: Wallet,
        // Customer wallet/transaction data lives in customer dashboard overview (/account)
        href: '/account',
      },
    ],
    settingsItem: {
      label: 'Account Settings',
      icon: Settings,
      // Points to: app/(customer)/account/addresses/page.tsx or /account
      href: '/account',
    },
    signOutItem: {
      label: 'Sign Out',
      icon: LogOut,
      destructive: true,
    },
  },

  // ── MERCHANT ROLE CONFIG ──────────────────────────────────────────────────
  merchant: {
    role: 'merchant',
    roleDisplayName: 'Merchant',
    badgeLabel: 'Merchant Partner',
    walletHref: '/merchant/wallet',
    dashboardCta: {
      label: 'Go to Merchant Dashboard',
      // Points to: app/(merchant)/merchant/page.tsx & app/(merchant)/merchant/layout.tsx
      href: '/merchant',
      description: 'Track orders, revenue & product catalogue',
    },
    menuItems: [
      {
        label: 'My Profile',
        icon: CircleUserRound,
        // Points to: app/(merchant)/merchant/profile/page.tsx
        href: '/merchant/profile',
      },
      {
        label: 'My Store / Business',
        icon: Store,
        // Points to: app/(merchant)/merchant/settings/page.tsx & menu config
        href: '/merchant/settings',
        badgeKey: 'store',
      },
      {
        label: 'My Wallet & Earnings',
        icon: Wallet,
        // Points to: app/(merchant)/merchant/wallet/page.tsx
        href: '/merchant/wallet',
      },
    ],
    settingsItem: {
      label: 'Store Settings',
      icon: Settings,
      // Points to: app/(merchant)/merchant/settings/page.tsx
      href: '/merchant/settings',
    },
    signOutItem: {
      label: 'Sign Out',
      icon: LogOut,
      destructive: true,
    },
  },

  // ── RIDER ROLE CONFIG ─────────────────────────────────────────────────────
  rider: {
    role: 'rider',
    roleDisplayName: 'Rider',
    badgeLabel: 'Delivery Rider',
    walletHref: '/rider/earnings',
    dashboardCta: {
      label: 'Go to Rider Dashboard',
      // Points to: app/(rider)/rider/page.tsx & app/(rider)/rider/layout.tsx
      href: '/rider',
      description: 'Active assignments, route map & earnings',
    },
    menuItems: [
      {
        label: 'My Profile',
        icon: CircleUserRound,
        // Points to: app/(rider)/rider/profile/page.tsx
        href: '/rider/profile',
      },
      {
        label: 'My Deliveries',
        icon: Bike,
        // Points to: app/(rider)/rider/jobs/page.tsx
        href: '/rider/jobs',
        badgeKey: 'deliveries',
      },
      {
        label: 'My Wallet & Earnings',
        icon: Wallet,
        // Points to: app/(rider)/rider/earnings/page.tsx
        href: '/rider/earnings',
      },
    ],
    settingsItem: {
      label: 'Rider Settings',
      icon: Settings,
      // Points to: app/(rider)/rider/profile/page.tsx
      href: '/rider/profile',
    },
    signOutItem: {
      label: 'Sign Out',
      icon: LogOut,
      destructive: true,
    },
  },
};

/**
 * Helper to safely extract role menu config with customer fallback
 */
export function getRoleMenuConfig(role?: string | null): RoleMenuConfig {
  if (role && (role === 'merchant' || role === 'rider' || role === 'customer')) {
    return USER_ROLE_MENUS[role];
  }
  return USER_ROLE_MENUS.customer;
}
