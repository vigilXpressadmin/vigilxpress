import type { Role } from '@/lib/types';
export function hasRole(roles: Role[] | null | undefined, role: Role) { return Boolean(roles?.includes(role)); }
export function canAccessDashboard(roles: Role[] | null | undefined, dashboard: 'merchant'|'rider'|'admin') {
  if (dashboard === 'admin') return hasRole(roles, 'admin');
  if (dashboard === 'merchant') return hasRole(roles, 'merchant') || hasRole(roles, 'admin');
  if (dashboard === 'rider') return hasRole(roles, 'rider') || hasRole(roles, 'admin');
  return false;
}
