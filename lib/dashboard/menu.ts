import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  Wallet,
  Star,
  Store,
  Bike,
  User,
  Users,
  CreditCard,
  Settings,
  PackageSearch,
  MapPin,
  type LucideIcon,
} from 'lucide-react';

export type DashboardRole = 'merchant' | 'rider' | 'admin' | 'customer';

export interface DashboardMenuItem {
  id: string;
  title: string;
  href: string;
  icon: LucideIcon;
  children?: DashboardMenuItem[];
}

export const merchantMenu: DashboardMenuItem[] = [
  {
    id: 'merchant-dashboard',
    title: 'Dashboard',
    href: '/merchant',
    icon: LayoutDashboard,
  },
  {
    id: 'merchant-orders',
    title: 'Orders',
    href: '/merchant/orders',
    icon: ShoppingBag,
  },
  {
    id: 'merchant-menu',
    title: 'Products',
    href: '/merchant/products',
    icon: UtensilsCrossed,
  },
  {
    id: 'merchant-wallet',
    title: 'Wallet',
    href: '/merchant/wallet',
    icon: Wallet,
  },
  {
    id: 'merchant-reviews',
    title: 'Reviews',
    href: '/merchant/reviews',
    icon: Star,
  },
  {
    id: 'merchant-settings',
    title: 'Store settings',
    href: '/merchant/settings',
    icon: Store,
  },
  {
    id: 'merchant-profile',
    title: 'Profile',
    href: '/merchant/profile',
    icon: User,
  },
];

export const riderMenu: DashboardMenuItem[] = [
  {
    id: 'rider-dashboard',
    title: 'Dashboard',
    href: '/rider',
    icon: LayoutDashboard,
  },
  {
    id: 'rider-jobs',
    title: 'New Jobs',
    href: '/rider/jobs',
    icon: Bike,
  },
  {
    id: 'rider-earnings',
    title: 'Earnings',
    href: '/rider/earnings',
    icon: Wallet,
  },
  {
    id: 'rider-profile',
    title: 'Profile',
    href: '/rider/profile',
    icon: User,
  },
];

export const adminMenu: DashboardMenuItem[] = [
  {
    id: 'admin-dashboard',
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    id: 'admin-restaurants',
    title: 'Approvals',
    href: '/admin/approvals',
    icon: Store,
  },
  {
    id: 'admin-riders',
    title: 'Riders',
    href: '/admin/riders',
    icon: Bike,
  },
  {
    id: 'admin-orders',
    title: 'Orders',
    href: '/admin/orders',
    icon: ShoppingBag,
  },
  {
    id: 'admin-customers',
    title: 'Customers',
    href: '/admin/customers',
    icon: Users,
  },
  {
    id: 'admin-payouts',
    title: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
  },
  {
    id: 'admin-settings',
    title: 'Service Areas',
    href: '/admin/service-areas',
    icon: Settings,
  },
  {
    id: 'admin-profile',
    title: 'Profile',
    href: '/admin/profile',
    icon: User,
  },
];

export const customerMenu: DashboardMenuItem[] = [
  {
    id: 'customer-orders',
    title: 'My Orders',
    href: '/orders',
    icon: PackageSearch,
  },
  {
    id: 'customer-addresses',
    title: 'Addresses',
    href: '/account/addresses',
    icon: MapPin,
  },
  {
    id: 'customer-profile',
    title: 'Profile',
    href: '/account',
    icon: User,
  },
];

export const ROLE_MENUS: Record<DashboardRole, DashboardMenuItem[]> = {
  merchant: merchantMenu,
  rider: riderMenu,
  admin: adminMenu,
  customer: customerMenu,
};

export const ROUTE_TITLES: Record<string, string> = {
  // Merchant
  '/merchant': 'Merchant Dashboard',
  '/merchant/orders': 'Orders',
  '/merchant/menu': 'Products & Catalogue',
  '/merchant/products': 'Products & Catalogue',
  '/merchant/wallet': 'Store Wallet',
  '/merchant/reviews': 'Reviews & Ratings',
  '/merchant/settings': 'Store Settings',
  '/merchant/profile': 'Merchant Profile',

  // Rider
  '/rider': 'Rider Dashboard',
  '/rider/jobs': 'Delivery Jobs',
  '/rider/earnings': 'Earnings & Payouts',
  '/rider/profile': 'Rider Profile',

  // Admin
  '/admin': 'Admin Dashboard',
  '/admin/restaurants': 'Approvals',
  '/admin/approvals': 'Partner Approvals',
  '/admin/riders': 'Riders',
  '/admin/orders': 'Platform Orders',
  '/admin/customers': 'Customers',
  '/admin/payouts': 'Payments & Reconciliation',
  '/admin/payments': 'Payments & Reconciliation',
  '/admin/settings': 'Service Areas',
  '/admin/service-areas': 'Service Areas',
  '/admin/profile': 'Admin Profile',

  // Customer account
  '/orders': 'My Orders',
  '/account': 'My Profile',
  '/account/addresses': 'Saved Addresses',
};

export function getTitleForPath(pathname: string): string {
  if (ROUTE_TITLES[pathname]) {
    return ROUTE_TITLES[pathname];
  }
  // Try prefix matching for dynamic segments (e.g. /orders/ord-123)
  for (const [route, title] of Object.entries(ROUTE_TITLES)) {
    if (pathname === route) return title;
    if (route !== '/' && pathname.startsWith(`${route}/`)) {
      const rest = pathname.slice(route.length + 1);
      return `${title}: ${rest}`;
    }
  }
  const segments = pathname.split('/').filter(Boolean);
  if (!segments.length) return 'Dashboard';
  const last = segments[segments.length - 1];
  return last
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
