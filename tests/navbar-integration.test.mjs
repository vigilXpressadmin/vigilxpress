import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

test('navbar role menu config has all 3 roles with existing routes', async () => {
  // Check user-menu-config.ts
  const configContent = fs.readFileSync(path.join(root, 'components/layout/user-menu-config.ts'), 'utf8');

  // Verify roles
  assert.ok(configContent.includes("customer:"), 'Customer role config exists');
  assert.ok(configContent.includes("merchant:"), 'Merchant role config exists');
  assert.ok(configContent.includes("rider:"), 'Rider role config exists');

  // Verify Dashboard CTAs
  assert.ok(configContent.includes("href: '/account'"), 'Customer dashboard route is /account');
  assert.ok(configContent.includes("href: '/merchant'"), 'Merchant dashboard route is /merchant');
  assert.ok(configContent.includes("href: '/rider'"), 'Rider dashboard route is /rider');

  // Verify dashboard route files exist on disk
  assert.ok(fs.existsSync(path.join(root, 'app/(customer)/account/page.tsx')), 'Customer account page exists');
  assert.ok(fs.existsSync(path.join(root, 'app/(merchant)/merchant/page.tsx')), 'Merchant dashboard page exists');
  assert.ok(fs.existsSync(path.join(root, 'app/(rider)/rider/page.tsx')), 'Rider dashboard page exists');

  // Verify sub-route files exist on disk
  assert.ok(fs.existsSync(path.join(root, 'app/(customer)/orders/page.tsx')), 'Customer orders page exists');
  assert.ok(fs.existsSync(path.join(root, 'app/(merchant)/merchant/profile')), 'Merchant profile route dir exists');
  assert.ok(fs.existsSync(path.join(root, 'app/(merchant)/merchant/settings')), 'Merchant settings route dir exists');
  assert.ok(fs.existsSync(path.join(root, 'app/(merchant)/merchant/wallet')), 'Merchant wallet route dir exists');
  assert.ok(fs.existsSync(path.join(root, 'app/(rider)/rider/profile')), 'Rider profile route dir exists');
  assert.ok(fs.existsSync(path.join(root, 'app/(rider)/rider/jobs')), 'Rider jobs route dir exists');
  assert.ok(fs.existsSync(path.join(root, 'app/(rider)/rider/earnings')), 'Rider earnings route dir exists');
});

test('navbar animations CSS uses CSS custom properties and reduced-motion fallback', async () => {
  const css = fs.readFileSync(path.join(root, 'components/layout/navbar-animations.css'), 'utf8');

  assert.ok(css.includes('--nav-duration-fast: 150ms;'), 'Custom property --nav-duration-fast defined');
  assert.ok(css.includes('--nav-duration: 250ms;'), 'Custom property --nav-duration defined');
  assert.ok(css.includes('--nav-ease: cubic-bezier(0.16, 1, 0.3, 1);'), 'Custom property --nav-ease defined');
  assert.ok(css.includes('@media (prefers-reduced-motion: no-preference)'), 'prefers-reduced-motion: no-preference wrapper exists');
  assert.ok(css.includes('@media (prefers-reduced-motion: reduce)'), 'prefers-reduced-motion: reduce fallback exists');
  assert.ok(css.includes('.nav-skeleton'), 'nav-skeleton shimmer class exists');
  assert.ok(css.includes('@keyframes nav-shimmer'), 'nav-shimmer keyframe exists');
});

test('navbar live data hooks, wallet balance card and menu badges exist', async () => {
  // Verify hook files exist
  assert.ok(fs.existsSync(path.join(root, 'lib/auth/use-user-session.ts')), 'useUserSession hook exists');
  assert.ok(fs.existsSync(path.join(root, 'lib/dashboard/use-role-dashboard-data.ts')), 'useRoleDashboardData hook exists');
  assert.ok(fs.existsSync(path.join(root, 'components/layout/wallet-balance-card.tsx')), 'WalletBalanceCard component exists');
  assert.ok(fs.existsSync(path.join(root, 'components/layout/menu-badge.tsx')), 'MenuBadge component exists');

  // Verify walletHref and badgeKey in user-menu-config.ts
  const config = fs.readFileSync(path.join(root, 'components/layout/user-menu-config.ts'), 'utf8');
  assert.ok(config.includes("walletHref: '/account'"), 'Customer walletHref points to /account');
  assert.ok(config.includes("walletHref: '/merchant/wallet'"), 'Merchant walletHref points to /merchant/wallet');
  assert.ok(config.includes("walletHref: '/rider/earnings'"), 'Rider walletHref points to /rider/earnings');
  assert.ok(config.includes("badgeKey: 'orders'"), 'Customer orders badgeKey configured');
  assert.ok(config.includes("badgeKey: 'store'"), 'Merchant store badgeKey configured');
  assert.ok(config.includes("badgeKey: 'deliveries'"), 'Rider deliveries badgeKey configured');

  // Verify navbar-auth-slot uses useUserSession and UserProfileMenu uses useRoleDashboardData
  const slotCode = fs.readFileSync(path.join(root, 'components/layout/navbar-auth-slot.tsx'), 'utf8');
  assert.ok(slotCode.includes('useUserSession'), 'navbar-auth-slot connects to useUserSession');

  const menuCode = fs.readFileSync(path.join(root, 'components/layout/user-profile-menu.tsx'), 'utf8');
  assert.ok(menuCode.includes('useRoleDashboardData'), 'user-profile-menu connects to useRoleDashboardData');
  assert.ok(menuCode.includes('WalletBalanceCard'), 'user-profile-menu renders WalletBalanceCard');
  assert.ok(menuCode.includes('MenuBadge'), 'user-profile-menu renders MenuBadge');
});

