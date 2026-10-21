'use client';

import React, { useState, useEffect } from 'react';
import { type DashboardRole } from '@/lib/dashboard/menu';
import { DashboardSidebar } from './sidebar';
import { DashboardTopbar } from './topbar';
import { DashboardBreadcrumb } from './breadcrumb';

interface DashboardShellProps {
  role: DashboardRole;
  children: React.ReactNode;
}

export function DashboardShell({ role, children }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mounted pattern from components/Navbar.tsx — NO document.body mutation!
  useEffect(() => {
    setMounted(true);
    const onResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className="min-h-screen bg-soft text-ink font-sans antialiased">
      {/* Sidebar (Desktop fixed rail + Mobile drawer) */}
      <DashboardSidebar
        role={role}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Topbar */}
      <DashboardTopbar
        role={role}
        collapsed={collapsed}
        onOpenMobile={() => setMobileOpen(true)}
      />

      {/* Main Content Area: pc-container / pc-content */}
      <main
        className={`transition-[padding] duration-200 min-h-screen bg-soft pt-20 p-4 sm:p-6 lg:p-8 ${
          collapsed ? 'lg:pl-[96px]' : 'lg:pl-[284px]'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb auto-generated from usePathname */}
          <DashboardBreadcrumb role={role} />

          {/* Child page contents */}
          <div className="space-y-6">{children}</div>
        </div>
      </main>
    </div>
  );
}

export default DashboardShell;
